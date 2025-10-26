# 📰 Article Management - Admin Feature

## Overview

Admin sekarang dapat membuat, mengedit, dan mengelola artikel berita serta tips lingkungan melalui dashboard admin. Artikel yang dibuat akan langsung muncul di aplikasi untuk semua pengguna.

## Akses Admin

**Email**: admin@ecobank.id  
**Password**: admin123

## Fitur Article Management

### 1. **Tab Artikel di Admin Dashboard**
- Tab baru "Artikel" ditambahkan di admin dashboard
- Akses cepat melalui Quick Actions: "Kelola Artikel & Tips"

### 2. **Create Article (Buat Artikel Baru)**

#### Form Input:
- **Judul Artikel** * (required)
- **Ringkasan** * (required) - Deskripsi singkat 1-2 kalimat
- **Konten Artikel** * (required) - Konten lengkap dengan formatting
- **Kategori** - Pilihan: Tips, Lingkungan, Teknologi, Ekonomi, Komunitas
- **Waktu Baca** - Estimasi waktu baca (default: "5 menit")
- **URL Gambar** - Link gambar artikel (optional, ada default image)
- **Nama Penulis** - Default: "Admin EcoBank"
- **Posisi Penulis** - Default: "Editor"
- **Tags** - Pisahkan dengan koma (contoh: tips, lingkungan, daur-ulang)

#### Content Formatting:
- Gunakan `**text**` untuk membuat teks **tebal**
- Pisahkan paragraf dengan enter ganda
- Heading bisa dibuat dengan format markdown

### 3. **Edit Article**
- Klik tombol "Edit" pada artikel yang ingin diubah
- Semua field dapat dimodifikasi
- Perubahan langsung tersimpan setelah klik "Perbarui Artikel"

### 4. **Delete Article**
- Klik tombol "Hapus" pada artikel
- Konfirmasi penghapusan akan muncul
- Artikel akan dihapus permanent dari sistem

### 5. **Article List & Filtering**

#### Search:
- Cari artikel berdasarkan judul atau ringkasan
- Real-time search dengan instant results

#### Filter by Category:
- Semua Kategori
- Tips
- Lingkungan
- Teknologi
- Ekonomi
- Komunitas

#### Statistics Dashboard:
- **Total Artikel** - Jumlah artikel yang sudah dibuat
- **Total Views** - Akumulasi views dari semua artikel
- **Kategori** - Jumlah kategori tersedia
- **Artikel Baru** - Artikel yang baru dipublish

### 6. **Article Preview**
Setiap artikel menampilkan:
- Gambar thumbnail dengan preview
- Kategori badge dengan warna berbeda
- Judul dan ringkasan
- Author info (nama & posisi)
- Metadata: views, waktu baca, tanggal publish
- Tags (maksimal 3 ditampilkan)

## Technical Implementation

### Storage
- Artikel admin disimpan di **localStorage** dengan key: `ecobank_articles`
- Format: Array of NewsItem objects
- Data persisten di browser user

### Integration dengan User App
- Artikel dari admin **otomatis muncul** di section Berita & Tips
- Artikel admin muncul **paling atas** (prioritas tinggi)
- Kombinasi dengan mockNews articles untuk konten default

### Helper Functions (`/utils/articleHelpers.ts`)

```typescript
loadAllArticles()        // Load semua artikel (admin + mock)
getArticleById(id)       // Get artikel by ID
getArticlesByCategory(category)  // Filter by kategori
getFeaturedArticles(limit)       // Top artikel berdasarkan views
incrementArticleViews(id)        // Tambah view count
toggleArticleLike(id, userId)    // Like/unlike artikel
hasUserLikedArticle(id, userId)  // Check user sudah like
```

## Workflow

### Admin Creates Article:
1. Login sebagai admin
2. Navigasi ke tab "Artikel"
3. Klik "Buat Artikel Baru"
4. Isi form dengan data artikel
5. Preview gambar (jika URL disediakan)
6. Klik "Publikasikan Artikel"
7. Artikel langsung muncul di list

### User Views Article:
1. User melihat artikel di section "Berita & Tips"
2. Artikel admin muncul paling atas
3. Klik artikel untuk membaca full content
4. View count otomatis bertambah
5. User bisa like artikel
6. Related articles ditampilkan

