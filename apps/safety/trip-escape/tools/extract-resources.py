"""Extract user-provided HWPX metadata/thumbnails and HWP teaching activities.

Original files are read only. No video files are fetched or redistributed.
Requires Python 3.11+, olefile, Pillow. Example:
  py tools/extract-resources.py --source "D:/coding/REA-Lab/input/지도서"
"""
from __future__ import annotations

import argparse
import collections
import hashlib
import io
import json
import re
import struct
import sys
import unicodedata
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
import zlib
from pathlib import Path

import olefile
from PIL import Image

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

APP = Path(__file__).resolve().parent.parent
SOURCE_NAME = "2026학년도 나.침.반 5분 안전교육동영상 링크자료 안내.hwpx"
LEVEL_ORDER = ["유", "초등저", "초등고", "중", "고"]
VENUE_RULES = {
    "sports": r"트램펄린|실내.{0,5}놀이|키즈카페|스포츠|체육|놀이터|운동|골절|준비운동",
    "cinema": r"극장|영화|다중[ ]?(?:이용|시설|밀집)|비상구|화재대피|에스컬레이터",
    "museum": r"박물관|전시|관람|현장[ ]?학습|체험[ ]?학습|미아|길을 잃|에스컬레이터",
    "experience": r"실험|실습|조리|요리|보호구(?!역)|가위|화상|현장[ ]?학습|체험[ ]?학습",
    "theme-park": r"놀이[ ]?공원|놀이기구|미아|유괴|길을 잃|다중[ ]?밀집|폭염",
    "park": r"야외|(?<!놀이)공원|일사병|열사병|폭염|벌[ ]?쏘|미세먼지|낙뢰|진드기|등산|미아|길을 잃",
    "garden": r"숲|야외|등산|식물|벌[ ]?쏘|진드기|폭염|알레르기|미세먼지|현장[ ]?학습",
    "heritage": r"궁궐|경복궁|문화유산|문화재|유적|궁능|한옥|고궁|현장[ ]?학습|체험[ ]?학습|보행|폭염|야외|온열|길을 잃|미아|낙뢰",
    "lodging": r"숙박|수학여행|수련|전기|멀티탭|식중독|화재|현장[ ]?학습|체험[ ]?학습",
    "bus": r"버스|차량[ ]?탑승|안전[ ]?(?:띠|벨트)|자동차|대중교통|보행|사각지대|주차장|후진",
    "rest": r"주차장|후진|뜨거운|화상|미아|유괴|길을 잃|식중독|알레르기|손[ ]?씻|식품",
    "night": r"숙박|수학여행|수련|정전|전기|멀티탭|약[ ]?사용|약물안전",
    "escape": r"화재|비상구|대피|연기|119|응급[ ]?상황",
}


def local(node):
    return node.tag.rsplit("}", 1)[-1]


def tidy(value):
    return unicodedata.normalize("NFC", re.sub(r"\s+", " ", value or "")).strip()


def text(node):
    return tidy("".join(n.text or "" for n in node.iter() if local(n) == "t"))


def paragraphs(node):
    return [text(p) for p in node.iter() if local(p) == "p"]


def yt_id(url):
    try:
        parsed = urllib.parse.urlparse(url)
        host = (parsed.hostname or "").lower()
        value = ""
        if host in ("youtu.be", "www.youtu.be"):
            value = parsed.path.strip("/").split("/")[0]
        elif host in ("youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"):
            value = urllib.parse.parse_qs(parsed.query).get("v", [""])[0]
            if not value and parsed.path.startswith(("/shorts/", "/embed/")):
                value = parsed.path.split("/")[2]
        return value if re.fullmatch(r"[A-Za-z0-9_-]{11}", value) else ""
    except (ValueError, IndexError):
        return ""


def venues_for(*values):
    corpus = " ".join(values)
    matches = [venue for venue, pattern in VENUE_RULES.items() if re.search(pattern, corpus)]
    # A shared '현장체험' topic also contains bus, camping and lodging videos.
    # Those specialized activities must not appear as palace-visit material.
    if "heritage" in matches and re.search(r"스포츠|등산|산행|산에서|숲놀이|동물원|숙박|숙소|수학여행|수련|버스|자동차|자전거|교통수단|캠핑|집에 혼자", " ".join(values[:2])):
        matches.remove("heritage")
    return matches


