# Panduan Build APK untuk EcoBank App

## Prerequisites
- Node.js (v16 atau lebih baru)
- Android Studio (untuk build APK)
- JDK 11 atau lebih baru

## Step 1: Setup Environment

### Install Dependencies
```bash
npm install
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/camera @capacitor/filesystem @capacitor/preferences
```

### Install Android Studio
1. Download Android Studio dari https://developer.android.com/studio
2. Install Android SDK (API Level 33 atau lebih baru)
3. Setup ANDROID_HOME environment variable

## Step 2: Build Web App

```bash
# Build aplikasi web
npm run build

# Output akan ada di folder 'dist'
```

## Step 3: Initialize Capacitor (Hanya Pertama Kali)

```bash
# Initialize Capacitor
npx cap init

# Gunakan konfigurasi ini:
# App name: EcoBank
# App ID: id.ecobank.app
# Web directory: dist

# Add Android platform
npx cap add android
```

## Step 4: Update Capacitor QR Scanner

Ganti semua instance QR scanner di kode dengan Capacitor Camera:

```typescript
// components/QRScannerModal.tsx
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

// Install plugin
npm install @capacitor-community/barcode-scanner
npx cap sync
```

## Step 5: Update LocalStorage ke Capacitor Preferences

```bash
npm install @capacitor/preferences
```

Ganti localStorage dengan:
```typescript
import { Preferences } from '@capacitor/preferences';

// Save
await Preferences.set({ key: 'user', value: JSON.stringify(userData) });

// Get
const { value } = await Preferences.get({ key: 'user' });
const userData = value ? JSON.parse(value) : null;

// Remove
await Preferences.remove({ key: 'user' });

// Clear all
await Preferences.clear();
```

## Step 6: Sync & Build

```bash
# Copy web assets ke Android project
npx cap copy android

# Sync plugins
npx cap sync android

# Open di Android Studio
npx cap open android
```

## Step 7: Build APK di Android Studio

1. Android Studio akan terbuka
2. Tunggu Gradle sync selesai
3. Pilih **Build > Build Bundle(s) / APK(s) > Build APK(s)**
4. APK akan ada di: `android/app/build/outputs/apk/debug/app-debug.apk`

## Step 8: Build Release APK (Production)

### Generate Keystore (Pertama Kali)
```bash
keytool -genkey -v -keystore keystore/ecobank.keystore -alias ecobank -keyalg RSA -keysize 2048 -validity 10000
```

### Build Release
1. Di Android Studio: **Build > Generate Signed Bundle / APK**
2. Pilih **APK**
3. Pilih keystore file Anda
4. Masukkan password keystore
5. Pilih release build type
6. APK akan ada di: `android/app/release/app-release.apk`

## Step 9: Testing APK

```bash
# Install ke device/emulator
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Atau drag & drop APK ke emulator
```

## Troubleshooting

### Error: JAVA_HOME not set
```bash
# Windows
setx JAVA_HOME "C:\Program Files\Java\jdk-11"

# Mac/Linux
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home
```

### Error: Android SDK not found
1. Buka Android Studio
2. Tools > SDK Manager
3. Install Android SDK Platform 33

### QR Scanner tidak berfungsi
```bash
# Install barcode scanner plugin
npm install @capacitor-community/barcode-scanner
npx cap sync android

# Tambahkan permissions di AndroidManifest.xml
<uses-permission android:name="android.permission.CAMERA" />
```

### App crash saat dibuka
- Check Logcat di Android Studio
- Pastikan semua plugins sudah sync: `npx cap sync android`
- Clear cache: `npx cap clean android`

## Optimasi APK Size

### 1. Enable ProGuard (Minify)
Di `android/app/build.gradle`:
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 2. Generate App Bundle (Recommended)
```
Build > Generate Signed Bundle / APK > Android App Bundle
```
File .aab lebih kecil dan optimal untuk Google Play Store.

### 3. Split APKs by Architecture
```gradle
splits {
    abi {
        enable true
        reset()
        include 'armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'
        universalApk true
    }
}
```

## Deploy ke Google Play Store

1. Buat akun Google Play Developer ($25 one-time fee)
2. Build App Bundle (.aab file)
3. Upload di Play Console
4. Isi store listing, screenshots, deskripsi
5. Submit for review

## Alternative: PWA to APK (No Coding Required)

Jika tidak ingin setup Android Studio:

### Option A: PWA Builder
1. Deploy web app ke hosting (Vercel/Netlify)
2. Buka https://www.pwabuilder.com/
3. Masukkan URL website Anda
4. Download Android package
5. Sign & build APK online

### Option B: Cordova (Legacy)
```bash
npm install -g cordova
cordova create ecobank id.ecobank.app EcoBank
cd ecobank
cordova platform add android
cordova build android
```

## Perbandingan Metode

| Method | Pros | Cons | Complexity |
|--------|------|------|------------|
| **Capacitor** | Native performance, full API access | Perlu Android Studio | Medium |
| **PWA Builder** | No coding, fast | Limited native features | Easy |
| **Cordova** | Mature ecosystem | Legacy, slower updates | Medium |
| **React Native** | Truly native | Complete rewrite | High |

## Recommended: Capacitor

Untuk aplikasi EcoBank Anda, saya rekomendasikan **Capacitor** karena:
- ✅ QR Scanner butuh camera native access
- ✅ Performance lebih baik untuk localStorage/database
- ✅ Mudah update dari web version
- ✅ Support PWA sekaligus native app
- ✅ Active development & good documentation

## Quick Start Script

Saya sudah buatkan script automation:

```bash
# Run this script untuk auto setup
chmod +x setup-capacitor.sh
./setup-capacitor.sh
```

## Questions?

Jika ada error atau butuh bantuan:
1. Check Capacitor docs: https://capacitorjs.com/docs
2. Check Android docs: https://developer.android.com
3. Community: https://forum.ionicframework.com/

---

**Estimasi waktu setup**: 2-3 jam (pertama kali)  
**Estimasi waktu build**: 5-10 menit (setelah setup)
