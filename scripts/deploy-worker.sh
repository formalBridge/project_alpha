#!/bin/bash

# Worker 빌드 및 배포 스크립트 (GHCR)

set -e

# --- Configuration ---
GITHUB_USERNAME="formalbridge"
IMAGE_NAME="project_alpha-feed-worker"
IMAGE_TAG="${1:-latest}"
IMAGE_FULL_NAME="ghcr.io/${GITHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"

# --- Check for GITHUB_TOKEN ---
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Error: GITHUB_TOKEN environment variable is not set"
  echo "Please run: export GITHUB_TOKEN=your_github_token"
  exit 1
fi

# --- Login to GitHub Container Registry ---
echo "🔐 Logging in to GitHub Container Registry..."
if ! echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USERNAME" --password-stdin; then
  echo "❌ Failed to login to GitHub Container Registry"
  exit 1
fi

# --- Build and Push Multi-Platform Image ---
echo "🔨 Building and pushing feed worker Docker image..."
echo "Image: ${IMAGE_FULL_NAME}"

# Worker 디렉토리로 이동
cd workers/feed

# buildx를 사용해 amd64와 arm64 플랫폼을 모두 빌드하고 푸시
docker buildx build --platform linux/amd64,linux/arm64 -t "${IMAGE_FULL_NAME}" --push .

echo "✅ Image pushed successfully: ${IMAGE_FULL_NAME}"

# --- Deploy to Kubernetes ---
echo ""
read -p "Deploy to Kubernetes? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🚀 Deploying to Kubernetes..."
    cd ../..
    
    # Update deployment YAML with new image
    kubectl set image deployment/feed-worker feed-worker="${IMAGE_FULL_NAME}"
    
    echo "⏳ Waiting for rollout..."
    kubectl rollout status deployment/feed-worker
    
    echo "✅ Deployment complete"
    echo ""
    echo "📊 Worker status:"
    kubectl get pods -l app=feed-worker
    echo ""
    echo "📝 To view logs:"
    echo "kubectl logs -f deployment/feed-worker"
else
    echo ""
    echo "📝 To deploy manually, run:"
    echo "kubectl set image deployment/feed-worker feed-worker=${IMAGE_FULL_NAME}"
    echo "kubectl apply -f k8s/worker-deployment.yaml"
fi
