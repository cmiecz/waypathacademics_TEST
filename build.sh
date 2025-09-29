#!/bin/bash
# Build script for Vercel deployment

echo "Installing dependencies..."
npm install --force

echo "Building for web..."
npx expo export --platform web --output-dir dist

echo "Build complete!"
