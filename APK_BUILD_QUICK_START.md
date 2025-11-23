# Build APK Tanpa Android Studio - Quick Start

## 🚀 Quickest Way (3 Commands)

### Windows (PowerShell)
```powershell
# Set execution policy (first time only)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run build script
.\build-apk.ps1 -Type debug

# Or with install
.\build-apk.ps1 -Type debug -Install
```

### Mac/Linux
```bash
# Make script executable (first time only)
chmod +x build-apk.sh

# Run build script
./build-apk.sh debug

# Or with install
./build-apk.sh debug true
```

## ✅ Prerequisites Check

### Windows
```powershell
# Check Node.js
node --version

# Check Java
java -version

# Check Android SDK
$env:ANDROID_HOME
```

### Mac/Linux
```bash
# Check Node.js
node --version

# Check Java
java -version

# Check Android SDK
echo $ANDROID_HOME
```

## 📋 Step-by-Step Manual Build

### 1. Build Web Assets
```bash
npm run build
```

### 2. Sync Capacitor
```bash
npx cap copy android
npx cap sync android
```

### 3. Build Debug APK
```bash
cd android
gradlew.bat assembleDebug  # Windows
./gradlew assembleDebug    # Mac/Linux
cd ..
```

### 4. Find APK
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 5. Install to Device
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## 🔧 Build Release APK

### 1. Create Keystore (First Time Only)
```bash
# Windows
keytool -genkey -v -keystore keystore\ecobank.keystore -alias ecobank -keyalg RSA -keysize 2048 -validity 10000

# Mac/Linux
keytool -genkey -v -keystore keystore/ecobank.keystore -alias ecobank -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Update Signing Config
Edit `android/app/build.gradle`:

```gradle
signingConfigs {
    release {
        keyAlias 'ecobank'
        keyPassword 'YOUR_KEY_PASSWORD'
        storeFile file('../keystore/ecobank.keystore')
        storePassword 'YOUR_KEYSTORE_PASSWORD'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 3. Build Release APK
```bash
cd android
gradlew.bat assembleRelease  # Windows
./gradlew assembleRelease    # Mac/Linux
cd ..
```

### 4. Find Release APK
```
android/app/build/outputs/apk/release/app-release.apk
```

## 📦 Install to Device

### Single Device
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### All Connected Devices
```bash
# Windows
foreach ($device in @(adb devices | Select-Object -Skip 1 | Where-Object { $_ -ne "" })) {
    $deviceId = $device.Split()[0]
    adb -s $deviceId install -r android/app/build/outputs/apk/debug/app-debug.apk
}

# Mac/Linux
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
    if [ ! -z "$device" ]; then
        adb -s $device install -r android/app/build/outputs/apk/debug/app-debug.apk
    fi
done
```

### Drag & Drop to Emulator
Simply drag the APK file to the emulator window - it will auto-install.

## 🐛 Troubleshooting

### "JAVA_HOME not set"
```powershell
# Windows
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-11", [EnvironmentVariableTarget]::User)

# Mac/Linux
export JAVA_HOME=$(/usr/libexec/java_here -v 11)
```

### "Android SDK not found"
```bash
# Install SDK via sdkmanager
sdkmanager "platforms;android-33"
sdkmanager "build-tools;33.0.2"
```

### "No devices found"
```bash
# Check connected devices
adb devices

# Start emulator
emulator -avd Pixel_4_API_33

# Or connect real device with USB debugging enabled
```

### "Build failed" / "Gradle error"
```bash
cd android
gradlew clean
cd ..

# Then retry build
./build-apk.ps1 -Type debug  # Windows
./build-apk.sh debug          # Mac/Linux
```

## 📊 APK Sizes

| Type | Size | Optimized |
|------|------|-----------|
| Debug | ~50-70 MB | No |
| Release | ~15-25 MB | Yes (minified) |

## ⚡ Build Times

| Stage | Time |
|-------|------|
| Web build | ~10-15s |
| Capacitor sync | ~5-10s |
| APK build (debug) | ~30-60s |
| APK build (release) | ~60-90s |
| **Total** | **~2-3 minutes** |

## 📱 Test APK

```bash
# Launch app after install
adb shell am start -n id.ecobank.app/.MainActivity

# View logs
adb logcat | grep ecobank

# Clear app data
adb shell pm clear id.ecobank.app
```

## 🎯 Deployment

### Google Play Store
1. Build release APK
2. Go to Play Console (https://play.google.com/console)
3. Create app entry
4. Upload APK under Internal Testing
5. Add testers & distribute
6. After testing, promote to Production

### Direct Distribution
1. Upload APK to website/cloud
2. Users download & install via:
   - Email attachment
   - Cloud storage link
   - Direct download

## 💡 Tips

- ✅ Always test on real device before release
- ✅ Keep keystore password safe & backed up
- ✅ Use release APK for app store submission
- ✅ Debug APK is only for development/testing
- ✅ Monitor APK size - keep under 50MB if possible

## 📚 Resources

- [Capacitor Android Docs](https://capacitorjs.com/docs/android)
- [Android Build Guide](https://developer.android.com/build)
- [Gradle Documentation](https://gradle.org/guides)
- [ADB Commands](https://developer.android.com/tools/adb)

## ❓ FAQ

**Q: Can I build APK without Android SDK?**
A: No, you need at least Android SDK Platform & Build Tools

**Q: Is debug APK safe?**
A: Only for development/testing. Use release APK for distribution

**Q: Can I use same keystore for multiple apps?**
A: Yes, but it's recommended to use separate keystores

**Q: How to update app on Play Store?**
A: Build new release APK with higher version code & upload

**Q: Can I uninstall via script?**
A: Yes: `adb uninstall id.ecobank.app`

---

**Created**: November 23, 2025  
**Last Updated**: November 23, 2025  
**Status**: ✅ Production Ready
