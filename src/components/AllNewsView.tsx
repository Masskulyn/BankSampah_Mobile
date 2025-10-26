import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Clock, 
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useState } from "react";
import { NewsItem } from "../data/mockNews";

interface AllNewsViewProps {
  news: NewsItem[];
  onBack: () => void;
  onArticleClick: (articleId: string) => void;
}

export function AllNewsView({ news, onBack, onArticleClick }: AllNewsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState("newest");

  const categories = ["all", "Tips", "Lingkungan", "Teknologi", "Ekonomi", "Komunitas"];

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tips':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0';
      case 'lingkungan':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0';
      case 'teknologi':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0';
      case 'ekonomi':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
    }
  };

  // Filter and sort news
  const filteredNews = news
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.views - a.views;
        case "liked":
          return b.likes - a.likes;
        case "oldest":
          return a.id.localeCompare(b.id);
        default: // newest
          return b.id.localeCompare(a.id);
      }
    });

  const formatDate = (dateString: string) => {
    if (dateString.includes('hari') || dateString.includes('minggu')) {
      return dateString;
    }
    return dateString;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Berita & Tips</h1>
            <p className="text-gray-600">Update terbaru dunia lingkungan</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Filter size={16} />
                      <SelectValue placeholder="Semua Kategori" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "Semua Kategori" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-gray-50">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="popular">Terpopuler</SelectItem>
                    <SelectItem value="liked">Paling Disukai</SelectItem>
                    <SelectItem value="oldest">Terlama</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Menampilkan {filteredNews.length} dari {news.length} artikel
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={14} />
          <span>Diperbarui hari ini</span>
        </div>
      </div>

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <Card className="shadow-lg border-0">
          <CardContent className="p-12 text-center">
            <Search size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Artikel tidak ditemukan</h3>
            <p className="text-gray-600">Coba ubah kata kunci atau filter pencarian Anda</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNews.map((item) => (
            <Card 
              key={item.id} 
              className="group cursor-pointer shadow-lg border-0 hover:shadow-xl transition-all duration-300 overflow-hidden"
              onClick={() => onArticleClick(item.id)}
            >
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className={`text-sm font-semibold shadow-lg ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </Badge>
                </div>

                {/* Stats Overlay */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-3 text-white text-sm">
                    <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
                      <Eye size={12} />
                      <span>{item.views}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
                      <Heart size={12} />
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors leading-tight">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{item.readTime}</span>
                    </div>
                    <span>•</span>
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MessageCircle size={12} />
                      <span>{item.comments}</span>
                    </div>
                  </div>
                </div>

                {/* Author */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {item.author.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.author.name}</p>
                      <p className="text-xs text-gray-500">{item.author.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}