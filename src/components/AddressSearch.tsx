import { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Search, MapPin, Navigation, Clock, Trash2, Star, ExternalLink, Route } from "lucide-react";

interface AddressSearchProps {
  onAddressSelect?: (address: AddressSuggestion) => void;
}

interface AddressSuggestion {
  id: string;
  name: string;
  fullAddress: string;
  distance: string;
  type: 'bank_sampah' | 'drop_point' | 'recent' | 'saved';
  rating?: number;
  isOpen?: boolean;
  operatingHours?: string;
  googleMapsUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export function AddressSearch({ onAddressSelect }: AddressSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mock data untuk alamat dan lokasi bank sampah termasuk UNIS Tangerang
  const mockSuggestions: AddressSuggestion[] = [
    // UNIS Tangerang Locations
    {
      id: "unis-1",
      name: "UNIS Tangerang - Kampus Utama",
      fullAddress: "Jl. Maulana Hasanudin No. 84, Cipocok Jaya, Serang, Banten 42124",
      distance: "2.3 km",
      type: "bank_sampah",
      rating: 4.9,
      isOpen: true,
      operatingHours: "07:00 - 17:00",
      googleMapsUrl: "https://maps.google.com/?q=Universitas+Islam+Syekh+Yusuf+Tangerang",
      coordinates: { lat: -6.1174, lng: 106.1507 }
    },
    {
      id: "unis-2", 
      name: "UNIS Tangerang - Fakultas Teknik",
      fullAddress: "Jl. Maulana Hasanudin No. 84, Gedung Fakultas Teknik, Serang, Banten",
      distance: "2.4 km",
      type: "bank_sampah", 
      rating: 4.8,
      isOpen: true,
      operatingHours: "08:00 - 16:00",
      googleMapsUrl: "https://maps.google.com/?q=Fakultas+Teknik+UNIS+Tangerang",
      coordinates: { lat: -6.1175, lng: 106.1508 }
    },
    {
      id: "unis-3",
      name: "UNIS Tangerang - Fakultas Ekonomi",
      fullAddress: "Jl. Maulana Hasanudin No. 84, Gedung Fakultas Ekonomi, Serang, Banten",
      distance: "2.5 km",
      type: "bank_sampah",
      rating: 4.7,
      isOpen: true,
      operatingHours: "08:00 - 16:00",
      googleMapsUrl: "https://maps.google.com/?q=Fakultas+Ekonomi+UNIS+Tangerang",
      coordinates: { lat: -6.1176, lng: 106.1509 }
    },
    {
      id: "unis-4",
      name: "UNIS Tangerang - Asrama Mahasiswa",
      fullAddress: "Jl. Maulana Hasanudin No. 84, Komplek Asrama, Serang, Banten",
      distance: "2.6 km",
      type: "drop_point",
      rating: 4.6,
      isOpen: true,
      operatingHours: "24 Jam",
      googleMapsUrl: "https://maps.google.com/?q=Asrama+UNIS+Tangerang",
      coordinates: { lat: -6.1177, lng: 106.1510 }
    },
    {
      id: "unis-5",
      name: "UNIS Tangerang - Perpustakaan Pusat",
      fullAddress: "Jl. Maulana Hasanudin No. 84, Gedung Perpustakaan, Serang, Banten",
      distance: "2.3 km",
      type: "drop_point",
      rating: 4.8,
      isOpen: true,
      operatingHours: "07:30 - 21:00",
      googleMapsUrl: "https://maps.google.com/?q=Perpustakaan+UNIS+Tangerang",
      coordinates: { lat: -6.1174, lng: 106.1506 }
    },
    // Bank Sampah Lainnya
    {
      id: "1",
      name: "Bank Sampah Melati Bersih",
      fullAddress: "Jl. Mawar No. 15, Kelurahan Sumber, Kec. Banjarsari",
      distance: "0.8 km",
      type: "bank_sampah",
      rating: 4.8,
      isOpen: true,
      operatingHours: "08:00 - 16:00"
    },
    {
      id: "2", 
      name: "Drop Point Pasar Induk Tangerang",
      fullAddress: "Pasar Induk Sayur Mayur, Jl. Tentara Pelajar, Tangerang",
      distance: "1.2 km",
      type: "drop_point",
      rating: 4.5,
      isOpen: true,
      operatingHours: "06:00 - 18:00"
    },
    {
      id: "3",
      name: "Bank Sampah Hijau Mandiri Tangerang",
      fullAddress: "Jl. Kenanga Raya No. 28, Kelurahan Manahan, Tangerang",
      distance: "2.1 km", 
      type: "bank_sampah",
      rating: 4.7,
      isOpen: false,
      operatingHours: "09:00 - 15:00"
    }
  ];

  const recentSearches = [
    "UNIS Tangerang - Kampus Utama",
    "Bank Sampah Melati Bersih",
    "Drop Point Pasar Induk Tangerang", 
    "UNIS Tangerang - Fakultas Teknik"
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearching(true);
      // Simulate API call delay
      const timer = setTimeout(() => {
        const filtered = mockSuggestions.filter(suggestion =>
          suggestion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          suggestion.fullAddress.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleInputFocus = () => {
    if (searchQuery.length === 0) {
      // Show UNIS locations when focused without query
      const unisLocations = mockSuggestions.filter(s => s.id.startsWith('unis-'));
      setSuggestions(unisLocations);
      setShowSuggestions(true);
    }
  };

  const handleAddressSelect = (address: AddressSuggestion) => {
    setSearchQuery(address.name);
    setShowSuggestions(false);
    onAddressSelect?.(address);
  };

  const openGoogleMaps = (address: AddressSuggestion) => {
    if (address.googleMapsUrl) {
      window.open(address.googleMapsUrl, '_blank');
    } else {
      // Fallback to search query if no direct URL
      const query = encodeURIComponent(address.fullAddress);
      window.open(`https://maps.google.com/?q=${query}`, '_blank');
    }
  };

  const getDirections = (address: AddressSuggestion) => {
    if (address.coordinates) {
      window.open(`https://maps.google.com/dir/?api=1&destination=${address.coordinates.lat},${address.coordinates.lng}`, '_blank');
    } else {
      const query = encodeURIComponent(address.fullAddress);
      window.open(`https://maps.google.com/dir/?api=1&destination=${query}`, '_blank');
    }
  };

  const getTypeIcon = (type: AddressSuggestion['type']) => {
    switch (type) {
      case 'bank_sampah':
        return <Trash2 size={16} className="text-green-600" />;
      case 'drop_point':
        return <MapPin size={16} className="text-blue-600" />;
      case 'recent':
        return <Clock size={16} className="text-gray-500" />;
      case 'saved':
        return <Star size={16} className="text-yellow-600" />;
    }
  };

  const getTypeLabel = (type: AddressSuggestion['type']) => {
    switch (type) {
      case 'bank_sampah':
        return 'Bank Sampah';
      case 'drop_point':
        return 'Drop Point';
      case 'recent':
        return 'Terkini';
      case 'saved':
        return 'Tersimpan';
    }
  };

  const getTypeBadgeColor = (type: AddressSuggestion['type']) => {
    switch (type) {
      case 'bank_sampah':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'drop_point':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'recent':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'saved':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <Card className="p-5 sm:p-6 bg-white shadow-xl border-0">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
            <MapPin size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-gray-900">Cari Lokasi</h3>
            <p className="text-sm text-gray-500">Temukan bank sampah & drop point terdekat</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              ref={searchInputRef}
              placeholder="Cari alamat, bank sampah, atau drop point..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleInputFocus}
              className="pl-12 pr-12 h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500/20"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-green-50"
            >
              <Navigation size={18} className="text-green-600" />
            </Button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {isSearching ? (
                <div className="p-6 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Mencari lokasi...</p>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="py-2">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border-b border-gray-50 last:border-b-0">
                      <div className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getTypeIcon(suggestion.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-gray-900 truncate">{suggestion.name}</p>
                              <Badge className={`text-xs border ${getTypeBadgeColor(suggestion.type)}`}>
                                {getTypeLabel(suggestion.type)}
                              </Badge>
                              {suggestion.rating && (
                                <div className="flex items-center gap-1">
                                  <Star size={12} className="text-yellow-500 fill-current" />
                                  <span className="text-xs text-gray-600">{suggestion.rating}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate mb-2">{suggestion.fullAddress}</p>
                            <div className="flex items-center gap-4 text-xs mb-3">
                              <span className="text-green-600 font-medium">{suggestion.distance}</span>
                              {suggestion.operatingHours && (
                                <span className={`${suggestion.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                                  {suggestion.isOpen ? 'Buka' : 'Tutup'} • {suggestion.operatingHours}
                                </span>
                              )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddressSelect(suggestion);
                                }}
                                className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white text-xs"
                              >
                                Pilih Lokasi
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  getDirections(suggestion);
                                }}
                                className="h-8 px-3 border-blue-200 text-blue-600 hover:bg-blue-50 text-xs"
                              >
                                <Route size={14} className="mr-1" />
                                Rute
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openGoogleMaps(suggestion);
                                }}
                                className="h-8 px-3 border-gray-200 text-gray-600 hover:bg-gray-50 text-xs"
                              >
                                <ExternalLink size={14} className="mr-1" />
                                Maps
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.length === 0 ? (
                <div className="p-4">
                  <h4 className="text-sm text-gray-700 mb-3">Lokasi UNIS Tangerang</h4>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="flex items-center gap-3 w-full px-2 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-700">{search}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <MapPin size={24} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Lokasi tidak ditemukan</p>
                  <p className="text-xs text-gray-400 mt-1">Coba kata kunci yang berbeda</p>
                </div>
              )}
            </div>
          )}
        </div>



        {/* UNIS Tangerang Quick Access - List View */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 md:p-5 border border-green-100">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <Trash2 size={16} className="text-white" />
            </div>
            <div>
              <h4 className="text-green-800 text-sm md:text-base">UNIS Tangerang</h4>
              <p className="text-xs md:text-sm text-green-600">Bank Sampah Kampus</p>
            </div>
          </div>
          
          {/* List of UNIS locations */}
          <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
            {mockSuggestions
              .filter(s => s.id.startsWith('unis-'))
              .map((location) => (
                <div
                  key={location.id}
                  className="bg-white rounded-xl p-3 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-98"
                  onClick={() => handleAddressSelect(location)}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(location.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-gray-900 text-sm font-medium truncate">
                          {location.name.replace('UNIS Tangerang - ', '')}
                        </h5>
                        {location.rating && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star size={12} className="text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600">{location.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                        {location.fullAddress}
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-green-600 font-medium flex items-center gap-1">
                          <MapPin size={12} />
                          {location.distance}
                        </span>
                        {location.operatingHours && (
                          <span className={`flex items-center gap-1 ${location.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                            <Clock size={12} />
                            {location.isOpen ? 'Buka' : 'Tutup'} • {location.operatingHours}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        getDirections(location);
                      }}
                      className="flex-shrink-0 p-2 hover:bg-green-50 rounded-lg transition-colors"
                      title="Lihat rute"
                    >
                      <Route size={16} className="text-green-600" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Card>
  );
}