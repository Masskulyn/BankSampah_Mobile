# 🚀 Quick Start - Build APK EcoBank

## Metode Tercepat (Tanpa Android Studio) - PWA Builder

### Step 1: Deploy Web App
```bash
# Option A: Vercel (Recommended - Gratis)
npm install -g vercel
vercel login
vercel --prod

# Option B: Netlify (Gratis)
npm install -g netlify-cli
netlify login
netlify deploy --prod

# Option C: GitHub Pages
npm run build
# Upload folder 'dist' ke GitHub Pages
```

### Step 2: Generate APK Online
1. Buka https://www.pwabuilder.com/
2. Masukkan URL website Anda (dari Vercel/Netlify)
3. Klik "Start" 
4. Klik "Package for Stores"
5. Pilih "Android"
6. Download APK yang sudah di-generate

**Keuntungan**: ✅ Tidak perlu install Android Studio, ✅ Cepat (5-10 menit)  
**Kekurangan**: ❌ Fitur terbatas, ❌ QR Scanner mungkin tidak optimal

---

## Metode Profesional (Dengan Android Studio) - Capacitor

### Prerequisites
1. **Node.js** - https://nodejs.org (v16+)
2. **Android Studio** - https://developer.android.com/studio
3. **JDK 11** - Included dengan Android Studio

### Step-by-Step

#### 1. Download Project
Download semua file dari Figma Make ke komputer lokal Anda.

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Run Setup Script
```bash
# Windows (Git Bash / WSL)
chmod +x setup-capacitor.sh
./setup-capacitor.sh

# Atau manual:
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "EcoBank" "id.ecobank.app" --web-dir=dist
npx cap add android
```

#### 4. Build Web App
```bash
npm run build
```

#### 5. Sync to Android
```bash
npx cap sync android
npx cap open android
```

#### 6. Build APK di Android Studio
1. Wait for Gradle sync (bisa 5-10 menit pertama kali)
2. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

#### 7. Install ke HP Android
```bash
# Via USB
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Atau kirim file APK via WhatsApp/Email, lalu install manual
```

### Build Release (Production)

```bash
# Di Android Studio
# Build → Generate Signed Bundle / APK → APK
# Buat keystore baru jika belum punya
# Build type: release
```

---

## Troubleshooting Umum

### ❌ "npm not found"
Install Node.js dari https://nodejs.org

### ❌ "Gradle sync failed"
1. Buka Android Studio
2. File → Settings → Build Tools → Gradle
3. Use Gradle from: 'gradle-wrapper.properties'

### ❌ "SDK not found"
1. Android Studio → Tools → SDK Manager
2. Install Android SDK Platform 33
3. Install Android SDK Build-Tools

### ❌ QR Scanner tidak jalan
Pastikan permissions sudah ditambahkan di `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" />
```

### ❌ App crash saat buka
Check logcat di Android Studio untuk error message.

---

## NPM Scripts Cheat Sheet

```bash
# Development
npm run dev                  # Run web version (localhost:3000)

# Build
npm run build               # Build untuk production
npm run preview            # Preview build result

# Android (setelah setup Capacitor)
npm run cap:sync           # Sync web assets ke Android
npm run cap:open           # Buka Android Studio
npm run android:build      # Build + Sync + Open (all-in-one)
npm run clean              # Clean build artifacts
```

---

## File Size Optimization

APK terlalu besar? Edit `android/app/build.gradle`:

```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
        }
    }
    
    // Split APK by architecture (menghasilkan multiple APK lebih kecil)
    splits {
        abi {
            enable true
            reset()
            include 'armeabi-v7a', 'arm64-v8a'
            universalApk false
        }
    }
}
```

---

## Perbandingan Metode

| Kriteria | PWA Builder | Capacitor | React Native |
|----------|------------|-----------|--------------|
| Setup Time | 10 menit | 2-3 jam | 2-3 hari |
| APK Size | ~15-20MB | ~25-40MB | ~30-50MB |
| Performance | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| QR Scanner | Basic | Full | Full |
| Native Access | Limited | Full | Full |
| Update Speed | Instant | Fast | Medium |

### Rekomendasi
- **Prototype/Testing**: PWA Builder
- **Production App**: Capacitor ⭐ **RECOMMENDED**
- **Jangka Panjang**: React Native (perlu rewrite)

---

## Next Steps After Build

1. **Test di real device** (minimal 3 HP berbeda)
2. **Test semua fitur** (QR scan, camera, storage)
3. **Optimize performance** (check logcat)
4. **Create app icon** (1024x1024 PNG)
5. **Create feature graphic** untuk Play Store
6. **Write store description**
7. **Upload ke Play Store**

---

## Upload ke Google Play Store

### Preparation
1. Buat akun Google Play Developer ($25 one-time)
2. Prepare assets:
   - App icon (512x512 PNG)
   - Feature graphic (1024x500 PNG)
   - Screenshots (minimal 2, max 8)
   - Privacy policy URL

### Build App Bundle (Recommended untuk Play Store)
```bash
# Di Android Studio
Build → Generate Signed Bundle / APK → Android App Bundle (.aab)
```

### Upload
1. Buka https://play.google.com/console
2. Create app
3. Upload .aab file
4. Fill store listing
5. Submit for review (biasanya 1-3 hari)

---

## Support

Butuh bantuan? Check:
- 📖 Capacitor Docs: https://capacitorjs.com/docs
- 📱 Android Docs: https://developer.android.com
- 💬 Stack Overflow: Tag `capacitor` atau `android`

---

**Estimasi Total Waktu**:
- ⚡ PWA Builder: 10-15 menit
- 🔧 Capacitor: 2-3 jam (first time), 10 menit (next builds)
- 📱 Play Store approval: 1-3 hari

Good luck! 🍀