## Data Structure

```typescript
interface NewsItem {
  id: string;                    // Unique ID (timestamp untuk admin)
  title: string;                 // Judul artikel
  summary: string;               // Ringkasan singkat
  content: string;               // Konten lengkap (support markdown)
  category: string;              // Kategori
  publishedAt: string;           // Tanggal publish (untuk admin: "Baru saja")
  readTime: string;              // Estimasi waktu baca
  imageUrl: string;              // URL gambar
  author: {
    name: string;                // Nama penulis
    role: string;                // Posisi/role
  };
  tags: string[];                // Array of tags
  views: number;                 // Jumlah views
  likes: number;                 // Jumlah likes
  comments: number;              // Jumlah comments
}
```

## UI/UX Features

### Article Card:
- Glassmorphism design
- Hover effects dengan scale transform
- Category badge dengan gradient colors
- Author avatar dengan initial letters
- Stats overlay on hover (views, likes)

### Empty State:
- Friendly message: "Belum ada artikel"
- Call-to-action button untuk create first article
- Icon illustration

### Tips Section:
Info card dengan tips menulis artikel:
- Gunakan judul menarik & deskriptif
- Ringkasan singkat 1-2 kalimat
- Format **text** untuk bold
- Pisahkan paragraf dengan enter ganda
- Tambahkan tags relevan

## Category Colors

| Kategori | Gradient |
|----------|----------|
| Tips | Blue (from-blue-500 to-blue-600) |
| Lingkungan | Green (from-green-500 to-emerald-600) |
| Teknologi | Purple (from-purple-500 to-purple-600) |
| Ekonomi | Orange (from-orange-500 to-orange-600) |
| Komunitas | Gray (from-gray-500 to-gray-600) |

## Best Practices

### Writing Content:
1. **Judul**: Max 60-70 karakter, informatif, mengandung keyword
2. **Ringkasan**: 1-2 kalimat, jelaskan value proposition
3. **Konten**: Gunakan paragraf pendek (3-4 baris)
4. **Struktur**: Gunakan heading untuk section berbeda
5. **Tags**: 3-5 tags relevan untuk SEO & filtering

### Image Guidelines:
- Ukuran recommended: 1080x720px (aspect ratio 3:2)
- Format: JPG atau PNG
- Gunakan image dari Unsplash untuk kualitas terbaik
- Pastikan image relevan dengan konten

### Publishing Checklist:
- ✅ Judul jelas dan menarik
- ✅ Ringkasan informatif
- ✅ Konten complete dan formatted
- ✅ Kategori sesuai
- ✅ Image URL valid (atau kosongkan untuk default)
- ✅ Tags ditambahkan
- ✅ Author info diisi

## Future Enhancements

Potential features untuk development selanjutnya:
- [ ] Rich text editor (WYSIWYG)
- [ ] Image upload (bukan hanya URL)
- [ ] Draft system (save draft sebelum publish)
- [ ] Scheduling (publish artikel di waktu tertentu)
- [ ] Comments management
- [ ] Analytics per artikel (detailed stats)
- [ ] Featured article toggle
- [ ] Article versioning (revision history)
- [ ] Multi-language support
- [ ] SEO metadata (meta description, keywords)

## Troubleshooting

### Article tidak muncul di user app:
- Cek localStorage browser: Key `ecobank_articles`
- Pastikan user sudah refresh page
- Check console untuk errors

### Image tidak muncul:
- Validate URL image (harus HTTPS)
- Cek CORS policy
- Gunakan Unsplash URLs untuk reliability
- Fallback ke default image jika error

### Tags tidak tampil:
- Pastikan format: `tag1, tag2, tag3` (dengan koma+spasi)
- Avoid special characters
- Max 10 tags recommended

## Notes

- Artikel disimpan di localStorage browser admin
- Data tidak tersinkronisasi antar device
- Untuk production, gunakan backend API + database
- Maximum localStorage size: ~5-10MB (depend on browser)
- Clear browser data akan menghapus artikel admin

---

**Last Updated**: October 19, 2025  
**Version**: 1.0.0  
**Component**: `/components/admin/ArticleManagement.tsx`