def recommendation_flags(record):
    """Conservative metadata screen, not a substitute for viewing the video."""
    corpus = " ".join(record.get(key, "") for key in ("domain", "topic", "keyword", "title"))
    sensitive = bool(re.search(r"폭력예방|약물.*중독|사이버.*중독|자살|성폭력|성범죄|성교육|학대|사망|숨져|참혹|데이트.?폭력|음주|흡연|마약", corpus))
    record["teacherOnly"] = sensitive
    if sensitive:
        record["venues"] = []
    # Water-activity videos are not automatically recommended for a lake-park visit.
    water_activity = bool(re.search(r"물놀이|수영|구명조끼|수상|물에 빠|구조방법|인명구조", corpus))
    news = bool(re.search(r"뉴스|NEWS|연합뉴스|YTN|SBS|MBC|KBS(?!Kids)", record.get("provider", ""), flags=re.I))
    record["studentRecommended"] = bool(record["venues"]) and not sensitive and not news and not water_activity
    record["requiresTeacherPreview"] = True


def levels_for(raw):
    # Preserve original alongside normalized filters; '초등처' is a source typo.
    s = re.sub(r"\s+", "", raw).replace("초등처", "초등저")
    result = set()
    for level in ("초등저", "초등고"):
        if level in s:
            result.add(level)
    if "초등" in s and not ({"초등저", "초등고"} & result):
        result.update(("초등저", "초등고"))
    remain = s.replace("초등저", "").replace("초등고", "").replace("초등", "")
    if "유" in remain:
        result.add("유")
    if "중" in remain:
        result.add("중")
    if "고" in remain:
        result.add("고")
    return [level for level in LEVEL_ORDER if level in result]


def clean_hwp_record(payload):
    units = [struct.unpack_from("<H", payload, i)[0] for i in range(0, len(payload) - 1, 2)]
    output, i = [], 0
    # HWP 5 extended control characters occupy eight UTF-16 code units.
    extended = set(range(1, 10)) | {11, 12} | set(range(14, 24))
    while i < len(units):
        code = units[i]
        if code in extended:
            i += 8
        elif code in (9, 10, 13):
            output.append("\n" if code != 9 else " ")
            i += 1
        elif code >= 32:
            output.append(chr(code))
            i += 1
        else:
            i += 1
    return "".join(output)


def read_hwp(data):
    lines = []
    with olefile.OleFileIO(io.BytesIO(data)) as ole:
        flag = struct.unpack_from("<I", ole.openstream("FileHeader").read(), 36)[0]
        for path in sorted(ole.listdir()):
            if path[0] != "BodyText" or not path[-1].startswith("Section"):
                continue
            body = ole.openstream(path).read()
            if flag & 1:
                body = zlib.decompress(body, -15)
            offset = 0
            while offset + 4 <= len(body):
                header = struct.unpack_from("<I", body, offset)[0]
                offset += 4
                tag, size = header & 1023, (header >> 20) & 4095
                if size == 4095:
                    size = struct.unpack_from("<I", body, offset)[0]
                    offset += 4
                payload = body[offset:offset + size]
                offset += size
                if tag == 67:
                    lines.append(clean_hwp_record(payload))
    return "\n".join(lines)


def zip_name(info):
    if info.flag_bits & 0x800:
        return info.filename
    try:
        return info.filename.encode("cp437").decode("cp949")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return info.filename


