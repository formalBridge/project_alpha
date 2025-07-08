# GitHub Container Registry (GHCR) 가이드

이 가이드는 GitHub Container Registry를 사용하여 도커 이미지를 빌드하고 배포하는 방법을 설명합니다.

## 사전 요구사항

1. GitHub 계정
2. GitHub Personal Access Token (PAT) - `write:packages` 및 `read:packages` 권한 필요
3. Docker 설치
4. Kubernetes 클러스터 접근 권한

## 1. GitHub Personal Access Token 생성

1. GitHub 설정(https://github.com/settings/tokens)으로 이동
2. "Generate new token (classic)" 클릭
3. 다음 권한 선택:
   - `write:packages`
   - `read:packages`
   - `delete:packages` (선택사항, 이미지 삭제 시 필요)
4. 토큰 생성 후 안전한 곳에 보관

## 2. 도커 이미지 빌드 및 푸시

### 자동 스크립트 사용 (권장)

1. `scripts/build-and-push.sh` 파일 수정:
   ```bash
   GITHUB_USERNAME="formalBridge"  # GitHub 사용자명으로 변경
   IMAGE_NAME="project-alpha"
   VERSION="1.0.0"  # 버전 태그 (예: git 태그 또는 커밋 해시)
   ```

2. 스크립트에 실행 권한 부여:
   ```bash
   chmod +x scripts/build-and-push.sh
   ```

3. GitHub Personal Access Token으로 로그인 후 스크립트 실행:
   ```bash
   export GITHUB_TOKEN=your_github_token
   ./scripts/build-and-push.sh
   ```

### 수동으로 빌드 및 푸시

```bash
# GitHub Container Registry 로그인
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# 이미지 빌드
docker build -t ghcr.io/YOUR_GITHUB_USERNAME/project-alpha:1.0.0 .

# 이미지 태그 지정
docker tag ghcr.io/YOUR_GITHUB_USERNAME/project-alpha:1.0.0 ghcr.io/YOUR_GITHUB_USERNAME/project-alpha:latest

# 이미지 푸시
docker push ghcr.io/YOUR_GITHUB_USERNAME/project-alpha:1.0.0
docker push ghcr.io/YOUR_GITHUB_USERNAME/project-alpha:latest
```

## 3. Kubernetes에서 이미지 사용

### 1. GitHub Container Registry 인증을 위한 시크릿 생성

```bash
kubectl create secret docker-registry ghcr-credentials \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  --docker-email=YOUR_EMAIL
```

### 2. 배포 파일 업데이트

`k8s/app-deployment.yaml` 파일의 이미지 경로를 업데이트하세요:

```yaml
spec:
  containers:
  - name: project-alpha
    image: ghcr.io/YOUR_GITHUB_USERNAME/project-alpha:1.0.0
```

## 4. CI/CD 파이프라인 (GitHub Actions 예시)

`.github/workflows/docker-build.yml` 파일을 생성하여 자동화된 빌드 및 배포를 설정할 수 있습니다.

## 5. 이미지 관리

- **이미지 보기**: GitHub 패키지 페이지(https://github.com/users/YOUR_GITHUB_USERNAME/packages)에서 확인 가능
- **이미지 삭제**: GitHub 웹 인터페이스 또는 GitHub API를 통해 관리
- **권한 관리**: GitHub 저장소 설정에서 패키지 가시성 및 접근 권한 관리

## 문제 해결

### 인증 오류가 발생하는 경우

1. GitHub 토큰에 올바른 권한이 있는지 확인
2. 토큰이 만료되지 않았는지 확인
3. Docker 로그아웃 후 다시 로그인 시도:
   ```bash
   docker logout ghcr.io
   echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
   ```

### 이미지를 가져올 수 없는 경우

1. Kubernetes 시크릿이 올바르게 생성되었는지 확인
2. 이미지 주소가 정확한지 확인
3. 이미지가 비공개인 경우, Kubernetes 클러스터에서 접근 권한이 있는지 확인
