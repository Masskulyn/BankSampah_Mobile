import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Globe, Check, X, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isAvailable: boolean;
}

interface Region {
  code: string;
  name: string;
  timezone: string;
  currency: string;
  flag: string;
}

export function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("id");
  const [selectedRegion, setSelectedRegion] = useState("id");
  const [isLoading, setIsLoading] = useState(false);

  const languages: Language[] = [
    {
      code: "id",
      name: "Bahasa Indonesia",
      nativeName: "Bahasa Indonesia",
      flag: "🇮🇩",
      isAvailable: true
    },
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
      isAvailable: true
    },
    {
      code: "ms",
      name: "Bahasa Melayu",
      nativeName: "Bahasa Melayu",
      flag: "🇲🇾",
      isAvailable: false
    },
    {
      code: "th",
      name: "Thai",
      nativeName: "ภาษาไทย",
      flag: "🇹🇭",
      isAvailable: false
    },
    {
      code: "vi",
      name: "Vietnamese",
      nativeName: "Tiếng Việt",
      flag: "🇻🇳",
      isAvailable: false
    },
    {
      code: "zh",
      name: "Chinese",
      nativeName: "中文",
      flag: "🇨🇳",
      isAvailable: false
    }
  ];

  const regions: Region[] = [
    {
      code: "id",
      name: "Indonesia",
      timezone: "WIB (UTC+7)",
      currency: "IDR (Rupiah)",
      flag: "🇮🇩"
    },
    {
      code: "sg",
      name: "Singapore",
      timezone: "SGT (UTC+8)",
      currency: "SGD (Dollar)",
      flag: "🇸🇬"
    },
    {
      code: "my",
      name: "Malaysia", 
      timezone: "MYT (UTC+8)",
      currency: "MYR (Ringgit)",
      flag: "🇲🇾"
    },
    {
      code: "th",
      name: "Thailand",
      timezone: "ICT (UTC+7)",
      currency: "THB (Baht)",
      flag: "🇹🇭"
    }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const languageName = languages.find(lang => lang.code === selectedLanguage)?.name;
      const regionName = regions.find(reg => reg.code === selectedRegion)?.name;
      
      setIsLoading(false);
      onClose();
      toast.success(`Bahasa diubah ke ${languageName}, Region: ${regionName}`);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="text-indigo-600" size={20} />
            Bahasa & Region
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Language Selection */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Globe size={16} className="text-indigo-600" />
              Pilih Bahasa
            </h3>
            <div className="space-y-2">
              {languages.map((language) => (
                <Card 
                  key={language.code}
                  className={`cursor-pointer transition-all ${
                    selectedLanguage === language.code 
                      ? 'ring-2 ring-indigo-500 bg-indigo-50' 
                      : 'hover:bg-gray-50'
                  } ${!language.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => language.isAvailable && setSelectedLanguage(language.code)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{language.flag}</span>
                        <div>
                          <p className="font-medium text-gray-900">{language.name}</p>
                          <p className="text-sm text-gray-500">{language.nativeName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!language.isAvailable && (
                          <Badge variant="secondary" className="text-xs">
                            Segera Hadir
                          </Badge>
                        )}
                        {selectedLanguage === language.code && language.isAvailable && (
                          <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Region Selection */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-purple-600" />
              Pilih Region
            </h3>
            <div className="space-y-2">
              {regions.map((region) => (
                <Card 
                  key={region.code}
                  className={`cursor-pointer transition-all ${
                    selectedRegion === region.code 
                      ? 'ring-2 ring-purple-500 bg-purple-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedRegion(region.code)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{region.flag}</span>
                        <div>
                          <p className="font-medium text-gray-900">{region.name}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock size={10} />
                              <span>{region.timezone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>💰</span>
                              <span>{region.currency}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {selectedRegion === region.code && (
                        <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Current Settings Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-900 mb-3">Pengaturan Saat Ini</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Bahasa:</span>
                  <span className="font-medium text-blue-900">
                    {languages.find(lang => lang.code === selectedLanguage)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Region:</span>
                  <span className="font-medium text-blue-900">
                    {regions.find(reg => reg.code === selectedRegion)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Zona Waktu:</span>
                  <span className="font-medium text-blue-900">
                    {regions.find(reg => reg.code === selectedRegion)?.timezone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Mata Uang:</span>
                  <span className="font-medium text-blue-900">
                    {regions.find(reg => reg.code === selectedRegion)?.currency}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              💡 Perubahan bahasa akan mempengaruhi seluruh aplikasi. Beberapa konten mungkin membutuhkan restart aplikasi.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 gap-2"
              disabled={isLoading}
            >
              <X size={16} />
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              <Check size={16} />
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}