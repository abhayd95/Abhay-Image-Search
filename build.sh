#!/bin/bash

# Clean previous build
rm -rf dist

# Install dependencies
npm install

# Build the project
npm run build

# Ensure proper MIME types for Render
echo "Setting up proper MIME types for Render deployment..."

# Create assets directory structure if it doesn't exist
mkdir -p dist/assets/css
mkdir -p dist/assets/js

# Move CSS files to proper location
if [ -d "dist/assets" ]; then
    find dist/assets -name "*.css" -exec mv {} dist/assets/css/ \;
    find dist/assets -name "*.js" -exec mv {} dist/assets/js/ \;
fi

echo "Build completed successfully!"
echo "Files are ready for Render deployment."