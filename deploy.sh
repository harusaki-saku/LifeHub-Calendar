#!/usr/bin/env bash
# Deploy web-calendar to S3 + CloudFront
# Usage: ./deploy.sh

set -e

BUCKET="s3://showlabo-app/calendar/"
DISTRIBUTION_ID="E25V4WJBFAI6K5"
OUT_DIR="$(dirname "$0")/out"

echo "=== Building ==="
npm run build

echo "=== Syncing to S3 ==="
aws s3 sync "$OUT_DIR/" "$BUCKET" --delete --cache-control "no-cache"

echo "=== Invalidating CloudFront ==="
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/calendar/*" \
  --query "Invalidation.{Id:Id,Status:Status}" \
  --output table

echo "=== Done ==="
