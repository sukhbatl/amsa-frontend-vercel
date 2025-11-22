#!/bin/bash

# Quick fix script for production path issue
# This script stops PM2, removes the old config, and restarts with the correct one

set -euo pipefail

echo "🔧 Fixing AMSA Frontend production path issue..."

# Stop and delete the current PM2 process
echo "Stopping PM2 process..."
pm2 delete "AMSA Frontend" || pm2 delete amsa-frontend || true

# Remove old PM2 ecosystem config if it exists
if [ -f "/root/ecosystem.config.js" ]; then
  echo "Backing up old /root/ecosystem.config.js..."
  mv /root/ecosystem.config.js /root/ecosystem.config.js.backup.$(date +%Y%m%d_%H%M%S)
fi

# Start PM2 with the correct config from the repository
echo "Starting PM2 with repository config..."
cd /root/amsa/test/amsa-frontend
pm2 start ecosystem.config.js
pm2 save

echo "✅ Done! Checking status..."
pm2 list
pm2 logs "AMSA Frontend" --lines 10

echo ""
echo "If everything looks good, test your site:"
echo "  curl http://localhost:4000"
echo "  curl https://amsa.mn"

