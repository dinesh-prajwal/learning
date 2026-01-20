# iOS Build Error Code 70 - Fix Guide

## What Error Code 70 Means

Error code 70 from `xcodebuild` typically indicates:
- **Missing or outdated CocoaPods dependencies**
- **Build configuration issues**
- **Missing signing certificates/provisioning profiles**
- **Xcode workspace/project configuration problems**

## Step-by-Step Fix

### Step 1: Clean Build Folders

```bash
# Clean iOS build
cd ios
rm -rf build/
rm -rf Pods/
rm -rf Podfile.lock
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Go back to root
cd ..
```

### Step 2: Reinstall CocoaPods Dependencies

```bash
cd ios

# Install CocoaPods dependencies
bundle exec pod install

# If bundle exec doesn't work, try:
pod install --repo-update
```

### Step 3: Clean Metro Bundler Cache

```bash
# From project root
npm start -- --reset-cache
```

### Step 4: Rebuild the Project

```bash
# Clean and rebuild
npm run ios

# Or if that fails, try:
cd ios
xcodebuild clean -workspace Learning_teach_app.xcworkspace -scheme Learning_teach_app
cd ..
npm run ios
```

### Step 5: Open in Xcode (Recommended)

If the above doesn't work, open the project in Xcode to see detailed error messages:

```bash
cd ios
open Learning_teach_app.xcworkspace
```

Then in Xcode:
1. Select your target (Learning_teach_app)
2. Go to **Signing & Capabilities**
3. Select your **Team** (Apple Developer account)
4. Check **Automatically manage signing**
5. Try building from Xcode (⌘ + B)

### Step 6: Check for Google Sign-In Pod Issues

Since you're using Google Sign-In, make sure the pod is properly installed:

```bash
cd ios
pod install
```

If you see errors about Google Sign-In, you may need to add it to Podfile:

```ruby
# Add to Podfile if not auto-linked
pod 'GoogleSignIn', '~> 7.0'
```

### Step 7: Verify Xcode Command Line Tools

```bash
xcode-select --print-path
# Should show: /Applications/Xcode.app/Contents/Developer

# If not, set it:
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

## Common Specific Issues

### Issue: "No such module 'GoogleSignIn'"

**Solution:**
```bash
cd ios
pod install
# Then rebuild
```

### Issue: Signing Certificate Problems

**Solution:**
1. Open Xcode
2. Go to **Preferences** → **Accounts**
3. Add your Apple ID
4. Select your project → **Signing & Capabilities**
5. Enable **Automatically manage signing**

### Issue: Pod Installation Fails

**Solution:**
```bash
# Update CocoaPods
sudo gem install cocoapods

# Clear CocoaPods cache
pod cache clean --all

# Reinstall
cd ios
pod install --repo-update
```

## Quick Fix Script

Run this complete fix script:

```bash
#!/bin/bash

echo "🧹 Cleaning iOS build..."
cd ios
rm -rf build/ Pods/ Podfile.lock
cd ..

echo "📦 Reinstalling CocoaPods..."
cd ios
pod install --repo-update
cd ..

echo "🚀 Rebuilding..."
npm run ios
```

## Still Not Working?

1. **Check Xcode version compatibility:**
   - React Native 0.83 requires Xcode 15+
   - Update Xcode if needed

2. **Check Node version:**
   ```bash
   node --version
   # Should be >= 20 (as per your package.json)
   ```

3. **Check for specific error in Xcode:**
   - Open `ios/Learning_teach_app.xcworkspace` in Xcode
   - Build (⌘ + B)
   - Check the **Issue Navigator** (⌘ + 5) for specific errors

4. **Check React Native version compatibility:**
   ```bash
   npx react-native info
   ```

## Additional Resources

- [React Native iOS Setup](https://reactnative.dev/docs/environment-setup)
- [CocoaPods Troubleshooting](https://guides.cocoapods.org/using/troubleshooting)
- [Xcode Build Errors](https://developer.apple.com/documentation/xcode/build-settings-reference)
