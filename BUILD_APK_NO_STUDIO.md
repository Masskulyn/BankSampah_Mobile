# Build APK Tanpa Android Studio

Panduan lengkap untuk build APK menggunakan Gradle wrapper tanpa perlu membuka Android Studio.

## Prerequisites

1. **Node.js** (v16+)

   ```bash
   node --version
   ```

2. **JDK 11+**

   ```bash
   java -version
   ```

3. **Android SDK** (minimal API 33)
   - Download dari: https://developer.android.com/studio/releases/android-studio#standalone-tools
   - Atau set `ANDROID_HOME` environment variable

## Step 1: Setup Environment Variables

### Windows (PowerShell)

```powershell
# Set JAVA_HOME
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-11", [EnvironmentVariableTarget]::User)

# Set ANDROID_HOME (jika belum ada Android Studio)
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\YourUsername\AppData\Local\Android\Sdk", [EnvironmentVariableTarget]::User)

# Add to PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", [EnvironmentVariableTarget]::User)
[Environment]::SetEnvironmentVariable("PATH", "$currentPath;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools", [EnvironmentVariableTarget]::User)

# Restart PowerShell untuk apply changes
```

### Mac/Linux

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 11)
export ANDROID_HOME=$HOME/Library/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Add ke ~/.zshrc atau ~/.bash_profile untuk permanent
```

## Step 2: Install Android SDK Command Line Tools

```bash
# Download (sudah included di build tools)
# Atau gunakan sdkmanager langsung

# List available packages
sdkmanager --list

# Install required SDK
sdkmanager "platforms;android-33"
sdkmanager "build-tools;33.0.2"
sdkmanager "cmdline-tools;latest"
```

## Step 3: Build Web Assets

```bash
npm run build
```

Ini akan generate folder `dist/` dengan semua web assets.

## Step 4: Sync Capacitor

```bash
# Copy web assets ke Android
npx cap copy android

# Sync plugins
npx cap sync android
```

## Step 5: Build Debug APK

```bash
cd android

# Windows
./gradlew assembleDebug
```

APK akan tersimpan di:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

## Step 6: Build Release APK

### Generate Keystore (Pertama Kali Saja)

```bash
# Windows
keytool -genkey -v -keystore keystore\ecobank.keystore -alias ecobank -keyalg RSA -keysize 2048 -validity 10000

# Mac/Linux
keytool -genkey -v -keystore keystore/ecobank.keystore -alias ecobank -keyalg RSA -keysize 2048 -validity 10000
```

Isikan data:

- Keystore password: `[your-secure-password]`
- Key password: `[same-password]`
- First and last name: `EcoBank Admin`
- Organizational Unit: `Development`
- Organization: `EcoBank`
- City: `Jakarta`
- State: `Indonesia`
- Country: `ID`

### Build Release APK

Edit `android/app/build.gradle` dan tambahkan signing config:

```gradle
signingConfigs {
    release {
        keyAlias 'ecobank'
        keyPassword '[your-key-password]'
        storeFile file('../keystore/ecobank.keystore')
        storePassword '[your-keystore-password]'
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

Atau buat file `gradle.properties`:

```properties
KEYSTORE_PATH=../keystore/ecobank.keystore
KEYSTORE_PASSWORD=[your-keystore-password]
KEY_ALIAS=ecobank
KEY_PASSWORD=[your-key-password]
```

Kemudian build:

```bash
cd android
gradlew.bat assembleRelease  # Windows
./gradlew assembleRelease    # Mac/Linux
```

Release APK akan tersimpan di:

```
android/app/build/outputs/apk/release/app-release.apk
```

## Step 7: Install ke Device/Emulator

### Via ADB

```bash
# Install debug APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Install release APK
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Via Emulator UI

1. Drag & drop APK file ke emulator window
2. Emulator akan auto install

## Troubleshooting

### Error: JAVA_HOME not set

```bash
# Cek path JDK
which java              # Mac/Linux
where java              # Windows

# Set path yang benar
export JAVA_HOME=/path/to/java/11  # Mac/Linux
setx JAVA_HOME "C:\path\to\jdk-11" # Windows
```

### Error: Android SDK not found

```bash
# Accept Android SDK licenses
sdkmanager --licenses

# Or accept semua sekaligus
yes | sdkmanager --licenses
```

### Gradle Build Failed

Clear cache dan rebuild:

```bash
cd android
gradlew clean
gradlew assembleDebug
```

### APK terlalu besar

Tambahkan minification:

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### APK tidak run di device

Pastikan API level device sesuai:

```bash
# Cek device API level
adb shell getprop ro.build.version.sdk

# Min API harus 33 atau lebih
# Edit android/app/build.gradle jika perlu diturunkan:
# minSdkVersion 26  (min API 26)
```

## Quick Build Script

Buat file `build-apk.sh` (Mac/Linux):

```bash
#!/bin/bash

echo "🔨 Building EcoBank APK..."

# Build web
echo "📦 Building web assets..."
npm run build

# Sync Capacitor
echo "📱 Syncing Capacitor..."
npx cap copy android
npx cap sync android

# Build APK
echo "🚀 Building APK with Gradle..."
cd android
./gradlew assembleDebug

# Output path
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"

if [ -f "$APK_PATH" ]; then
    echo "✅ APK berhasil dibuild!"
    echo "📍 Lokasi: $(pwd)/$APK_PATH"
    echo "📊 Ukuran: $(ls -lh $APK_PATH | awk '{print $5}')"
else
    echo "❌ APK build gagal"
    exit 1
fi
```

Gunakan:

```bash
chmod +x build-apk.sh
./build-apk.sh
```

## Perbandingan Build Methods

| Method                   | Kecepatan | Mudah | Native Perf |
| ------------------------ | --------- | ----- | ----------- |
| **Gradle (Recommended)** | ⚡⚡⚡    | ✅    | ✅✅✅      |
| Android Studio           | ⚡        | ✅    | ✅✅✅      |
| PWA Builder              | ⚡⚡      | ✅✅  | ⚠️          |
| Cordova                  | ⚡        | ⚠️    | ⚠️          |

## Deployment

### Install di Multiple Devices

```bash
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
    adb -s $device install app/build/outputs/apk/debug/app-debug.apk
done
```

### Upload ke Google Play

1. Build app bundle:

   ```bash
   cd android
   ./gradlew bundleRelease
   ```

2. Upload di Play Console:
   - File: `app/build/outputs/bundle/release/app-release.aab`
   - Tunggu review (~2-4 jam)

## Estimasi Waktu

- **Setup pertama kali**: 30-45 menit
- **Build APK berikutnya**: 3-5 menit
- **Build Release**: 5-10 menit

## Summary

✅ Build APK tanpa Android Studio **100% possible**
✅ Lebih cepat daripada menggunakan IDE
✅ Cocok untuk CI/CD pipeline
✅ Hemat resource komputer
