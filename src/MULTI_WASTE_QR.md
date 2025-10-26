# 🗑️ Multi Waste QR Code Generator - Admin Feature

## Overview

Admin sekarang dapat membuat QR Code untuk setoran sampah dengan **multiple jenis sampah** dalam satu transaksi. Fitur ini memungkinkan pengguna menyetor berbagai jenis sampah sekaligus dengan perhitungan otomatis.

**✨ Fully optimized untuk Android dengan resolusi kecil** - Semua elemen telah disesuaikan untuk layar mobile dengan spacing minimal, font size adaptif, dan touch targets optimal.

## Key Features

### 1. **Multiple Waste Items**
- Admin dapat menambahkan beberapa jenis sampah dalam satu QR code
- Setiap item memiliki: jenis, berat, dan harga per kg
- Minimum 1 item, unlimited maximum items

### 2. **Add/Remove Items**
- ✅ Tombol "Tambah Jenis Sampah" dengan icon Plus
- ✅ Tombol delete untuk setiap item (kecuali item terakhir)
- ✅ UI card dengan numbering untuk setiap item
- ✅ Validation: minimal 1 item harus ada

### 3. **Auto Calculation**
- 🔢 Subtotal per item dihitung otomatis
- 🔢 Total berat semua sampah terakumulasi
- 🔢 Total nilai transaksi dihitung real-time
- 🔢 Update instant saat berat atau jenis berubah

### 4. **Enhanced UI/UX**

#### Form Layout:
```
┌─────────────────────────────────┐
│ Sampah #1               [🗑️]    │
│ ├─ Jenis: [Dropdown]            │
│ ├─ Berat: [Input]               │
│ └─ Subtotal: Rp X.XXX          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Sampah #2               [🗑️]    │
│ ├─ Jenis: [Dropdown]            │
│ ├─ Berat: [Input]               │
│ └─ Subtotal: Rp X.XXX          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ [+] Tambah Jenis Sampah          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Total Berat: XX.X kg             │
│ Total Nilai: Rp XX.XXX          │
└─────────────────────────────────┘
```

#### Color Scheme:
- Item cards: `bg-gray-50` with `border-2 border-gray-200`
- Add button: Dashed border with `border-emerald-300`
- Total summary: Gradient `from-emerald-500 to-green-600`
- Subtotals: `bg-emerald-50 border-emerald-200`

### 5. **QR Code Display**

#### Detail Information:
- Transaction ID dengan copy button
- List semua waste items dengan detail:
  - Jenis sampah
  - Berat (kg)
  - Harga per kg
  - Subtotal per item
- Total berat akumulasi
- **Total nilai transaksi** (bold, green)

#### Preview Example:
```
ID Transaksi: TRX-XXXXX [📋]

Detail Sampah:
┌──────────────────────────────┐
│ Plastik         2.5 kg       │
│ @ Rp 2.000/kg   Rp 5.000     │
├──────────────────────────────┤
│ Kertas          2.0 kg       │
│ @ Rp 1.500/kg   Rp 3.000     │
├──────────────────────────────┤
│ Kaleng          0.2 kg       │
│ @ Rp 2.500/kg   Rp 500       │
└──────────────────────────────┘

Total Berat: 4.7 kg
Total Nilai: Rp 8.500
```

## Technical Implementation

### Data Structure

#### QRData Interface (New Format):
```typescript
interface QRData {
  type: 'deposit';
  totalAmount: number;          // Total dari semua items
  wasteItems: Array<{
    wasteType: string;          // plastik, kertas, dll
    wasteWeight: number;        // dalam kg
    pricePerKg: number;         // harga per kg
    amount: number;             // subtotal item
  }>;
  adminId: string;
  timestamp: string;
  transactionId: string;
}
```

#### WasteItem Interface (Internal):
```typescript
interface WasteItem {
  id: string;                   // Unique ID untuk React key
  wasteType: string;
  wasteWeight: number;
  pricePerKg: number;
  amount: number;               // Auto-calculated
}
```

### State Management

```typescript
const [wasteItems, setWasteItems] = useState<WasteItem[]>([
  {
    id: '1',
    wasteType: 'plastik',
    wasteWeight: 0,
    pricePerKg: 2000,
    amount: 0
  }
]);
```

### Key Functions