def extract_videos(source, audit):
    videos = []
    target = APP / "media/resources"
    target.mkdir(parents=True, exist_ok=True)
    image_cache = {}
    with zipfile.ZipFile(source / SOURCE_NAME) as archive:
        root = ET.fromstring(archive.read("Contents/section0.xml"))
        manifest = ET.fromstring(archive.read("Contents/content.hpf"))
        binary = {n.attrib["id"]: n.attrib["href"] for n in manifest.iter() if local(n) == "item"}
        domain, topic = "", ""
        table_index = -1
        for paragraph_index, p in enumerate(root):
            tables = [n for n in p.iter() if local(n) == "tbl"]
            if not tables:
                value = text(p)
                if domain and value:
                    topic = value
                continue
            for table in tables:
                table_index += 1
                if table.attrib.get("colCnt") == "2" and re.match(r"^[가나다라마바사]\s", text(table)):
                    domain = re.sub(r"^[가나다라마바사]\s*", "", text(table))
                    topic = ""
                    continue
                if table.attrib.get("colCnt") != "4":
                    continue
                inherited = {}
                for row in [n for n in table if local(n) == "tr"]:
                    cells = {}
                    row_number = -1
                    for cell in row:
                        address = next((n for n in cell if local(n) == "cellAddr"), None)
                        if address is not None:
                            col = int(address.attrib["colAddr"])
                            row_number = int(address.attrib["rowAddr"])
                            cells[col] = cell
                            span = next(n for n in cell if local(n) == "cellSpan")
                            for next_row in range(row_number + 1, row_number + int(span.attrib.get("rowSpan", 1))):
                                inherited[next_row, col] = cell
                    if 2 not in cells or not row_number:
                        continue
                    keyword_cell = cells.get(0, inherited.get((row_number, 0)))
                    level_cell = cells.get(3, inherited.get((row_number, 3)))
                    keyword = text(keyword_cell) if keyword_cell is not None else ""
                    level_raw = text(level_cell) if level_cell is not None else ""
                    cell_text = "\n".join(paragraphs(cells[2]))
                    blocks = re.split(r"(?=제\s*목\s*[:：])", cell_text)
                    blocks = [b for b in blocks if re.search(r"https?://", b)]
                    fields = [n.text or "" for n in cells[2].iter() if local(n) == "stringParam" and n.attrib.get("name") == "Path"]
                    image_refs = [n.attrib["binaryItemIDRef"] for n in cells.get(1, cells[2]).iter() if local(n) == "img" and "binaryItemIDRef" in n.attrib]
                    for block_index, block in enumerate(blocks):
                        urls = re.findall(r"https?://[^\s<>]+", block)
                        if not urls:
                            continue
                        # Text URL is retained verbatim; malformed displayed URLs use the authored hyperlink.
                        url = urls[0].rstrip(".,，。")
                        hyperlink = fields[block_index] if block_index < len(fields) else ""
                        if not yt_id(url) and yt_id(hyperlink):
                            audit["displayUrlFallbacks"].append({"table": table_index, "row": row_number, "display": url, "hyperlink": hyperlink})
                            url = hyperlink
                        parsed = urllib.parse.urlparse(url)
                        if parsed.scheme not in ("https", "http") or not parsed.hostname:
                            audit["rejectedUrls"].append(url)
                            continue
                        title = tidy(re.split(r"https?://", re.sub(r"^\s*제\s*목\s*[:：]\s*", "", block))[0])
                        if not title:
                            title = keyword or "원문 링크 영상"
                            audit["missingTitles"].append({"table": table_index, "row": row_number})
                        # Several authored rows omit the closing bracket, the word '출처', or its colon.
                        # Read only the metadata after the URL, preserving content rather than inventing fields.
                        after_url = re.split(r"https?://[^\s<>]+", block, maxsplit=1)[-1]
                        metadata = after_url.rsplit("[", 1)[-1].strip().rstrip("]").strip()
                        duration, provider = "", ""
                        duration_match = re.search(r"\d+\s*분(?:\s*\d+\s*초)?|\d+\s*초", metadata)
                        if duration_match:
                            duration = tidy(duration_match[0])
                            provider = tidy(re.sub(r"^[,，\s]*(?:출처\s*[:：]?\s*)?", "", metadata[duration_match.end():])).rstrip("] ")
                        youtube = yt_id(url)
                        thumbnail, image_ref = "", ""
                        if len(image_refs) == len(blocks):
                            image_ref = image_refs[block_index]
                        elif len(blocks) == 1 and len(image_refs) == 1:
                            image_ref = image_refs[0]
                        elif image_refs:
                            audit["thumbnailAmbiguities"].append({"table": table_index, "row": row_number, "records": len(blocks), "images": len(image_refs)})
                        if image_ref in binary:
                            if image_ref not in image_cache:
                                image_path = target / f"{image_ref}.webp"
                                try:
                                    image = Image.open(io.BytesIO(archive.read(binary[image_ref]))).convert("RGB")
                                    image.thumbnail((384, 216), Image.Resampling.LANCZOS)
                                    image.save(image_path, format="WEBP", quality=82, method=6)
                                    image_cache[image_ref] = f"media/resources/{image_ref}.webp"
                                except Exception as exc:
                                    audit["imageErrors"].append({"ref": image_ref, "error": str(exc)})
                                    image_cache[image_ref] = ""
                            thumbnail = image_cache[image_ref]
                        if not thumbnail and youtube:
                            thumbnail = f"https://i.ytimg.com/vi/{youtube}/hqdefault.jpg"
                        record = {
                            "id": f"compass-{len(videos) + 1:04d}", "title": title, "url": url,
                            "youtubeId": youtube, "domain": domain, "topic": topic,
                            "keyword": keyword, "levels": levels_for(level_raw), "levelOriginal": level_raw,
                            "duration": duration, "provider": provider, "thumbnail": thumbnail,
                            "sourceDoc": SOURCE_NAME,
                            "sourceRow": f"표 {table_index + 1} / 행 {row_number + 1} / 영상 {block_index + 1}",
                            "venues": venues_for(keyword, title, topic),
                            "verification": "원문 수록 링크 · 재생 및 자막은 수업 전 확인",
                            "sourceImageRef": image_ref,
                        }
                        if hyperlink and hyperlink != url:
                            record["originalHyperlink"] = hyperlink
                            audit["hyperlinkDifferences"].append(record["id"])
                        if not youtube:
                            audit["nonYoutubeUrls"].append({"id": record["id"], "url": url})
                        if not record["levels"]:
                            audit["unrecognizedLevels"].append({"id": record["id"], "raw": level_raw})
                        videos.append(record)
    audit["sourceThumbnailFiles"] = len(image_cache)
    audit["sourceVideoCount"] = len(videos)
    audit["domainCounts"] = dict(collections.Counter(v["domain"] for v in videos))
    audit["uniqueUrls"] = len(set(v["url"] for v in videos))
    audit["uniqueYoutubeIds"] = len(set(v["youtubeId"] for v in videos if v["youtubeId"]))
    return videos


