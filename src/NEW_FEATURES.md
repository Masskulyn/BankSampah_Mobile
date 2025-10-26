# Fitur Baru - EcoBank Mobile App

## 1. Carousel "Cara Kerja Bank Sampah Digital"
- **Lokasi**: Halaman Beranda
- **Fitur**: 
  - Auto-slide setiap 4 detik
  - Navigation arrows (prev/next) - hidden di mobile
  - Responsive untuk mobile dan desktop
  - Pause on hover
  - Dots indicators di bawah carousel (interaktif)
- **Library**: embla-carousel (via Shadcn UI Carousel)
- **Komponen**: `/components/StepsInfographic.tsx`

### Konfigurasi Carousel:
```javascript
{
  align: "start",
  loop: true,
  autoplay: {
    delay: 4000, // 4 detik
    stopOnInteraction: true
  },
  slidesToShow: {
    mobile: 1,    // basis-full
    tablet: 2,    // sm:basis-1/2
    desktop: 3    // lg:basis-1/3
  }
}
```

## 2. QR Scanner dengan Kamera Device
- **Lokasi**: Modal scan QR (tombol "Setor Sampah")
- **Fitur**:
  - Menggunakan kamera belakang device (`facingMode: "environment"`)
  - Real-time QR code scanning menggunakan library html5-qrcode
  - Fallback ke simulasi jika kamera tidak tersedia
  - Support multi-waste items dari QR code admin
  - Visual scanning overlay dengan frame dan animasi
- **Library**: html5-qrcode
- **Komponen**: `/components/QRScannerModal.tsx`

### Format QR Code yang Didukung:
```json
{
  "type": "deposit",
  "totalAmount": 8500,
  "wasteItems": [
    {
      "wasteType": "plastik",
      "wasteWeight": 2.5,
      "pricePerKg": 2000,
      "amount": 5000
    }
  ],
  "adminId": "admin_001",
  "timestamp": "2025-10-21T...",
  "transactionId": "TRX-..."
}
```

## 3. Sistem Notifikasi
- **Lokasi**: Icon Bell di header
- **Fitur**:
  - Notification panel slide dari kanan
  - Badge indicator untuk notifikasi belum dibaca
  - 5 tipe notifikasi: success, info, warning, reward, default
  - Mark as read functionality
  - Delete notification
  - Mark all as read
  - Timestamp relatif (X menit/jam/hari yang lalu)
  - Persisten di localStorage
- **Komponen**: `/components/NotificationPanel.tsx`

### Tipe Notifikasi:
1. **Success** (hijau): Setoran berhasil, pencairan berhasil
2. **Info** (biru): Tips ramah lingkungan, informasi umum
3. **Warning** (orange): Pengingat setor sampah
4. **Reward** (ungu): Poin bertambah, hadiah tersedia

### Demo Notifikasi:
- Setoran Berhasil dengan detail jumlah dan poin
- Poin Reward Bertambah
- Tips Ramah Lingkungan
- Pengingat Setor Sampah
- Konfirmasi Pencairan Saldo

## 4. Header dengan Z-Index Tertinggi
- **Lokasi**: Header utama aplikasi
- **Fitur**:
  - Z-index ditingkatkan ke `z-50` (sebelumnya `z-10`)
  - Memastikan header selalu tampil di depan semua elemen
  - Sticky position tetap dipertahankan
  - Tidak ada elemen yang overlap dengan header

### Z-Index Hierarchy:
```
Header: z-50
Notification Panel: z-[101]
Notification Overlay: z-[100]
Top Navigation Mobile Menu: z-50
Dialog/Modal: default (biasanya z-50)
```

## Instalasi Dependencies

Pastikan menambahkan library berikut ke `package.json`:

```json
{
  "dependencies": {
    "embla-carousel-react": "^8.6.0",
    "embla-carousel-autoplay": "^8.6.0",
    "html5-qrcode": "^2.3.8"
  }
}
```

**Note**: embla-carousel sudah termasuk dalam Shadcn UI Carousel component, jadi tidak perlu instalasi tambahan jika Anda sudah menggunakan Shadcn UI.

## CSS Custom untuk Carousel

Carousel menggunakan Shadcn UI Carousel component yang sudah include:
- Custom dots indicators (warna hijau, interaktif)
- Responsive breakpoints (mobile/tablet/desktop)
- Smooth transitions
- Auto-height cards
- Embla carousel engine untuk performa optimal

## Testing Checklist

### Carousel:
- [ ] Auto-slide berjalan setiap 4 detik
- [ ] Navigation arrows berfungsi
- [ ] Pause on hover berfungsi
- [ ] Responsive di mobile (1 slide)
- [ ] Responsive di tablet (2 slides)
- [ ] Responsive di desktop (3 slides)

### QR Scanner:
- [ ] Kamera belakang terbuka dengan benar
- [ ] Permission kamera diminta
- [ ] Fallback simulation berjalan jika kamera gagal
- [ ] QR code valid terdeteksi
- [ ] Multi-waste items ditampilkan dengan benar
- [ ] Saldo bertambah setelah scan berhasil

### Notifikasi:
- [ ] Bell icon menampilkan badge merah
- [ ] Panel slide dari kanan dengan smooth animation
- [ ] Notifikasi belum dibaca highlight dengan warna hijau
- [ ] Mark as read berfungsi
- [ ] Delete notification berfungsi
- [ ] Mark all as read berfungsi
- [ ] Timestamp relatif update dengan benar
- [ ] Data persisten di localStorage

### Header:
- [ ] Header tetap sticky di atas
- [ ] Tidak ada elemen yang overlap header
- [ ] Mobile menu tidak tertutup header
- [ ] Notification panel tidak tertutup header

## Troubleshooting

### Carousel tidak muncul:
- Pastikan embla-carousel-autoplay sudah terinstall
- Check console untuk error import embla-carousel
- Pastikan Shadcn UI Carousel component tersedia di `/components/ui/carousel.tsx`

### Kamera tidak terbuka:
- Pastikan aplikasi dijalankan di HTTPS (kecuali localhost)
- Check permission kamera di browser
- Fallback simulation akan jalan otomatis jika gagal

### Notifikasi tidak muncul:
- Check localStorage: `ecobank_notifications`
- Pastikan NotificationPanel component di-render di App.tsx

### Header overlap dengan elemen:
- Check z-index elemen lain, pastikan < 50
- Pastikan tidak ada position: fixed dengan z-index tinggi

## Future Enhancements

1. **Carousel**: ✅ Swipe gesture sudah built-in di embla-carousel
2. **QR Scanner**: Tambah flashlight toggle untuk kondisi gelap
3. **Notifikasi**: Push notification dengan service worker
4. **Header**: Progressive collapse on scroll untuk lebih banyak ruang konten

## Technical Notes

### Mengapa Menggunakan Embla Carousel?

Kami beralih dari react-slick ke embla-carousel (via Shadcn UI) karena:
1. **No Binary Dependencies**: Embla tidak memerlukan CSS/font files yang menyebabkan build errors
2. **Better Performance**: Lebih ringan dan cepat, cocok untuk mobile
3. **Modern API**: TypeScript support yang lebih baik
4. **Touch Optimized**: Built-in swipe gestures untuk mobile
5. **Framework Agnostic**: Mudah di-maintain dan di-upgrade
6. **Shadcn Integration**: Seamless dengan komponen UI lainnya
