#!/bin/bash

# Script to get SHA-1 fingerprint for Google Sign-In setup
# This SHA-1 needs to be added to your Google Cloud Console OAuth 2.0 Client ID

echo "🔐 Getting SHA-1 Fingerprint for Google Sign-In..."
echo ""

# Method 1: Using keytool (for debug keystore)
echo "=== Method 1: Using keytool ==="
echo "SHA-1 Fingerprint:"
keytool -list -v -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android 2>/dev/null | grep -A 1 "SHA1:" | grep "SHA1:" | awk '{print $2}'

echo ""
echo "=== Method 2: Using Gradle (Alternative) ==="
echo "Run: cd android && ./gradlew signingReport"
echo ""

echo "📋 Your SHA-1 Fingerprint (copy this to Google Cloud Console):"
echo "5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25"
echo ""
echo "📝 Steps to add SHA-1 to Google Cloud Console:"
echo "1. Go to https://console.cloud.google.com/"
echo "2. Select your project"
echo "3. Go to APIs & Services > Credentials"
echo "4. Click on your Android OAuth 2.0 Client ID"
echo "5. Click 'Add fingerprint'"
echo "6. Paste the SHA-1 above"
echo "7. Save"
echo ""
echo "⚠️  For Release builds, you'll need to generate a release keystore"
echo "   and get its SHA-1 fingerprint separately."
