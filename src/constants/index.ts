// 메달 표시 기준
export const MEDAL_THRESHOLD = 2; // 좋아요 2개 이상일 때 메달 표시

// 댓글 로딩
export const INITIAL_COMMENT_LIMIT = 3; // 초기 댓글 표시 개수
export const COMMENT_LOAD_INCREMENT = 10; // "더보기" 클릭 시 추가 로딩 개수

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  TOKEN: "MJKRtoken",
  NICKNAME: "MJKRnickname",
} as const;

// 형량 범위
export const SENTENCE_LIMITS = {
  YEAR_MAX: 50,
  YEAR_MIN: 0,
  MONTH_MAX: 11,
  MONTH_MIN: 0,
  SUSPEND_MIN_REQUIREMENT_YEARS: 3, // 집행유예 가능 최소 형량 (년)
  SUSPEND_MAX_YEARS: 4, // 집행유예 불가 형량 (년 이상)
} as const;

// 선고 모드
export const SENTENCE_MODE = {
  PRISON: 0, // 징역형
  FINE: 1, // 벌금형
} as const;

// 댓글 최대 길이
export const MAX_COMMENT_LENGTH = 300;

// API 엔드포인트
export const API_ENDPOINTS = {
  CASE: "/api/case",
  CASES: "/api/cases",
  LOGIN: "/api/login",
  SIGNUP: "/api/signup",
  JUDGEMENT: "/api/judgement",
  COMMENT: "/api/comment",
  RANKING: "/api/ranking/user-likes",
  CHECK_ADMIN: "/api/check-admin",
} as const;