ACTIVITY_PATTERNS = [
    (r"현장체험|체험학습", "출발 전 위험한 장면을 찾아보고, 이동·방문 장소별 안전 약속을 역할놀이로 연습해요. 실제 방문지의 사진·이동 동선·약속 장소로 바꾸어 적용해요."),
    (r"화재안전 대동여지도", "실제 시설의 비상구·피난 동선·소방시설 위치를 지도에 표시해요. 이동 지원이 필요한 학생의 지원 인력과 대피계획을 함께 확인해요."),
    (r"화재발생|화재\(지진\)|재난대응|자연재난", "경보를 알아차리고 안내에 따라 이동하는 연습을 해요. 과거 매뉴얼의 고정 행동 순서 대신 현재 시설의 피난계획과 대피 가능 여부에 맞춰 확인해요."),
    (r"일사병|열사병", "더운 날 몸의 변화를 알아차리고 그늘·물·휴식을 요청하는 장면을 연습해요. 학생에게 처치를 맡기기보다 즉시 교직원에게 알리는 행동을 익혀요."),
    (r"손 씻|손을 씻|손씻", "손 씻기가 필요한 때를 사진으로 고르고, 실제 손 씻기와 도움 요청을 함께 연습해요."),
    (r"안전띠", "안전띠 매기와 버스가 멈춘 뒤 움직이기를 실제 좌석 또는 모형으로 연습해요. 착용과 자세 유지에 도움이 필요하면 선생님께 요청해요."),
    (r"등산지도", "공원·수목원의 정해진 길, 물가·경사면, 쉬는 곳, 만남 장소를 지도에서 찾아요. 개인의 이동 방법에 맞는 경로를 먼저 확인해요."),
    (r"물놀이", "물에 들어가기 전 허용 장소·안내·구명조끼를 확인하는 역할놀이를 해요. 호수공원에서는 입수 활동과 구분해 물가에 접근하지 않고 위험 상황을 어른에게 알리도록 연습해요."),
    (r"심폐소생술", "응급상황에서 주변 어른에게 알리고 119 신고 도움을 요청하는 역할을 연습해요. 심폐소생술 실습은 지도자가 학생별 참여 방법을 정하고 모형으로 지도해요."),
    (r"황사|미세먼지", "외출 전 날씨·공기 상태를 함께 확인하고 활동 변경과 휴식을 요청하는 표현을 연습해요."),
]


