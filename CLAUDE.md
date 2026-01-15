# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

"나의 판결" - 실제 형사 사건 판결문을 읽고 사용자가 직접 형량을 판단해보는 웹 애플리케이션입니다. 사용자는 사건을 읽고 징역형 또는 벌금형을 선고한 후 실제 판결과 비교할 수 있습니다.

## 개발 환경 설정

### 필수 명령어

```bash
# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 린트 검사
npm run lint
```

### 환경 변수

`.env` 파일에 다음 변수들이 필요합니다:
- `VITE_API_URL`: 백엔드 API URL (https://mejudge-back.onrender.com)
- `VITE_IMG_BASEURL`: 이미지 베이스 URL (https://img.mejudge.com)
- `VITE_ADMIN_ID`: 관리자 사용자 ID

## 아키텍처

### 기술 스택
- **React 18.2.0** + TypeScript
- **Vite 7** (빌드 도구, SWC 사용)
- **Tailwind CSS 4** (스타일링)
- **React Router v7** (라우팅)
- **React Helmet Async** (SEO 메타 태그 관리)

### 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Layout.tsx      # 전체 레이아웃 (Header + Outlet)
│   ├── Header.tsx      # 네비게이션 헤더
│   ├── CaseList.tsx    # 사건 목록 컴포넌트
│   ├── CaseForm.tsx    # 사건 작성 폼 (관리자용)
│   ├── MasterForm.tsx  # 관리자 컴포넌트
│   ├── AskForm.tsx     # 문의 폼
│   ├── PrivacyForm.tsx # 개인정보처리방침
│   └── TermsForm.tsx   # 이용약관
├── pages/              # 페이지 컴포넌트
│   ├── Home.tsx        # 랜딩 페이지
│   ├── Main.tsx        # 사건 목록 페이지
│   ├── CasePage.tsx    # 사건 상세 + 선고 페이지
│   ├── Rank.tsx        # 랭킹 페이지
│   ├── Login.tsx       # 로그인 페이지
│   ├── Signup.tsx      # 회원가입 페이지
│   ├── Info.tsx        # 마이페이지
│   ├── Master.tsx      # 관리자 페이지
│   └── About.tsx       # 소개 페이지
├── App.tsx             # 라우터 설정
├── main.tsx            # 앱 진입점
└── index.css           # 전역 스타일
```

### 라우팅 구조

- `/` - 홈 페이지 (헤더 숨김)
- `/main` - 사건 목록
- `/case/:caseId` - 사건 상세/선고
- `/rank` - 랭킹
- `/login` - 로그인
- `/signup` - 회원가입
- `/info` - 마이페이지
- `/about` - 소개
- `/master20251208` - 관리자 페이지

`Layout` 컴포넌트가 모든 라우트를 감싸며, 홈(`/`) 페이지에서만 Header를 숨깁니다.

### 인증 시스템

- **JWT 토큰**: `localStorage`에 `MJKRtoken` 키로 저장
- **닉네임**: `localStorage`에 `MJKRnickname` 키로 저장
- **userId 추출**: `jwt-decode` 라이브러리 사용
- **관리자 확인**: `VITE_ADMIN_ID`와 현재 userId 비교

```typescript
const token = localStorage.getItem("MJKRtoken");
const { userId } = token ? jwtDecode<{ userId: string }>(token) : {};
```

### 핵심 기능 흐름

#### 1. 사건 목록 (CaseList.tsx)
- API에서 사건 목록을 페이지네이션으로 가져옴 (`?limit=` 파라미터)
- 각 사건의 상태 표시:
  - **미확인** (빨강): 읽지 않은 사건
  - **읽음** (노랑): 읽었지만 선고하지 않은 사건
  - **선고** (초록): 선고까지 완료한 사건
- 로딩 애니메이션: "사건 분류중..." 텍스트

#### 2. 사건 상세 및 선고 (CasePage.tsx)
- **사건 표시**: 제목, 웹툰 이미지(`${imgUrl}/cases/${caseNumber}/case${caseNumber}_1.webp`), 사건 내용
- **선고 UI**:
  - 징역형/벌금형 모드 전환
  - 징역형: 년/월 슬라이더, 집행유예 선택 (1-5년)
  - 벌금형: +/- 버튼으로 금액 조정
- **선고 후**: 실제 판결과 나의 판결 비교 표시
- **댓글 시스템**:
  - 좋아요/싫어요 기능 (낙관적 업데이트)
  - 좋아요 많은 상위 3개 댓글에 메달 표시 (금/은/동)
  - 무한 스크롤 (초기 3개, +10개씩 로드)
- **이전/다음 사건 네비게이션**
- **관리자 기능**: 사건 삭제, 댓글 삭제, 닉네임 변경

#### 3. SEO 최적화
- 모든 주요 페이지에 `react-helmet-async` 사용
- 페이지별 동적 title, description, canonical URL 설정

### API 통신 패턴

모든 API 요청은 `fetch`를 사용하며, 인증이 필요한 요청은 Authorization 헤더에 Bearer 토큰을 포함합니다:

```typescript
const res = await fetch(`${apiUrl}/api/endpoint`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("MJKRtoken")}`
  },
  body: JSON.stringify(data)
});
```

### 스타일링 규칙

- **반응형**: 모바일 우선, `md:` 브레이크포인트 사용
- **다크 테마**: 기본 배경 `bg-[#1a1a1a]`, 텍스트 `text-white`
- **레이아웃**: Flexbox 중심, `w-[90%] md:w-[50%] mx-auto` 패턴 사용
- **색상 시스템**:
  - 주요 액션: `bg-blue-600`
  - 비활성: `bg-gray-400` / `text-gray-500`
  - 위험한 액션: `text-red-600`
  - 성공: `text-green-500`
  - 경고: `text-yellow-500`

### 상태 관리

컴포넌트 레벨 상태 관리만 사용 (useState)하며, 전역 상태 관리 라이브러리는 사용하지 않습니다. 인증 정보는 localStorage에서 직접 읽습니다.

## 주의사항

- **반응형 필수**: 모든 UI는 모바일/데스크톱 대응 필요
- **성능**: CasePage는 많은 상태를 관리하므로 불필요한 리렌더링 주의
- **보안**: 관리자 기능은 반드시 `VITE_ADMIN_ID` 체크 필요
- **스크롤 처리**: CasePage에서 `scrollRef`를 사용하여 라우트 변경 시 최상단 스크롤
- **이미지 경로**: 사건 이미지는 `${imgUrl}/cases/${caseNumber}/case${caseNumber}_1.webp` 형식
