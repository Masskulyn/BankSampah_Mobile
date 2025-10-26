import { BookOpen, Video, Info, ExternalLink, Leaf, Lightbulb, Recycle, TreePine, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface EducationViewProps {
  onBack?: () => void;
}

export function EducationView({ onBack }: EducationViewProps = {}) {
  const articles = [
    {
      id: 1,
      title: "Cara Memilah Sampah dengan Benar",
      description: "Pelajari teknik pemilahan sampah organik, anorganik, dan B3 untuk daur ulang optimal.",
      category: "Panduan",
      readTime: "5 menit",
      icon: <Recycle className="w-5 h-5" />,
      color: "text-green-600 bg-green-100"
    },
    {
      id: 2,
      title: "Manfaat Daur Ulang untuk Lingkungan",
      description: "Ketahui dampak positif daur ulang terhadap pengurangan emisi karbon dan pelestarian alam.",
      category: "Edukasi",
      readTime: "7 menit",
      icon: <TreePine className="w-5 h-5" />,
      color: "text-blue-600 bg-blue-100"
    },
    {
      id: 3,
      title: "Tips Mengurangi Sampah Plastik",
      description: "Panduan praktis mengurangi penggunaan plastik sekali pakai dalam kehidupan sehari-hari.",
      category: "Tips",
      readTime: "4 menit",
      icon: <Lightbulb className="w-5 h-5" />,
      color: "text-yellow-600 bg-yellow-100"
    },
    {
      id: 4,
      title: "Zero Waste Lifestyle",
      description: "Memulai gaya hidup tanpa sampah dengan langkah-langkah sederhana namun efektif.",
      category: "Gaya Hidup",
      readTime: "6 menit",
      icon: <Leaf className="w-5 h-5" />,
      color: "text-emerald-600 bg-emerald-100"
    }
  ];

  const videos = [
    {
      id: 1,
      title: "Tutorial Memilah Sampah",
      thumbnail: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
      duration: "3:45",
      views: "12.5K"
    },
    {
      id: 2,
      title: "Proses Daur Ulang Plastik",
      thumbnail: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400",
      duration: "5:20",
      views: "8.2K"
    },
    {
      id: 3,
      title: "Kompos dari Sampah Organik",
      thumbnail: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
      duration: "4:15",
      views: "15.3K"
    }
  ];

  const infographics = [
    {
      id: 1,
      title: "Waktu Dekomposisi Sampah",
      description: "Berapa lama sampah membutuhkan waktu untuk terurai secara alami?",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400"
    },
    {
      id: 2,
      title: "Jenis-jenis Sampah",
      description: "Mengenal kategori sampah dan cara pengelolaannya",
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400"
    }
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Back Button */}
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </Button>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-2xl">
        <div className="flex items-center gap-2 md:gap-3 mb-4">
          <BookOpen className="w-8 h-8 md:w-10 md:h-10" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Pusat Edukasi</h1>
            <p className="text-sm md:text-base text-blue-100">Belajar tentang lingkungan & daur ulang</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4">
            <div className="text-blue-100 text-xs md:text-sm">Total Artikel</div>
            <div className="text-lg md:text-2xl font-bold">50+</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4">
            <div className="text-blue-100 text-xs md:text-sm">Video Tutorial</div>
            <div className="text-lg md:text-2xl font-bold">25+</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4">
            <div className="text-blue-100 text-xs md:text-sm">Infografis</div>
            <div className="text-lg md:text-2xl font-bold">15+</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white rounded-2xl p-2 shadow-lg">
          <TabsTrigger value="articles" className="rounded-xl">Artikel</TabsTrigger>
          <TabsTrigger value="videos" className="rounded-xl">Video</TabsTrigger>
          <TabsTrigger value="infographics" className="rounded-xl">Infografis</TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4 mt-6">
          {articles.map((article) => (
            <Card key={article.id} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="flex gap-4">
                <div className={`${article.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {article.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant="secondary" className="mb-2">{article.category}</Badge>
                      <h3 className="font-bold text-gray-900">{article.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">⏱ {article.readTime}</span>
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                      Baca Selengkapnya <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6">
            Lihat Semua Artikel
          </Button>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-all">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-green-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{video.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{video.views} views</span>
                    <Badge variant="secondary">Tutorial</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-6">
            Lihat Semua Video
          </Button>
        </TabsContent>

        {/* Infographics Tab */}
        <TabsContent value="infographics" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {infographics.map((infographic) => (
              <Card key={infographic.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <img 
                  src={infographic.image} 
                  alt={infographic.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{infographic.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{infographic.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Info className="w-4 h-4 mr-2" />
                    Pelajari Lebih Lanjut
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-6">
            Lihat Semua Infografis
          </Button>
        </TabsContent>
      </Tabs>

      {/* Quick Tips Section */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-start gap-4">
          <div className="bg-green-500 text-white w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">💡 Tips Hari Ini</h3>
            <p className="text-gray-700 mb-3">
              Gunakan tas belanja yang dapat digunakan kembali untuk mengurangi penggunaan kantong plastik. 
              Satu tas kain dapat menggantikan hingga 1000 kantong plastik!
            </p>
            <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50">
              Bagikan Tips Ini
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