#### 1. Add Waste Item
```typescript
const addWasteItem = () => {
  const newItem: WasteItem = {
    id: Date.now().toString(),
    wasteType: 'plastik',
    wasteWeight: 0,
    pricePerKg: 2000,
    amount: 0
  };
  setWasteItems([...wasteItems, newItem]);
};
```

#### 2. Remove Waste Item
```typescript
const removeWasteItem = (id: string) => {
  if (wasteItems.length === 1) {
    toast.error("Minimal harus ada 1 jenis sampah");
    return;
  }
  setWasteItems(wasteItems.filter(item => item.id !== id));
};
```

#### 3. Update Waste Item
```typescript
const updateWasteItem = (id: string, field: keyof WasteItem, value: any) => {
  setWasteItems(wasteItems.map(item => {
    if (item.id === id) {
      const updatedItem = { ...item, [field]: value };
      
      // Auto-update price when type changes
      if (field === 'wasteType') {
        const type = wasteTypes.find(w => w.value === value);
        if (type) {
          updatedItem.pricePerKg = type.price;
          updatedItem.amount = updatedItem.wasteWeight * type.price;
        }
      }
      
      // Recalculate amount when weight changes
      if (field === 'wasteWeight') {
        updatedItem.amount = parseFloat(value || 0) * updatedItem.pricePerKg;
      }
      
      return updatedItem;
    }
    return item;
  }));
};
```

#### 4. Calculate Totals
```typescript
const getTotalAmount = () => {
  return wasteItems.reduce((sum, item) => sum + item.amount, 0);
};

const getTotalWeight = () => {
  return wasteItems.reduce((sum, item) => sum + item.wasteWeight, 0);
};
```

### Backward Compatibility

QR Scanner mendukung **both formats**:

```typescript
const handleQRScanSuccess = (data: any) => {
  const isMultiWaste = data.wasteItems && Array.isArray(data.wasteItems);
  
  if (isMultiWaste) {
    // New format: Multi waste
    totalAmount = data.totalAmount;
    totalWeight = data.wasteItems.reduce(...);
    description = data.wasteItems.map(...).join(', ');
  } else {
    // Old format: Single waste (backward compatible)
    totalAmount = data.amount;
    totalWeight = data.wasteWeight;
    description = `${data.wasteType} - ${data.wasteWeight} kg`;
  }
};
```

## User Experience Flow

### Admin Side:
1. ✅ Admin login ke dashboard
2. ✅ Navigate ke tab "QR Code"
3. ✅ Default: 1 item sampah (Plastik, 0 kg)
4. ✅ Input berat untuk item pertama
5. ✅ Klik "Tambah Jenis Sampah" untuk item kedua/ketiga
6. ✅ Pilih jenis dan input berat untuk setiap item
7. ✅ Lihat subtotal dan total terupdate real-time
8. ✅ Klik "Buat QR Code"
9. ✅ QR Code generated dengan detail semua items
10. ✅ Download/share QR Code ke user

### User Side:
1. ✅ User buka app dan klik "Scan QR"
2. ✅ Scan QR code dari admin
3. ✅ Melihat detail multi waste items di preview
4. ✅ Total amount & weight ditampilkan
5. ✅ Balance otomatis bertambah
6. ✅ Transaction tersimpan dengan detail items

## Validation Rules

### Form Validation:
- ✅ Minimal 1 waste item harus ada
- ✅ Semua items harus memiliki berat > 0
- ✅ Berat minimum: 0.1 kg per item
- ✅ Berat dalam format decimal (step 0.1)
- ✅ Generate button disabled jika ada item invalid

### Error Messages:
- "Minimal harus ada 1 jenis sampah" - saat coba delete last item
- "Pastikan semua berat sampah sudah diisi dengan nilai yang valid!" - saat ada item kosong/0

## Waste Types & Pricing

| Jenis Sampah | Harga/kg | Color Code |
|--------------|----------|------------|
| Plastik | Rp 2.000 | Blue |
| Kertas | Rp 1.500 | Orange |
| Botol Kaca | Rp 3.000 | Cyan |
| Kaleng | Rp 2.500 | Purple |
| Elektronik | Rp 5.000 | Red |
| Kain/Tekstil | Rp 1.000 | Pink |

## Example Scenarios

### Scenario 1: Single Waste Type
```json
{
  "totalAmount": 5000,
  "wasteItems": [
    {
      "wasteType": "plastik",
      "wasteWeight": 2.5,
      "pricePerKg": 2000,
      "amount": 5000
    }
  ]
}
```

