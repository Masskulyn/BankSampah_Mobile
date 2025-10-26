import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, ExternalLink, Sparkles, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  url?: string;
}

interface NewsSectionProps {
  news: NewsItem[];
  onSeeAll?: () => void;
  onArticleClick?: (articleId: string) => void;
}

export function NewsSection({ news, onSeeAll, onArticleClick }: NewsSectionProps) {
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

  return (
    <Card className="p-6 bg-white shadow-xl border-0 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Berita & Tips</h3>
            <p className="text-sm text-gray-500">Update terbaru untuk Anda</p>
          </div>
        </div>
        <button 
          onClick={onSeeAll}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors hover:bg-blue-50 px-3 py-2 rounded-lg"
        >
          Lihat Semua
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={item.id} className="group">
            <div 
              onClick={() => onArticleClick?.(item.id)}
              className="flex gap-4 p-4 bg-gradient-to-r from-gray-50/50 to-gray-50/80 hover:from-gray-50 hover:to-gray-100 rounded-2xl cursor-pointer transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:shadow-lg"
            >
              <div className="relative overflow-hidden rounded-xl flex-shrink-0">
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-24 h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge className={`text-xs font-semibold shadow-lg ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </Badge>
                  <ExternalLink size={16} className="text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors" />
                </div>
                
                <h4 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-gray-700 transition-colors leading-snug">
                  {item.title}
                </h4>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                  {item.summary}
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    <Clock size={10} />
                    <span className="font-medium">{item.readTime}</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span className="text-xs text-gray-500 font-medium">{item.publishedAt}</span>
                </div>
              </div>
            </div>
            
            {/* Separator */}
            {index < news.length - 1 && (
              <div className="my-4 border-t border-gray-100"></div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}