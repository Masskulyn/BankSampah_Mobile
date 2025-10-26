# TODO: Implement Live Camera Preview in QR Scanner Modal

## Steps to Complete

- [x] Add state for video stream in QRScannerModal.tsx
- [x] Modify startCamera function to get camera stream using navigator.mediaDevices.getUserMedia
- [x] Add video element in the scanning UI to display live camera feed
- [x] Style the video element with overlays for scanning instructions (e.g., frame, text)
- [x] Update stopCamera function to stop video stream
- [x] Handle camera access errors gracefully
- [x] Replace BarcodeScanner plugin with web-based QR scanning using html5-qrcode library
- [x] Install html5-qrcode library
- [x] Update scanning logic to use html5-qrcode for both preview and scanning
- [x] Add camera permissions to AndroidManifest.xml for Android 12+ compatibility
- [x] Update Capacitor config with camera permissions
- [x] Sync Capacitor plugins
- [x] Replace html5-qrcode with jsQR for better Android compatibility
- [x] Implement custom QR scanning using jsQR library
- [x] Build and sync APK
- [ ] Test the implementation on a device to ensure camera preview works
