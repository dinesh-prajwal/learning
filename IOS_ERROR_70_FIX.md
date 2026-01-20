# iOS Build Error Code 70 - Complete Fix Guide

## What Happened

✅ **Pods installed successfully** (line 692: "Pod installation complete!")
❌ **Build failed** with error code 70

Error code 70 from `xcodebuild` typically means **code signing/certificate configuration issues**.

## Quick Fix Steps

### Step 1: Open Project in Xcode

```bash
cd ios
open Learning_teach_app.xcworkspace
```

**IMPORTANT:** Always open the `.xcworkspace` file, NOT the `.xcodeproj` file!

### Step 2: Fix Signing & Capabilities

In Xcode:

1. **Select your project** in the left sidebar (top item "Learning_teach_app")
2. **Select the "Learning_teach_app" target** (under TARGETS)
3. Go to **"Signing & Capabilities"** tab
4. **Check "Automatically manage signing"**
5. **Select your Team** (your Apple ID/Developer account)
   - If you don't see your team, click "Add Account..." and sign in with your Apple ID
6. **Verify Bundle Identifier** matches your Google Cloud Console iOS OAuth client
   - Should be something like: `com.learning_teach_app` or similar

### Step 3: Clean Build Folder

In Xcode:
- Press **⌘ + Shift + K** (Product → Clean Build Folder)
- Or: **Product → Clean Build Folder**

### Step 4: Build from Xcode

- Press **⌘ + B** to build
- Or: **Product → Build**

This will show you the **exact error** if there are any remaining issues.

### Step 5: Run from Xcode

- Press **⌘ + R** to run
- Or: **Product → Run**

## Alternative: Fix via Command Line

If you prefer command line, try:

```bash
# 1. Clean everything
cd ios
rm -rf build/ DerivedData/
xcodebuild clean -workspace Learning_teach_app.xcworkspace -scheme Learning_teach_app

# 2. Set signing (if you know your team ID)
# You'll need to do this in Xcode first to get your Team ID

# 3. Try building again
cd ..
npm run ios
```

## Common Issues & Solutions

### Issue 1: "No signing certificate found"

**Solution:**
- In Xcode → Signing & Capabilities
- Select your Team
- Xcode will automatically create a development certificate

### Issue 2: "Bundle identifier is already in use"

**Solution:**
- Change Bundle Identifier in Xcode
- Or use your own Apple Developer account

### Issue 3: "Provisioning profile not found"

**Solution:**
- Check "Automatically manage signing" in Xcode
- Select your Team
- Xcode will create provisioning profile automatically

### Issue 4: Simulator Issues

If simulator is having issues:

```bash
# Reset simulator
xcrun simctl shutdown all
xcrun simctl erase all

# Or restart specific simulator
xcrun simctl boot "iPhone 17 Pro"
```

## What Was Fixed

1. ✅ **Added Google Sign-In URL scheme** to `Info.plist`
   - Required for OAuth redirect handling
   - URL scheme: `com.googleusercontent.apps.YOUR-CLIENT-ID`

2. ⚠️ **Signing configuration** needs to be set in Xcode
   - This is the main cause of error code 70
   - Must be done manually in Xcode

## After Fixing

Once signing is configured:

1. Build should succeed
2. App will install on simulator
3. Google Sign-In will work (URL scheme is now configured)

## Still Having Issues?

1. **Check Xcode version:**
   ```bash
   xcodebuild -version
   ```
   - React Native 0.83 requires Xcode 15+

2. **Check Node version:**
   ```bash
   node --version
   ```
   - Should be >= 20

3. **Check React Native setup:**
   ```bash
   npx react-native info
   ```

4. **View detailed build logs:**
   - Build in Xcode (⌘ + B)
   - Check the **Issue Navigator** (⌘ + 5) for specific errors

## Next Steps After Build Succeeds

1. Test Google Sign-In on iOS Simulator
2. Make sure you're signed into a Google account in iOS Settings
3. Verify the backend API URL is correct for iOS Simulator (`http://localhost:3000/api`)
