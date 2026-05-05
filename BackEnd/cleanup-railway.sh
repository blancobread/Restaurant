#!/bin/zsh

echo "🚂 Starting Railway cleanup..."

# Remove Railway config files
find . -name "railway.json" -type f -delete 2>/dev/null
find . -name ".railway" -type d -exec rm -rf {} + 2>/dev/null

# Remove common build artifacts
rm -rf node_modules
rm -rf dist
rm -rf build
rm -rf .vite

# Remove logs
find . -name "*.log" -type f -delete 2>/dev/null

# Remove environment backups (optional)
find . -name ".env.local" -type f -delete 2>/dev/null

echo "✅ Local Railway cleanup complete."