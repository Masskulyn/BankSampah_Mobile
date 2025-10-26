#!/bin/bash

echo "🚀 EcoBank - Capacitor Setup Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing Capacitor dependencies..."
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/camera @capacitor/filesystem @capacitor/preferences
npm install @capacitor-community/barcode-scanner

echo ""
echo "🏗️  Building web app..."
npm run build

echo ""
echo "⚙️  Initializing Capacitor..."
npx cap init "EcoBank" "id.ecobank.app" --web-dir=dist

echo ""
echo "📱 Adding Android platform..."
npx cap add android

echo ""
echo "🔄 Syncing project..."
npx cap sync android

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Open Android Studio: npx cap open android"
echo "2. Wait for Gradle sync"
echo "3. Build > Build APK"
echo ""
echo "Or run: npm run build && npx cap sync android && npx cap open android"
