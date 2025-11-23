#!/bin/bash

# EcoBank APK Build Script untuk Mac/Linux
# Usage: ./build-apk.sh debug   # atau release

BUILD_TYPE="${1:-debug}"
INSTALL_APK="${2:-false}"
CLEAN_BUILD="${3:-false}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js not found. Please install Node.js v16 or higher"
        exit 1
    fi
    print_success "Node.js found: $(node --version)"

    # Check Java
    if ! command -v java &> /dev/null; then
        print_error "Java not found. Please install JDK 11 or higher"
        exit 1
    fi
    print_success "Java found: $(java -version 2>&1 | head -1)"

    # Set ANDROID_HOME if not set
    if [ -z "$ANDROID_HOME" ]; then
        print_warning "ANDROID_HOME not set"
        if [ -d "$HOME/Library/Android/Sdk" ]; then
            export ANDROID_HOME="$HOME/Library/Android/Sdk"
            print_info "Setting ANDROID_HOME to: $ANDROID_HOME"
        elif [ -d "$HOME/Android/Sdk" ]; then
            export ANDROID_HOME="$HOME/Android/Sdk"
            print_info "Setting ANDROID_HOME to: $ANDROID_HOME"
        else
            print_error "Android SDK not found"
            print_info "Please set ANDROID_HOME environment variable"
            exit 1
        fi
    fi
    print_success "ANDROID_HOME: $ANDROID_HOME"

    # Check Android SDK
    if [ ! -d "$ANDROID_HOME/platforms" ]; then
        print_error "Android SDK not found at $ANDROID_HOME"
        print_info "Please install Android SDK using: sdkmanager \"platforms;android-33\""
        exit 1
    fi
    print_success "Android SDK found"
}

# Build web assets
build_web_assets() {
    print_info "Building web assets..."
    
    npm run build
    
    if [ $? -ne 0 ]; then
        print_error "Web build failed"
        exit 1
    fi
    
    print_success "Web assets built successfully"
}

# Sync Capacitor
sync_capacitor() {
    print_info "Syncing Capacitor..."
    
    npx cap copy android
    if [ $? -ne 0 ]; then
        print_error "Capacitor copy failed"
        exit 1
    fi
    
    npx cap sync android
    if [ $? -ne 0 ]; then
        print_error "Capacitor sync failed"
        exit 1
    fi
    
    print_success "Capacitor synced"
}

# Clean build
clean_build() {
    print_info "Cleaning build..."
    
    cd android
    ./gradlew clean
    cd ..
    
    print_success "Build cleaned"
}

# Build APK
build_apk() {
    local build_type=$1
    
    print_info "Building APK (Type: $build_type)..."
    
    cd android
    
    if [ "$build_type" = "debug" ]; then
        ./gradlew assembleDebug
        APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    else
        ./gradlew assembleRelease
        APK_PATH="app/build/outputs/apk/release/app-release.apk"
    fi
    
    cd ..
    
    if [ $? -ne 0 ]; then
        print_error "APK build failed"
        exit 1
    fi
    
    if [ -f "$APK_PATH" ]; then
        SIZE=$(du -h "$APK_PATH" | cut -f1)
        print_success "APK built successfully!"
        print_info "Location: $(pwd)/$APK_PATH"
        print_info "Size: $SIZE"
        echo "$APK_PATH"
    else
        print_error "APK file not found at $APK_PATH"
        exit 1
    fi
}

# Install APK
install_apk() {
    local apk_path=$1
    
    print_info "Installing APK..."
    
    # Check if adb is available
    if ! command -v adb &> /dev/null; then
        print_warning "adb not found. Please install Android SDK Platform Tools"
        print_info "Or add to PATH: $ANDROID_HOME/platform-tools"
        return
    fi
    
    # Get list of devices
    DEVICES=$(adb devices | tail -n +2 | awk '{print $1}' | grep -v "^$")
    
    if [ -z "$DEVICES" ]; then
        print_warning "No devices found. Please connect device or start emulator"
        return
    fi
    
    while IFS= read -r device; do
        if [ ! -z "$device" ] && [ "$device" != "offline" ]; then
            print_info "Installing on device: $device"
            adb -s "$device" install -r "$apk_path"
            
            if [ $? -eq 0 ]; then
                print_success "Installed successfully on $device"
            else
                print_error "Installation failed on $device"
            fi
        fi
    done <<< "$DEVICES"
}

# Main
main() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║     EcoBank APK Build Script          ║${NC}"
    echo -e "${CYAN}║     Build APK tanpa Android Studio    ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
    echo ""

    # Validate build type
    if [ "$BUILD_TYPE" != "debug" ] && [ "$BUILD_TYPE" != "release" ]; then
        print_error "Invalid build type. Use 'debug' or 'release'"
        exit 1
    fi

    # Check prerequisites
    check_prerequisites
    echo ""

    # Clean if requested
    if [ "$CLEAN_BUILD" = "true" ]; then
        clean_build
        echo ""
    fi

    # Build web assets
    build_web_assets
    echo ""

    # Sync Capacitor
    sync_capacitor
    echo ""

    # Build APK
    APK_PATH=$(build_apk "$BUILD_TYPE")
    echo ""

    # Install if requested
    if [ "$INSTALL_APK" = "true" ]; then
        install_apk "$APK_PATH"
    fi

    echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          BUILD COMPLETE! ✅            ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo "Next steps:"
    echo "  - Install APK: adb install -r \"$APK_PATH\""
    echo "  - Or: ./build-apk.sh $BUILD_TYPE true"
}

# Run main
main
