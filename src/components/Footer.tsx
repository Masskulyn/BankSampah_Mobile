import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, label: "Facebook", href: "#" },
    { icon: <Instagram className="w-5 h-5" />, label: "Instagram", href: "#" },
    { icon: <Twitter className="w-5 h-5" />, label: "Twitter", href: "#" },
    { icon: <Youtube className="w-5 h-5" />, label: "YouTube", href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="bg-green-500 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-lg md:text-xl">
                <span className="font-bold">♻️</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold">Bank Sampah Digital</h3>
            </div>
            <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 leading-relaxed">
              Platform bank sampah digital yang memudahkan Anda untuk berkontribusi dalam menjaga lingkungan 
              sambil mendapatkan penghasilan tambahan.
            </p>
            
            {/* Social Media */}
            <div>
              <p className="text-xs md:text-sm text-gray-400 mb-2 md:mb-3">Ikuti Kami:</p>
              <div className="flex gap-2">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className="rounded-xl bg-white/10 border-white/20 hover:bg-white/20 text-white"
                    onClick={() => window.open(social.href, '_blank')}
                  >
                    {social.icon}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Link Cepat</h4>
            <ul className="space-y-1.5 md:space-y-2">
              {["Tentang Kami", "Cara Kerja", "FAQ", "Blog", "Karir"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-xs md:text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Hubungi Kami</h4>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-start gap-2 md:gap-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-gray-300">
                  Jl. Lingkungan Hijau No. 123<br />
                  Jakarta Selatan, 12345
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                <div className="text-xs md:text-sm text-gray-300">
                  +62 812-3456-7890
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                <div className="text-xs md:text-sm text-gray-300">
                  info@banksampah.id
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-xs md:text-sm text-gray-400">
            © 2025 Bank Sampah Digital. All rights reserved.
          </p>
          <div className="flex gap-4 md:gap-6">
            <a href="#" className="text-xs md:text-sm text-gray-400 hover:text-green-400 transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#" className="text-xs md:text-sm text-gray-400 hover:text-green-400 transition-colors">
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
