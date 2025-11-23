#!/usr/bin/env pwsh

# EcoBank APK Build Script untuk Windows (PowerShell)
# Usage: .\build-apk.ps1 -Type debug  # atau release

param(
    [ValidateSet("debug", "release")]
    [string]$Type = "debug",
    [switch]$Install,
    [switch]$Clean
)

# Colors untuk output
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Check prerequisites
function Check-Prerequisites {
    Write-Info "Checking prerequisites..."

    # Check Node.js
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Error "Node.js not found. Please install Node.js v16 or higher"
        exit 1
    }
    Write-Success "Node.js found: $(node --version)"

    # Check Java
    if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
        Write-Error "Java not found. Please install JDK 11 or higher"
        exit 1
    }
    Write-Success "Java found: $(java -version 2>&1 | Select-Object -First 1)"

    # Check ANDROID_HOME
    if (-not $env:ANDROID_HOME) {
        Write-Warning "ANDROID_HOME not set"
        Write-Info "Setting ANDROID_HOME to default location..."
        $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
    }
    Write-Success "ANDROID_HOME: $env:ANDROID_HOME"

    # Check Android SDK
    if (-not (Test-Path "$env:ANDROID_HOME\platforms")) {
        Write-Error "Android SDK not found at $env:ANDROID_HOME"
        Write-Info "Please install Android SDK using:"
        Write-Info "  sdkmanager `"platforms;android-33`""
        exit 1
    }
    Write-Success "Android SDK found"
}

# Build web assets
function Build-WebAssets {
    Write-Info "Building web assets..."
    
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Web build failed"
        exit 1
    }
    
    Write-Success "Web assets built successfully"
}

# Sync Capacitor
function Sync-Capacitor {
    Write-Info "Syncing Capacitor..."
    
    npx cap copy android
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Capacitor copy failed"
        exit 1
    }
    
    npx cap sync android
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Capacitor sync failed"
        exit 1
    }
    
    Write-Success "Capacitor synced"
}

# Clean build
function Clean-Build {
    Write-Info "Cleaning build..."
    
    Push-Location "android"
    .\gradlew.bat clean
    Pop-Location
    
    Write-Success "Build cleaned"
}

# Build APK
function Build-APK {
    param([string]$BuildType)
    
    Write-Info "Building APK (Type: $BuildType)..."
    
    Push-Location "android"
    
    if ($BuildType -eq "debug") {
        .\gradlew.bat assembleDebug
        $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
    }
    else {
        .\gradlew.bat assembleRelease
        $apkPath = "app\build\outputs\apk\release\app-release.apk"
    }
    
    Pop-Location
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "APK build failed"
        exit 1
    }
    
    if (Test-Path $apkPath) {
        $size = (Get-Item $apkPath).Length / 1MB
        Write-Success "APK built successfully!"
        Write-Info "Location: $(Get-Item $apkPath).FullName"
        Write-Info "Size: $([Math]::Round($size, 2)) MB"
        return $apkPath
    }
    else {
        Write-Error "APK file not found at $apkPath"
        exit 1
    }
}

# Install APK
function Install-APK {
    param([string]$ApkPath)
    
    Write-Info "Installing APK..."
    
    # Check if adb is available
    if (-not (Get-Command adb -ErrorAction SilentlyContinue)) {
        Write-Warning "adb not found. Please install Android SDK Platform Tools"
        Write-Info "Or set PATH to: $env:ANDROID_HOME\platform-tools"
        return
    }
    
    # Get list of devices
    $devices = adb devices | Select-Object -Skip 1 | Where-Object { $_ -ne "" }
    
    if ($devices.Count -eq 0) {
        Write-Warning "No devices found. Please connect device or start emulator"
        return
    }
    
    foreach ($device in $devices) {
        $deviceId = $device.Split()[0]
        if ($deviceId -ne "List" -and $deviceId -ne "" -and -not $deviceId.Contains("offline")) {
            Write-Info "Installing on device: $deviceId"
            adb -s $deviceId install -r $ApkPath
            
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Installed successfully on $deviceId"
            }
            else {
                Write-Error "Installation failed on $deviceId"
            }
        }
    }
}

# Main
function Main {
    Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║     EcoBank APK Build Script          ║" -ForegroundColor Cyan
    Write-Host "║     Build APK tanpa Android Studio    ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""

    # Check prerequisites
    Check-Prerequisites
    Write-Host ""

    # Clean if requested
    if ($Clean) {
        Clean-Build
        Write-Host ""
    }

    # Build web assets
    Build-WebAssets
    Write-Host ""

    # Sync Capacitor
    Sync-Capacitor
    Write-Host ""

    # Build APK
    $apkPath = Build-APK -BuildType $Type
    Write-Host ""

    # Install if requested
    if ($Install -and $apkPath) {
        Install-APK -ApkPath $apkPath
    }

    Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║          BUILD COMPLETE! ✅            ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
}

# Run main
Main
