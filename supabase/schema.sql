-- =========================================================
-- 달인 연구소 Supabase 설정 (SQL Editor에 통째로 붙여 넣고 Run)
-- 만드는 것: 방문 기록, 앱 클릭 집계, 게시판·댓글
-- 공개 키(anon)로는 '정해진 일'만 할 수 있게 막아 둡니다.
-- =========================================================

-- 1) 방문 기록 ------------------------------------------------
create table if not exists public.visits (
  id bigserial primary key,
  visited_at timestamptz not null default now()
);
alter table public.visits enable row level security;   -- 정책 없음 = 직접 읽기/쓰기 불가

create or replace function public.log_visit() returns void
language sql security definer set search_path = public as $$
  insert into public.visits default values;
$$;

create or replace function public.visit_stats() returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'today', (select count(*) from public.visits
              where visited_at >= (date_trunc('day', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul')),
    'total', (select count(*) from public.visits)
  );
$$;

-- 2) 앱 클릭 집계 ---------------------------------------------
create table if not exists public.app_clicks (
  app_id text primary key check (char_length(app_id) between 1 and 80),
  count  bigint not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.app_clicks enable row level security;
drop policy if exists "누구나 순위 보기" on public.app_clicks;
create policy "누구나 순위 보기" on public.app_clicks for select using (true);

create or replace function public.count_click(p_app text) returns void
language sql security definer set search_path = public as $$
  insert into public.app_clicks(app_id, count) values (left(p_app, 80), 1)
  on conflict (app_id) do update set count = app_clicks.count + 1, updated_at = now();
$$;

-- 3) 게시판 + 글 댓글 -----------------------------------------
create table if not exists public.feedback (
  id bigserial primary key,
  name      text not null check (char_length(name) between 1 and 20),
  category  text not null default '건의' check (category in ('건의','후기','피드백','버그 제보','질문','감사','앱 요청','댓글')),
  content   text not null check (char_length(content) between 2 and 1000),
  post_slug text check (post_slug is null or char_length(post_slug) <= 80),  -- 비어 있으면 게시판 글, 있으면 그 인사이트 글의 댓글
  reply     text,                    -- 관리자 답변 (Table Editor에서 직접 입력)
  hidden    boolean not null default false,  -- true로 바꾸면 화면에서 숨김
  created_at timestamptz not null default now()
);
create index if not exists feedback_slug_idx on public.feedback (post_slug, created_at desc);
alter table public.feedback enable row level security;

drop policy if exists "숨기지 않은 글 보기" on public.feedback;
create policy "숨기지 않은 글 보기" on public.feedback for select using (hidden = false);

drop policy if exists "누구나 글 쓰기" on public.feedback;
create policy "누구나 글 쓰기" on public.feedback for insert
  with check (reply is null and hidden = false);   -- 방문자는 답변·숨김 칸을 채울 수 없음

-- 같은 사람이 짧은 시간에 도배하지 못하게: 1분에 전체 20개 넘으면 거절
create or replace function public.feedback_rate_limit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.feedback where created_at > now() - interval '1 minute') >= 20 then
    raise exception '잠시 후 다시 시도해 주세요';
  end if;
  return new;
end $$;
drop trigger if exists feedback_rate_limit on public.feedback;
create trigger feedback_rate_limit before insert on public.feedback
  for each row execute function public.feedback_rate_limit();

-- 4) 공개 키에 허락하는 일 ------------------------------------
grant execute on function public.log_visit(), public.visit_stats(), public.count_click(text) to anon, authenticated;
grant select on public.app_clicks to anon, authenticated;
grant select (id, name, category, content, post_slug, reply, created_at, hidden), insert (name, category, content, post_slug) on public.feedback to anon, authenticated;
grant usage, select on sequence public.feedback_id_seq to anon, authenticated;
revoke all on public.visits from anon, authenticated;

-- 5) (이미 예전 schema.sql을 실행했다면) 게시판 글 종류를 새 목록으로 바꾸기 — 이 부분만 다시 실행해도 돼요
alter table public.feedback drop constraint if exists feedback_category_check;
alter table public.feedback add constraint feedback_category_check
  check (category in ('건의','후기','피드백','버그 제보','질문','감사','앱 요청','댓글'));
