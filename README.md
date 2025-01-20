# Project Alpha

첫 번째 MVP

# 기술

- remix
- prisma
- typescript
- cloudflare worker
- pnpm

## 개발 환경 세팅

- `package.json`에 명시되어있는 버전의 [nodejs](https://nodejs.org/)와 [pnpm](https://pnpm.io/)이 필요합니다.
  - (추천) [asdf](https://asdf-vm.com/)를 사용하는 경우, 프로젝트 내에서 아래 명령어들을 입력
    ```
    $ asdf install
    $ corepack enable
    $ asdf reshim nodejs
    ```
  - [nvm](https://github.com/nvm-sh/nvm)을 사용하는 경우, 프로젝트 내에서 아래 명령어들을 입력
    ```
    $ nvm install
    $ corepack enable
    ```
  - 혹시 `package.json` 파일의 내용이 갱신되어 필요한 런타임 버전이 바뀌었다면, 위 명령어들을 다시 입력
- 프로젝트 전체 의존성을 설정하기 위해, 프로젝트 루트 디렉토리에서 아래 명령어를 입력합니다.
  ```
  $ pnpm install
  ```
- 개발 서버를 실행시킵니다.
	```sh
	pnpm dev
	```

## DB 세팅

cloudflare의 d1 데이터베이스를 사용합니다.
다음을 입력하여 local development를 시작합니다.

```
wrangler dev
```

로컬db에 스키마 마이그레이션을 실행합니다.
```
pnpm run-migration --local
```
