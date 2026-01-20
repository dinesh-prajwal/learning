# How to Get SHA-1 Fingerprint for Your Android Project

## Quick Commands

### For Debug Keystore (Development)

```bash
cd android/app
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**Or get just the SHA-1:**
```bash
cd android/app
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android | grep -A 1 "SHA1:" | grep "SHA1:" | awk '{print $2}'
```

### Using Gradle (Alternative Method)

```bash
cd android
./gradlew signingReport
```

Look for the SHA-1 under the "Variant: debug" section.

---

## For Release Keystore (Production)

If you have a release keystore, use:

```bash
cd android/app
keytool -list -v -keystore my-release-key.keystore -alias my-key-alias
```

Replace `my-release-key.keystore` and `my-key-alias` with your actual keystore file name and alias.

**You'll be prompted for the password** (the one you set when creating the keystore).

---

## One-Line Commands

### Debug SHA-1 (Quick Copy)
```bash
cd android/app && keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android | grep "SHA1:" | awk '{print $2}'
```

### Release SHA-1 (Quick Copy)
```bash
cd android/app && keytool -list -v -keystore my-release-key.keystore -alias my-key-alias | grep "SHA1:" | awk '{print $2}'
```

---

## Using the Existing Script

You already have a script at `android/get-sha1.sh`. Run it:

```bash
cd android
bash get-sha1.sh
```

---

## What You'll See

The output will look like:

```
Certificate fingerprints:
     SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
     SHA256: FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
```

**Copy the SHA-1** (the first one) to Google Cloud Console.

---

## Where to Add SHA-1

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your **Android OAuth 2.0 Client ID**
5. Click **"Add fingerprint"**
6. Paste your SHA-1 fingerprint
7. Click **Save**

---

## Important Notes

- **Debug SHA-1**: Use this for development/testing
- **Release SHA-1**: Use this for production builds (if you have a release keystore)
- **Add both** to Google Cloud Console if you plan to use both debug and release builds
- The SHA-1 must match exactly (including colons)

---

## Troubleshooting

### "Keystore file does not exist"
- Make sure you're in the `android/app` directory
- Check the keystore file name matches

### "Password was incorrect"
- Debug keystore password is always `android`
- Release keystore password is what you set when creating it

### "Alias does not exist"
- Debug keystore alias is always `androiddebugkey`
- Release keystore alias is what you set when creating it