def extract_activities(source, audit):
    activities, guide_hashes, inventory = [], {}, []
    for p in sorted(source.glob("나.침.반 체험형 안전교육 프로그램 안내*.hwp")):
        guide_hashes[p.name] = hashlib.sha256(p.read_bytes()).hexdigest()
        # Read the guide's actual body; all identical copies are audited, only one is analyzed.
        if len(guide_hashes) == 1:
            audit["guideTextRead"] = len(read_hwp(p.read_bytes()))
    audit["guideHashes"] = guide_hashes
    audit["guideCopiesIdentical"] = len(set(guide_hashes.values())) == 1
    for archive_path in sorted(source.glob("나.침.반 체험형 안전교육 프로그램(*).zip")):
        level = re.search(r"\(([^)]+)\)\.zip$", archive_path.name)[1]
        with zipfile.ZipFile(archive_path) as archive:
            for info in archive.infolist():
                name = zip_name(info)
                inventory.append({"archive": archive_path.name, "name": name, "size": info.file_size})
                if not name.endswith(".hwp"):
                    continue
                match = next(((pattern, summary) for pattern, summary in ACTIVITY_PATTERNS if re.search(pattern, name)), None)
                if not match:
                    continue
                try:
                    body = read_hwp(archive.read(info))
                except Exception as exc:
                    audit["hwpErrors"].append({"file": name, "error": str(exc)})
                    continue
                # Source text is inspected for actual content; the app receives adaptation guidance, not old personal details.
                excerpt = "\n".join(line for line in body.splitlines() if line.strip())
                title = re.sub(r"^\d+(?:-\d+)?\.\s*(?:\(첨부\))?\s*", "", name.removesuffix(".hwp"))
                activities.append({
                    "id": f"activity-{len(activities) + 1:02d}", "title": title, "level": level,
                    "summary": match[1], "sourceDoc": f"{archive_path.name} > {name}",
                    "venues": venues_for(title),
                    "sourceTextLength": len(body),
                    "note": "2016년 우수사례 일반화 자료를 현재 수업에 맞게 재구성한 활용 제안",
                })
                audit["readActivities"].append({"file": name, "characters": len(body), "sample": tidy(excerpt[:500])})
    audit["archiveInventory"] = inventory
    return activities


SUPPLEMENTS = [
    ("PEhqu5HH6Lc", "물놀이 안전교육 초등편", ["초등저", "초등고"], "경기도교육청TV", "생활안전", "물놀이 안전"),
    ("Xi55FZG1oUM", "물놀이 안전교육 중등편", ["중", "고"], "경기도교육청TV", "생활안전", "물놀이 안전"),
    ("yKn0RgwS8QM", "심폐소생술 관련 동영상", [], "사용자 제공 링크", "응급처치", "심폐소생술"),
    ("-q4r6HLFna0", "학교안전사고 예방 뽀로로와 친구들 3D 애니메이션", ["유", "초등저"], "경기도학교안전공제회", "생활안전", "학교 안전 사고"),
    ("8AYdHQWOQb8", "유치원 안전사고 사례 애니메이션", ["유"], "경기도학교안전공제회", "생활안전", "학교 안전 사고"),
    ("ea38LQZvREA", "초등학교 안전사고 사례 애니메이션", ["초등저", "초등고"], "경기도학교안전공제회", "생활안전", "학교 안전 사고"),
]


