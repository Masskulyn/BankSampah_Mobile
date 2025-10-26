import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  Bookmark, 
  Heart, 
  MessageCircle,
  User,
  Eye,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Copy
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface ArticleViewProps {
  article: {
    id: string;
    title: string;
    summary: string;
    content: string;
    category: string;
    publishedAt: string;
    readTime: string;
    imageUrl: string;
    author: {
      name: string;
      avatar?: string;
      role: string;
    };
    tags: string[];
    views: number;
    likes: number;
    comments: number;
    relatedArticles?: Array<{
      id: string;
      title: string;
      imageUrl: string;
      category: string;
    }>;
  };
  onBack: () => void;
  onArticleClick?: (articleId: string) => void;
}

export function ArticleView({ article, onBack, onArticleClick }: ArticleViewProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

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

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Like dibatalkan" : "Artikel disukai! ❤️");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Bookmark dihapus" : "Artikel disimpan! 📖");
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `${article.title} - ${article.summary}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success("Link artikel disalin!");
        break;
    }
    setShowShareMenu(false);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (dateString.includes('hari') || dateString.includes('minggu')) {
      return dateString;
    }
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Parse content paragraphs
  const contentParagraphs = article.content.split('\n\n').filter(p => p.trim());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
            Kembali
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className={`${isBookmarked ? 'text-yellow-600 bg-yellow-50' : 'hover:bg-gray-100'}`}
            >
              <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
            </Button>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="hover:bg-gray-100"
              >
                <Share2 size={20} />
              </Button>
              
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 min-w-48 z-20">
                  <Button
                    variant="ghost"
                    onClick={() => handleShare('facebook')}
                    className="w-full justify-start gap-3 text-blue-600 hover:bg-blue-50"
                  >
                    <Facebook size={16} />
                    Facebook
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleShare('twitter')}
                    className="w-full justify-start gap-3 text-sky-500 hover:bg-sky-50"
                  >
                    <Twitter size={16} />
                    Twitter
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleShare('copy')}
                    className="w-full justify-start gap-3 text-gray-600 hover:bg-gray-50"
                  >
                    <Copy size={16} />
                    Copy Link
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Hero Image */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <ImageWithFallback
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={`text-sm font-semibold shadow-lg ${getCategoryColor(article.category)}`}>
              {article.category}
            </Badge>
          </div>
        </div>

        {/* Article Header */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {article.summary}
            </p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={16} />
                <span>{article.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{article.author.name}</p>
                <p className="text-sm text-gray-600">{article.author.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Article Content */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              {contentParagraphs.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-6 text-justify">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Article Actions */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleLike}
                  className={`gap-2 ${isLiked ? 'text-red-600 border-red-300 bg-red-50' : ''}`}
                >
                  <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                  {article.likes + (isLiked ? 1 : 0)}
                </Button>
                
                <Button variant="outline" className="gap-2">
                  <MessageCircle size={18} />
                  {article.comments}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleBookmark}
                  className={`gap-2 ${isBookmarked ? 'text-yellow-600 border-yellow-300 bg-yellow-50' : ''}`}
                >
                  <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                  {isBookmarked ? 'Tersimpan' : 'Simpan'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Artikel Terkait</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {article.relatedArticles.map((related) => (
                  <div
                    key={related.id}
                    onClick={() => onArticleClick?.(related.id)}
                    className="group cursor-pointer bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex gap-4">
                      <ImageWithFallback
                        src={related.imageUrl}
                        alt={related.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <Badge
                          className={`text-xs mb-2 ${getCategoryColor(related.category)}`}
                        >
                          {related.category}
                        </Badge>
                        <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {related.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <span>Baca artikel</span>
                          <ChevronRight size={14} className="ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}