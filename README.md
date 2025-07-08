# Project Alpha

첫 번째 MVP

# 기술 스택

- Remix (React + Vite)
- Prisma (PostgreSQL)
- TypeScript
- Docker
- pnpm

## 개발 환경 설정

### 필수 사전 요구사항

- [Docker](https://www.docker.com/) 및 Docker Compose
- [Node.js](https://nodejs.org/) (`.nvmrc` 또는 `.tool-versions` 파일 참조)
- [pnpm](https://pnpm.io/)

### 의존성 설치

```bash
# Node.js 버전 설정 (asdf 사용 시)
asdf install

# pnpm 활성화
corepack enable

# 의존성 설치
pnpm install
```

## 개발 서버 실행

### Docker를 사용한 개발 환경

```bash
# 개발 서버 시작 (백그라운드에서 실행)
pnpm run docker:dev

# 개발 서버 재시작 (변경사항 반영 시)
pnpm run docker:restart

# 로그 확인
pnpm run docker:logs

# 개발 서버 중지
pnpm run docker:down
```

### 로컬에서 직접 실행 (선택 사항)

```bash
# 의존성 설치 후
pnpm dev
```

## 데이터베이스 설정

### PostgreSQL 설정

프로젝트는 Docker Compose를 통해 PostgreSQL 데이터베이스를 자동으로 설정합니다.

```bash
# 데이터베이스 초기화 (필요 시)
pnpm run db:reset
```

### Prisma Studio (데이터베이스 관리 UI)

```bash
# Prisma Studio 실행 (별도 터미널에서)
pnpm run prisma:studio
```

## 접속 정보

- **애플리케이션**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555

## 주요 명령어

- `pnpm docker:dev`: 개발 서버 시작 (백그라운드)
- `pnpm docker:restart`: 개발 서버 재시작
- `pnpm docker:logs`: 로그 확인
- `pnpm docker:down`: 개발 서버 중지 및 정리
- `pnpm db:reset`: 데이터베이스 초기화
- `pnpm prisma:studio`: 데이터베이스 관리 UI 실행

## 환경 변수 설정

`.env.example` 파일을 참고하여 `.env` 파일을 생성하세요.

```bash
cp .env.example .env
```

## 문제 해결

### HMR이 작동하지 않는 경우

1. 브라우저 캐시를 지우고 새로고침 해보세요.
2. `pnpm run docker:restart`로 서버를 재시작해보세요.
3. 브라우저 개발자 도구의 네트워크 탭에서 HMR 연결 상태를 확인하세요.

### 데이터베이스 연결 문제

1. PostgreSQL 컨테이너가 실행 중인지 확인하세요.
2. `.env` 파일의 `DATABASE_URL`이 올바른지 확인하세요.
