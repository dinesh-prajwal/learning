#!/bin/bash

echo "🚀 Building Android Release APK..."
echo ""

# Navigate to android directory
cd android

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Build release APK
echo "📦 Building Release APK..."
./gradlew assembleRelease

# Check if APK was created
if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo ""
    echo "✅ APK built successfully!"
    echo "📍 Location: android/app/build/outputs/apk/release/app-release.apk"
    echo "📊 File size: $(du -h app/build/outputs/apk/release/app-release.apk | cut -f1)"
    echo ""
    echo "💡 To install on connected device:"
    echo "   adb install app/build/outputs/apk/release/app-release.apk"
else
    echo ""
    echo "❌ Build failed. Check errors above."
    exit 1
fi