### Scenario 2: Multiple Waste Types
```json
{
  "totalAmount": 13500,
  "wasteItems": [
    {
      "wasteType": "plastik",
      "wasteWeight": 3.0,
      "pricePerKg": 2000,
      "amount": 6000
    },
    {
      "wasteType": "kertas",
      "wasteWeight": 2.0,
      "pricePerKg": 1500,
      "amount": 3000
    },
    {
      "wasteType": "botol",
      "wasteWeight": 1.5,
      "pricePerKg": 3000,
      "amount": 4500
    }
  ]
}
```

### Scenario 3: Mixed Materials
```json
{
  "totalAmount": 11000,
  "wasteItems": [
    {
      "wasteType": "elektronik",
      "wasteWeight": 1.0,
      "pricePerKg": 5000,
      "amount": 5000
    },
    {
      "wasteType": "kaleng",
      "wasteWeight": 2.0,
      "pricePerKg": 2500,
      "amount": 5000
    },
    {
      "wasteType": "kain",
      "wasteWeight": 1.0,
      "pricePerKg": 1000,
      "amount": 1000
    }
  ]
}
```

## Toast Notifications

### Success Messages:
- ✅ "Item sampah baru ditambahkan" - add item
- ✅ "Item sampah dihapus" - remove item
- ✅ "QR Code berhasil dibuat! 🎉" - generate QR
- ✅ "QR Code berhasil diunduh!" - download QR
- ✅ "ID Transaksi disalin!" - copy transaction ID
- ✅ "Setoran berhasil! +Rp X.XXX (XX.X kg)" - scan success

### Error Messages:
- ❌ "Minimal harus ada 1 jenis sampah" - delete last item
- ❌ "Pastikan semua berat sampah sudah diisi dengan nilai yang valid!" - empty weights

## UI Components Used

- **Card** - Container untuk form & preview
- **Button** - Actions (add, remove, generate)
- **Input** - Weight input (type="number")
- **Select** - Waste type dropdown
- **Label** - Form labels
- **Icons** - Package, Plus, Trash2, QrCode, Download, etc.

## Styling Guidelines

### Cards:
```css
/* Item Card */
bg-gray-50 border-2 border-gray-200 rounded-lg p-4

/* Add Button */
border-dashed border-2 border-emerald-300 hover:bg-emerald-50

/* Total Summary */
bg-gradient-to-br from-emerald-500 to-green-600 text-white

/* Subtotal Display */
bg-emerald-50 border border-emerald-200 text-emerald-700
```

### Responsive Design:
- Mobile: Full width cards, stacked layout
- Desktop: Grid layout with form left, preview right
- Scrollable container for many items (max-h with overflow-y-auto)

## Performance Considerations

- ✅ Real-time calculation (no debounce needed for < 10 items)
- ✅ Efficient state updates using map/filter
- ✅ Unique keys using timestamp IDs
- ✅ Disabled generate button saat processing
- ✅ Auto-scroll untuk many items

## Future Enhancements

Potential features untuk development selanjutnya:
- [ ] Bulk import from CSV
- [ ] Save templates for common combinations
- [ ] Barcode scanning untuk waste identification
- [ ] Photo upload untuk waste verification
- [ ] Custom pricing per location
- [ ] Weight estimation using AI/camera
- [ ] Multi-language waste names
- [ ] Category grouping (organik vs anorganik)
- [ ] Seasonal pricing adjustments
- [ ] Bonus multiplier untuk certain combinations

## Testing Checklist

- [x] Add single waste item
- [x] Add multiple waste items (2-5 items)
- [x] Remove waste item (not last)
- [x] Try remove last item (should show error)
- [x] Change waste type (price updates)
- [x] Change weight (amount recalculates)
- [x] Generate QR with 1 item
- [x] Generate QR with multiple items
- [x] Download QR code
- [x] Copy transaction ID
- [x] Scan QR code (user side)
- [x] Verify balance update
- [x] Check transaction history
- [x] Reset form
- [x] Backward compatibility (old QR format)

---

**Last Updated**: October 19, 2025  
**Version**: 2.0.0  
**Component**: `/components/admin/QRCodeGenerator.tsx`  
**Dependencies**: qrcode, lucide-react, sonner