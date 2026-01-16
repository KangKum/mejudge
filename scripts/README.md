# 스크립트 사용 가이드

## generateSitemap.js

동적 sitemap을 생성하는 스크립트입니다.

### 사용법

```bash
# 백엔드 서버가 실행 중인지 확인한 후
node scripts/generateSitemap.js
```

### 기능

- 정적 페이지 (/, /about, /main, /rank, /login, /signup)
- 모든 사건 페이지 (/case/:id)

위 URL들을 자동으로 sitemap.xml에 추가합니다.

### 주의사항

1. **백엔드 서버 필수**: 스크립트 실행 전 백엔드 서버가 실행 중이어야 합니다.
2. **배포 전 실행**: 새로운 사건이 추가될 때마다 실행하여 sitemap을 업데이트하세요.
3. **CI/CD 통합**: 배포 파이프라인에 이 스크립트를 포함하면 자동화할 수 있습니다.

### 예시 (GitHub Actions)

``yaml
name: Generate Sitemap and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: node scripts/generateSitemap.js  # sitemap 생성
      - run: npm run build
      - run: # 배포 명령어
``

### 수동 sitemap 관리

스크립트를 사용하지 않고 수동으로 관리하려면:
1. `public/sitemap.xml` 파일을 직접 편집
2. 새 사건 추가 시 수동으로 URL 추가

하지만 **자동화를 강력히 권장**합니다.
