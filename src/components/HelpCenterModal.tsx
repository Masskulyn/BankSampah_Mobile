import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { HelpCircle, Search, ChevronDown, ChevronRight, MessageCircle, X, Book, CreditCard, Recycle, Settings, Shield } from "lucide-react";
import { useState } from "react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPopular?: boolean;
}

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpCenterModal({ isOpen, onClose }: HelpCenterModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "Bagaimana cara setor sampah?",
      answer: "1. Klik tombol 'Ingatkan Saya' di beranda\n2. Pilih jadwal pengingat setor sampah\n3. Siapkan sampah yang sudah dipilah\n4. Datang ke lokasi bank sampah sesuai jadwal\n5. Timbang sampah dan catat berat di aplikasi\n6. Saldo otomatis bertambah sesuai jenis dan berat sampah",
      category: "deposit",
      isPopular: true
    },
    {
      id: "2", 
      question: "Berapa lama proses pencairan saldo?",
      answer: "Proses pencairan saldo membutuhkan waktu:\n• Hari kerja: 1-2 hari kerja\n• Weekend/libur: 2-3 hari kerja\n• Transfer dilakukan ke rekening yang terdaftar\n• Anda akan mendapat notifikasi saat transfer berhasil",
      category: "cashout",
      isPopular: true
    },
    {
      id: "3",
      question: "Apa saja jenis sampah yang diterima?",
      answer: "Jenis sampah yang diterima:\n• Plastik: botol, kemasan, kantong plastik\n• Kertas: koran, majalah, kardus, kertas HVS\n• Logam: kaleng, aluminium, tembaga\n• Kaca: botol, pecahan kaca\n• Organik: sisa makanan (kompos)\n\nSampah harus dalam kondisi bersih dan sudah dipilah",
      category: "general",
      isPopular: true
    },
    {
      id: "4",
      question: "Bagaimana cara mengubah PIN?",
      answer: "1. Masuk ke halaman Profil\n2. Pilih 'Keamanan & Privasi'\n3. Klik tab 'PIN'\n4. Masukkan PIN lama\n5. Masukkan PIN baru (6 digit)\n6. Konfirmasi PIN baru\n7. Klik 'Ubah PIN'",
      category: "security"
    },
    {
      id: "5",
      question: "Minimal saldo untuk bisa dicairkan?",
      answer: "Minimal saldo untuk pencairan adalah Rp 10.000\n\nBiaya admin:\n• Rp 10.000 - 50.000: Gratis\n• Rp 50.000 - 100.000: Rp 1.000\n• > Rp 100.000: Rp 2.500",
      category: "cashout"
    },
    {
      id: "6",
      question: "Bagaimana cara menambah rekening bank?",
      answer: "1. Masuk ke halaman Profil\n2. Pilih 'Rekening Bank'\n3. Klik 'Tambah Rekening Baru'\n4. Pilih nama bank\n5. Masukkan nomor rekening\n6. Masukkan nama sesuai rekening\n7. Klik 'Simpan'\n\nRekening akan diverifikasi dalam 1x24 jam",
      category: "account"
    },
    {
      id: "7",
      question: "Kenapa saldo saya berkurang?",
      answer: "Saldo dapat berkurang karena:\n• Pencairan/withdrawal yang berhasil\n• Koreksi timbangan oleh petugas\n• Biaya admin (jika ada)\n• Penalty sampah kotor/tidak sesuai standar\n\nCek riwayat transaksi untuk detail lengkap",
      category: "general"
    },
    {
      id: "8",
      question: "Bagaimana cara mengaktifkan notifikasi?",
      answer: "1. Masuk ke halaman Profil\n2. Scroll ke 'Notifikasi'\n3. Aktifkan toggle untuk:\n   • Setor Sampah (pengingat)\n   • Penarikan Saldo (konfirmasi)\n   • Berita & Tips (artikel)\n   • Promo & Reward (penawaran)\n\nPastikan notifikasi diaktifkan di pengaturan HP",
      category: "settings"
    }
  ];

  const categories = [
    { id: "all", name: "Semua", icon: Book, color: "text-gray-600" },
    { id: "deposit", name: "Setor Sampah", icon: Recycle, color: "text-green-600" },
    { id: "cashout", name: "Pencairan", icon: CreditCard, color: "text-blue-600" },
    { id: "account", name: "Akun", icon: Settings, color: "text-purple-600" },
    { id: "security", name: "Keamanan", icon: Shield, color: "text-red-600" },
    { id: "general", name: "Umum", icon: HelpCircle, color: "text-orange-600" }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleOpen = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="text-cyan-600" size={20} />
            Pusat Bantuan
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Cari pertanyaan atau topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex-shrink-0 gap-2"
              >
                <Icon size={14} className={selectedCategory === category.id ? "text-white" : category.color} />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* FAQ List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tidak ada hasil yang ditemukan</p>
              <p className="text-sm text-gray-400">Coba kata kunci lain atau hubungi customer service</p>
            </div>
          ) : (
            filteredFAQs.map((faq) => {
              const categoryInfo = getCategoryInfo(faq.category);
              const Icon = categoryInfo.icon;
              const isOpen = openItems.includes(faq.id);
              
              return (
                <Card key={faq.id} className="overflow-hidden">
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <button
                        onClick={() => toggleOpen(faq.id)}
                        className="w-full"
                      >
                        <CardContent className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2 mb-2">
                                <Icon size={14} className={categoryInfo.color} />
                                <Badge variant="outline" className="text-xs">
                                  {categoryInfo.name}
                                </Badge>
                                {faq.isPopular && (
                                  <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium text-gray-900">{faq.question}</p>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              {isOpen ? (
                                <ChevronDown size={16} className="text-gray-400" />
                              ) : (
                                <ChevronRight size={16} className="text-gray-400" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="pt-4">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                            {faq.answer}
                          </pre>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })
          )}
        </div>

        {/* Contact Support */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <MessageCircle size={16} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Masih butuh bantuan?</p>
                <p className="text-sm text-blue-700">Chat dengan customer service</p>
              </div>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Chat Sekarang
            </Button>
          </div>
        </div>

        {/* Close Button */}
        <Button
          variant="outline"
          onClick={onClose}
          className="gap-2"
        >
          <X size={16} />
          Tutup
        </Button>
      </DialogContent>
    </Dialog>
  );
}