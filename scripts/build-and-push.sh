#!/bin/bash

# Exit on error
set -e

# --- Configuration ---
GITHUB_USERNAME="formalbridge"
IMAGE_NAME="project_alpha"
IMAGE_TAG="latest"
IMAGE_FULL_NAME="ghcr.io/${GITHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"

# --- Check for GITHUB_TOKEN ---
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN environment variable is not set"
  echo "Please run: export GITHUB_TOKEN=your_github_token"
  exit 1
fi

# --- Login to GitHub Container Registry ---
echo "Logging in to GitHub Container Registry..."
if ! echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USERNAME" --password-stdin; then
  echo "Failed to login to GitHub Container Registry"
  exit 1
fi

# --- Build and Push Multi-Platform Image using buildx ---
echo "Building and pushing multi-platform Docker image..."
# buildx를 사용해 amd64와 arm64 플랫폼을 모두 빌드하고, --push 옵션으로 바로 푸시합니다.
docker buildx build --platform linux/amd64,linux/arm64 -t "${IMAGE_FULL_NAME}" --push .

echo "Image pushed successfully: ${IMAGE_FULL_NAME}"

# --- Update Kubernetes deployment (optional) ---
echo "To update your Kubernetes deployment, update the image field in your deployment YAML to:"
echo "image: ${IMAGE_FULL_NAME}"