def add_supplements(videos, audit):
    ids = {v["youtubeId"] for v in videos}
    for video_id, given_title, levels, provider, domain, topic in SUPPLEMENTS:
        if video_id in ids:
            audit["supplementsAlreadyPresent"].append(video_id)
            continue
        title = given_title
        verified = False
        try:
            url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
            request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(request, timeout=12) as response:
                metadata = json.load(response)
            title = tidy(metadata.get("title") or given_title)
            provider = tidy(metadata.get("author_name") or provider)
            verified = True
        except Exception as exc:
            audit["supplementMetadataErrors"].append({"id": video_id, "error": str(exc)})
        videos.append({
            "id": f"user-{video_id}", "title": title, "url": f"https://www.youtube.com/watch?v={video_id}",
            "youtubeId": video_id, "domain": domain, "topic": topic, "keyword": topic, "levels": levels,
            "duration": "", "provider": provider, "thumbnail": f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
            "sourceDoc": "사용자가 제공한 경기도교육청 관련 영상 링크", "sourceRow": "사용자 추가 링크",
            "venues": venues_for(title, topic),
            "verification": "YouTube 제목·채널 메타데이터 확인 · 전체 재생·자막 미검증" if verified else "사용자 제공 설명 · 메타데이터 및 재생 확인 필요",
        })
        audit["supplementsAdded"].append({"id": video_id, "metadataVerified": verified})


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, type=Path)
    args = parser.parse_args()
    audit = collections.defaultdict(list)
    videos = extract_videos(args.source, audit)
    activities = extract_activities(args.source, audit)
    add_supplements(videos, audit)
    for record in videos:
        recommendation_flags(record)
    audit["teacherOnlyCount"] = sum(v["teacherOnly"] for v in videos)
    audit["studentRecommendationCount"] = sum(v["studentRecommended"] for v in videos)
    payload = {
        "videos": videos, "activities": activities,
        "sources": [
            {"title": SOURCE_NAME, "note": "경기도교육청 학교안전과 제공, 사용자 첨부 원문에서 제목·출처·권장 급별·링크·썸네일 추출. 영상 자체는 재배포하지 않음."},
            {"title": "나.침.반 체험형 안전교육 프로그램 안내(학교용)", "note": "2016년 우수사례 일반화 자료. 첨부 HWP 3개는 같은 파일. ZIP의 현장체험·화재·날씨·위생 활동을 읽고 활용안을 재구성."},
            {"title": "경기학생참여 안전교육 동영상(5편) 원문 게시글", "url": "https://www.goe.go.kr/home/bbs/bbsDetail.do?bbsId=979482&bbsMasterId=BBSMSTR_000000030062", "note": "사용자 제공 구주소. 현재 접근 및 개별 5편 수록 여부 확인 필요."},
            {"title": "모두가 함께하는 나.침.반 안전교육 동영상 시리즈(9편) 원문 게시글", "url": "https://www.goe.go.kr/home/bbs/bbsDetail.do?bbsId=979481&bbsMasterId=BBSMSTR_000000030062", "note": "사용자 제공 구주소. 현재 접근 및 전체 9편 수록 여부 확인 필요. HWPX에 개별 영상이 있는 경우 해당 목록에 보존."},
        ],
        "meta": {
            "extractedOn": "2026-11-13", "sourceVideoCount": audit["sourceVideoCount"], "videoCount": len(videos),
            "uniqueSourceUrls": audit["uniqueUrls"], "uniqueSourceYoutubeIds": audit["uniqueYoutubeIds"],
            "activityCount": len(activities), "domains": list(audit["domainCounts"]), "domainCounts": audit["domainCounts"],
            "levelOptions": LEVEL_ORDER, "sourceThumbnailFiles": audit["sourceThumbnailFiles"],
            "teacherOnlyCount": audit["teacherOnlyCount"], "studentRecommendationCount": audit["studentRecommendationCount"],
            "levelNote": "급별은 원문 권장사항이며, 교사가 학생의 이해·의사소통·감각 특성에 맞춰 선택합니다.",
            "venueNote": "장소 연결은 제목·키워드·주제의 규칙 기반 추천이며 원문 분류 또는 적합성 검증 결과가 아닙니다.",
            "previewNote": "제목·썸네일 추출은 영상 전체 내용·재생·자막의 검증을 의미하지 않습니다. 수업 전에 교사가 확인해 주세요.",
        },
    }
    (APP / "resources.js").write_text("/* Generated from user-provided source documents. See docs/source-audit.md. */\n(function(root){\nconst data = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\nroot.TripResources=data;\nif(typeof module==='object'&&module.exports) module.exports=data;\n})(typeof globalThis!=='undefined'?globalThis:this);\n", encoding="utf-8")
    docs = APP / "docs"
    docs.mkdir(exist_ok=True)
    report = ["# 나.침.반 원문 추출·검수 기록", "", "추출일: 2026-11-13", "", "## 범위와 방식", "", "- 사용자 첨부 HWPX를 XML 표 구조로 읽어 영역·주제·키워드·제목·권장 급별·재생시간·제작출처·주소를 추출했습니다.", "- 각 행의 그림 binaryItemIDRef와 문서 manifest를 대조해 원문 썸네일을 WebP로 변환했습니다. 영상 파일은 다운로드하거나 재배포하지 않았습니다.", "- 표 안에 영상이 여러 개 있는 경우 제목 단위로 분리했습니다. 원문의 중복 수록은 출처 맥락을 유지하기 위해 보존했습니다.", "- 급별 원문은 levelOriginal에 보존했습니다. 초등처 표기는 필터에서만 초등저로 정규화했습니다.", "- 장소 추천 venues는 제목·키워드·주제에 대한 규칙 기반 연결이며 원문 분류나 장애학생 적합성 검증 결과가 아닙니다.", "", "## 추출 통계", "", "```json", json.dumps(payload["meta"], ensure_ascii=False, indent=2), "```", "", "## 한계", "", "- 영상 전체 내용, 음성·자막, 광고, 연령제한, 현재 공개·재생 여부는 일괄 검증하지 않았습니다. 수업 전 교사의 사전 확인이 필요합니다.", "- 뉴스·사고 사례·실험 영상에는 놀라거나 불편할 수 있는 장면이 포함될 수 있습니다. 권장 급별만으로 학생 적합성을 확정하지 않습니다.", "- 원문에 포함된 예전 화재·응급처치 자료는 현행 공식 행동요령과 실제 시설의 피난계획을 확인한 뒤 사용합니다.", "- 체험형 자료는 안내문상 2016년 우수사례 일반화 자료입니다. 과거 계획서에 들어 있는 학교명·일정·개인정보는 게임 자료로 옮기지 않았습니다.", "- 원문 안내 목록과 ZIP의 실제 수록 파일 수는 다릅니다. 실제 읽은 첨부 활동만 데이터로 만들었습니다.", "- 구형 교육청 게시글 979481/979482는 현재 접근되지 않아 전체 시리즈 5편·9편의 완전 수록을 주장하지 않습니다.", "", "## 동일 안내문 확인", "", "```json", json.dumps(audit["guideHashes"], ensure_ascii=False, indent=2), "```", "", "## 실제 본문을 읽은 활동", ""]
    for activity, evidence in zip(activities, audit["readActivities"]):
        report.extend([f"### {activity['level']} · {activity['title']}", "", f"원본: {activity['sourceDoc']}", "", f"본문 추출: {activity['sourceTextLength']}자", "", f"활용 제안: {activity['summary']}", "", f"내용 확인 표본: {evidence['sample']}", ""])
    report.extend(["## 추출 예외 기록", "", "```json", json.dumps({key: value for key, value in audit.items() if isinstance(value, list) and key not in ("readActivities", "archiveInventory")}, ensure_ascii=False, indent=2), "```", "", "## ZIP 파일 목록", ""])
    report.extend(f"- {entry['archive']} > {entry['name']} ({entry['size']:,} bytes)" for entry in audit["archiveInventory"])
    heritage_direct = [video["id"] for video in videos if re.search(r"궁궐|경복궁|문화유산|문화재|유적|궁능|한옥|고궁", " ".join(video.get(key, "") for key in ("title", "topic", "keyword")))]
    report.extend(["", "## 문화유산·궁궐 연결 검수", "", f"영상 제목·키워드·주제에서 궁궐·경복궁·문화유산·문화재·유적·궁능·한옥·고궁 표현으로 검색한 직접 일치 항목: {len(heritage_direct)}개.", "", "25개 체험활동의 활동명에서도 해당 표현으로 직접 일치한 자료가 없었습니다. 영상 전체 내용을 모두 시청해 직접 소재의 유무를 확인한 결과는 아닙니다.", "", "heritage 장소 태그는 현장체험·보행·야외활동·폭염·미아 예방 등 공통 안전자료를 연결한 것입니다. 문화유산이나 궁궐 전용으로 제작된 자료라고 표시하지 않습니다. 실제 궁궐의 돌계단·문턱·이동 동선·관람 구역 등은 교사가 방문지 안내와 접근 가능한 경로를 별도로 확인합니다."])
    (docs / "source-audit.md").write_text("\n".join(report), encoding="utf-8")
    print(json.dumps(payload["meta"], ensure_ascii=False, indent=2))
    print("AUDIT", json.dumps({key: len(value) for key, value in audit.items() if isinstance(value, list) and key not in ("readActivities", "archiveInventory")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
