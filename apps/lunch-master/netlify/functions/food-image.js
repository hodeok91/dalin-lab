const API_URL = "https://api.unsplash.com/search/photos";

exports.handler = async function (event) {
  if (event.httpMethod !== "GET") {
    return respond(405, { error: "GET 요청만 사용할 수 있습니다." });
  }

  const query = String(event.queryStringParameters?.q || "").trim();
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!query) return respond(400, { error: "이미지 검색어가 없습니다." });
  if (!accessKey) return respond(200, { image: null });

  try {
    const params = new URLSearchParams({
      query,
      per_page: "1",
      orientation: "squarish",
      content_filter: "high"
    });

    const apiResponse = await fetch(`${API_URL}?${params.toString()}`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        Accept: "application/json"
      }
    });

    if (!apiResponse.ok) {
      throw new Error(`Unsplash API 오류 (${apiResponse.status})`);
    }

    const data = await apiResponse.json();
    const photo = data?.results?.[0];
    if (!photo) return respond(200, { image: null });

    const profileBase = photo.user?.links?.html || "";
    const photoBase = photo.links?.html || "";

    return respond(200, {
      image: {
        id: photo.id || "",
        url: photo.urls?.small || photo.urls?.regular || "",
        photographer: photo.user?.name || "",
        profileUrl: profileBase
          ? `${profileBase}?utm_source=today_lunch_app&utm_medium=referral`
          : "",
        photoUrl: photoBase
          ? `${photoBase}?utm_source=today_lunch_app&utm_medium=referral`
          : ""
      }
    });
  } catch (error) {
    console.error("Unsplash 이미지 검색 오류:", error);
    return respond(200, { image: null });
  }
};

function respond(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400"
    },
    body: JSON.stringify(body)
  };
}
