import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileText, Shield, Eye, Scale, X } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="text-gray-600" size={20} />
            Syarat & Ketentuan
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="terms" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="terms" className="gap-2">
              <Scale size={14} />
              Syarat & Ketentuan
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield size={14} />
              Kebijakan Privasi
            </TabsTrigger>
            <TabsTrigger value="disclaimer" className="gap-2">
              <Eye size={14} />
              Disclaimer
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="terms" className="h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Syarat dan Ketentuan Penggunaan EcoBank</CardTitle>
                  <p className="text-sm text-gray-500">Terakhir diperbarui: 1 Januari 2024</p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ScrollArea className="h-96">
                    <div className="space-y-6 text-sm">
                      <section>
                        <h3 className="font-semibold mb-3">1. Penerimaan Syarat dan Ketentuan</h3>
                        <p className="text-gray-700 mb-3">
                          Dengan menggunakan aplikasi EcoBank, Anda menyetujui untuk terikat dengan syarat dan ketentuan yang tercantum dalam dokumen ini. Jika Anda tidak menyetujui syarat dan ketentuan ini, mohon untuk tidak menggunakan aplikasi kami.
                        </p>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">2. Definisi</h3>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                          <li><strong>EcoBank:</strong> Aplikasi mobile bank sampah digital</li>
                          <li><strong>Pengguna:</strong> Individu yang telah mendaftar dan menggunakan aplikasi</li>
                          <li><strong>Bank Sampah:</strong> Lokasi fisik untuk penyetoran sampah</li>
                          <li><strong>Saldo:</strong> Nilai uang yang tersimpan dalam akun pengguna</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">3. Pendaftaran dan Akun</h3>
                        <div className="space-y-3 text-gray-700">
                          <p>3.1. Pengguna harus berusia minimal 17 tahun atau memiliki persetujuan orang tua/wali.</p>
                          <p>3.2. Informasi yang diberikan saat pendaftaran harus akurat dan lengkap.</p>
                          <p>3.3. Pengguna bertanggung jawab menjaga kerahasiaan akun dan password.</p>
                          <p>3.4. Satu nomor telepon hanya dapat digunakan untuk satu akun.</p>
                        </div>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">4. Layanan Bank Sampah</h3>
                        <div className="space-y-3 text-gray-700">
                          <p>4.1. <strong>Penyetoran Sampah:</strong></p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Sampah harus dalam kondisi bersih dan sudah dipilah</li>
                            <li>Jenis sampah yang diterima sesuai dengan ketentuan bank sampah</li>
                            <li>Penimbangan dilakukan oleh petugas resmi</li>
                            <li>Nilai saldo dihitung berdasarkan berat dan jenis sampah</li>
                          </ul>
                        </div>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">5. Pencairan Saldo</h3>
                        <div className="space-y-3 text-gray-700">
                          <p>5.1. Minimal pencairan adalah Rp 10.000</p>
                          <p>5.2. Biaya admin sesuai dengan tabel yang berlaku</p>
                          <p>5.3. Transfer dilakukan ke rekening yang telah terverifikasi</p>
                          <p>5.4. Waktu proses 1-3 hari kerja</p>
                          <p>5.5. EcoBank berhak menolak pencairan yang mencurigakan</p>
                        </div>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">6. Kewajiban Pengguna</h3>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                          <li>Memberikan informasi yang akurat</li>
                          <li>Mematuhi jadwal dan aturan bank sampah</li>
                          <li>Tidak menyalahgunakan aplikasi untuk tujuan ilegal</li>
                          <li>Melaporkan masalah atau kerusakan pada aplikasi</li>
                          <li>Menjaga kebersihan lingkungan</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">7. Larangan</h3>
                        <p className="text-gray-700 mb-3">Pengguna dilarang untuk:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                          <li>Membuat akun palsu atau menggunakan identitas orang lain</li>
                          <li>Menyetor sampah yang kotor atau berbahaya</li>
                          <li>Melakukan manipulasi data atau sistem</li>
                          <li>Mengganggu operasional bank sampah</li>
                          <li>Berbagi akun dengan orang lain</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">8. Pembatasan Tanggung Jawab</h3>
                        <div className="space-y-3 text-gray-700">
                          <p>8.1. EcoBank tidak bertanggung jawab atas kerugian yang timbul dari penggunaan aplikasi yang tidak sesuai ketentuan.</p>
                          <p>8.2. Gangguan teknis atau pemeliharaan sistem dapat menyebabkan layanan tidak tersedia sementara.</p>
                          <p>8.3. EcoBank tidak menjamin keuntungan atau hasil tertentu dari penggunaan aplikasi.</p>
                        </div>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">9. Perubahan Syarat dan Ketentuan</h3>
                        <p className="text-gray-700">
                          EcoBank berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui aplikasi atau email. Penggunaan berkelanjutan aplikasi setelah perubahan dianggap sebagai persetujuan atas perubahan tersebut.
                        </p>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">10. Hukum yang Berlaku</h3>
                        <p className="text-gray-700">
                          Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia. Setiap sengketa akan diselesaikan melalui musyawarah atau melalui pengadilan yang berwenang di Jakarta.
                        </p>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">11. Kontak</h3>
                        <div className="text-gray-700">
                          <p>Untuk pertanyaan mengenai syarat dan ketentuan ini, hubungi:</p>
                          <ul className="list-none mt-2 space-y-1">
                            <li>Email: legal@ecobank.id</li>
                            <li>Telepon: (021) 1500-123</li>
                            <li>Alamat: Jakarta Selatan, DKI Jakarta</li>
                          </ul>
                        </div>
                      </section>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Kebijakan Privasi</CardTitle>
                  <p className="text-sm text-gray-500">Terakhir diperbarui: 1 Januari 2024</p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-6 text-sm">
                      <section>
                        <h3 className="font-semibold mb-3">1. Informasi yang Kami Kumpulkan</h3>
                        <div className="space-y-3 text-gray-700">
                          <p><strong>Data Pribadi:</strong></p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Nama, email, nomor telepon</li>
                            <li>Alamat domisili</li>
                            <li>Informasi rekening bank</li>
                            <li>Data biometrik (opsional)</li>
                          </ul>
                        </div>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">2. Penggunaan Informasi</h3>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                          <li>Menyediakan layanan bank sampah digital</li>
                          <li>Memproses transaksi dan pencairan saldo</li>
                          <li>Mengirim notifikasi dan update aplikasi</li>
                          <li>Meningkatkan kualitas layanan</li>
                          <li>Mematuhi kewajiban hukum</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">3. Berbagi Informasi</h3>
                        <p className="text-gray-700 mb-3">
                          Kami tidak akan menjual atau menyewakan data pribadi Anda. Informasi hanya dibagikan dalam situasi berikut:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                          <li>Dengan persetujuan eksplisit dari Anda</li>
                          <li>Untuk memenuhi kewajiban hukum</li>
                          <li>Dengan penyedia layanan terpercaya (bank, payment gateway)</li>
                          <li>Dalam keadaan darurat untuk melindungi keselamatan</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">4. Keamanan Data</h3>
                        <div className="space-y-3 text-gray-700">
                          <p>Kami menerapkan langkah-langkah keamanan yang ketat:</p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Enkripsi data end-to-end</li>
                            <li>Akses terbatas pada sistem internal</li>
                            <li>Monitoring keamanan 24/7</li>
                            <li>Backup data secara berkala</li>
                            <li>Sertifikasi keamanan ISO 27001</li>
                          </ul>
                        </div>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">5. Hak Pengguna</h3>
                        <p className="text-gray-700 mb-3">Anda memiliki hak untuk:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                          <li>Mengakses data pribadi yang kami simpan</li>
                          <li>Memperbaiki data yang tidak akurat</li>
                          <li>Menghapus akun dan data pribadi</li>
                          <li>Membatasi pemrosesan data</li>
                          <li>Mengunduh data dalam format yang dapat dibaca</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">6. Cookies dan Teknologi Pelacakan</h3>
                        <p className="text-gray-700">
                          Aplikasi menggunakan cookies untuk meningkatkan pengalaman pengguna, menganalisis penggunaan aplikasi, dan menyediakan konten yang relevan. Anda dapat mengatur preferensi cookies melalui pengaturan aplikasi.
                        </p>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">7. Retensi Data</h3>
                        <p className="text-gray-700">
                          Data pribadi akan disimpan selama akun aktif dan periode yang diperlukan untuk memenuhi kewajiban hukum. Data transaksi disimpan selama 10 tahun sesuai regulasi perbankan.
                        </p>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">8. Perubahan Kebijakan</h3>
                        <p className="text-gray-700">
                          Kebijakan privasi dapat berubah sewaktu-waktu. Perubahan material akan diberitahukan melalui email atau notifikasi aplikasi minimal 30 hari sebelum berlaku.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="disclaimer" className="h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Disclaimer</CardTitle>
                  <p className="text-sm text-gray-500">Penting untuk dibaca dan dipahami</p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-6 text-sm">
                      <section>
                        <h3 className="font-semibold mb-3">1. Sifat Layanan</h3>
                        <p className="text-gray-700">
                          EcoBank adalah platform digital yang memfasilitasi kegiatan bank sampah. Kami tidak menjamin hasil atau keuntungan tertentu dari penggunaan aplikasi ini. Nilai saldo bergantung pada jenis, kualitas, dan kuantitas sampah yang disetor.
                        </p>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">2. Ketersediaan Layanan</h3>
                        <p className="text-gray-700">
                          Meskipun kami berusaha menjaga aplikasi tetap tersedia 24/7, kami tidak dapat menjamin layanan akan selalu tersedia tanpa gangguan. Pemeliharaan sistem, gangguan teknis, atau faktor eksternal dapat menyebabkan layanan tidak tersedia sementara.
                        </p>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">3. Akurasi Informasi</h3>
                        <p className="text-gray-700">
                          Informasi dalam aplikasi disediakan berdasarkan data yang tersedia saat ini. Harga sampah, lokasi bank sampah, dan informasi lainnya dapat berubah tanpa pemberitahuan sebelumnya. Pengguna disarankan untuk memverifikasi informasi penting.
                        </p>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">4. Transaksi Keuangan</h3>
                        <div className="space-y-3 text-gray-700">
                          <p>Terkait transaksi keuangan dalam aplikasi:</p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Semua transaksi bersifat final setelah dikonfirmasi</li>
                            <li>Waktu pemrosesan dapat bervariasi tergantung bank</li>
                            <li>Biaya dapat dikenakan oleh pihak ketiga (bank)</li>
                            <li>Fluktuasi nilai tukar dapat mempengaruhi nilai transaksi</li>
                          </ul>
                        </div>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">5. Konten Pihak Ketiga</h3>
                        <p className="text-gray-700">
                          Aplikasi dapat berisi tautan atau referensi ke situs web atau layanan pihak ketiga. Kami tidak bertanggung jawab atas konten, kebijakan privasi, atau praktik situs tersebut. Penggunaan layanan pihak ketiga sepenuhnya menjadi risiko pengguna.
                        </p>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">6. Dampak Lingkungan</h3>
                        <p className="text-gray-700">
                          Meskipun kami berkomitmen pada pelestarian lingkungan, kalkulasi dampak lingkungan (CO₂ tersimpan, pohon setara) bersifat estimasi berdasarkan standar industri. Hasil aktual dapat bervariasi tergantung berbagai faktor.
                        </p>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">7. Keterbatasan Tanggung Jawab</h3>
                        <p className="text-gray-700">
                          Dalam batas maksimal yang diizinkan hukum, EcoBank tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan aplikasi.
                        </p>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">8. Perubahan Layanan</h3>
                        <p className="text-gray-700">
                          EcoBank berhak mengubah, menangguhkan, atau menghentikan sebagian atau seluruh layanan kapan saja tanpa pemberitahuan sebelumnya. Kami akan berusaha memberikan pemberitahuan yang wajar untuk perubahan material.
                        </p>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">9. Nasihat Profesional</h3>
                        <p className="text-gray-700">
                          Informasi dalam aplikasi tidak dimaksudkan sebagai nasihat keuangan, hukum, atau profesional lainnya. Pengguna disarankan untuk berkonsultasi dengan ahli yang relevan untuk keputusan penting.
                        </p>
                      </section>

                      <section>
                        <h3 className="font-semibold mb-3">10. Kontak untuk Keluhan</h3>
                        <div className="text-gray-700">
                          <p>Untuk keluhan atau pertanyaan terkait disclaimer ini:</p>
                          <ul className="list-none mt-2 space-y-1">
                            <li>Email: legal@ecobank.id</li>
                            <li>Telepon: (021) 1500-123</li>
                          </ul>
                        </div>
                      </section>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

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