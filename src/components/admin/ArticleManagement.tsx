import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Badge } from "../ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  FileText,
  Calendar,
  User,
  Tag,
  Image as ImageIcon,
  Save,
  X
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { NewsItem } from "../../data/mockNews";

interface ArticleFormData {
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl: string;
  authorName: string;
  authorRole: string;
  tags: string;
  readTime: string;
}

const CATEGORIES = ["Tips", "Lingkungan", "Teknologi", "Ekonomi", "Komunitas"];

export function ArticleManagement() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    summary: "",
    content: "",
    category: "Tips",
    imageUrl: "",
    authorName: "",
    authorRole: "",
    tags: "",
    readTime: "5 menit"
  });

  // Load articles from localStorage
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = () => {
    const storedArticles = localStorage.getItem("ecobank_articles");
    if (storedArticles) {
      setArticles(JSON.parse(storedArticles));
    }
  };

  const saveArticles = (updatedArticles: NewsItem[]) => {
    localStorage.setItem("ecobank_articles", JSON.stringify(updatedArticles));
    setArticles(updatedArticles);
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      summary: "",
      content: "",
      category: "Tips",
      imageUrl: "",
      authorName: "",
      authorRole: "",
      tags: "",
      readTime: "5 menit"
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (article: NewsItem) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      summary: article.summary,
      content: article.content,
      category: article.category,
      imageUrl: article.imageUrl,
      authorName: article.author.name,
      authorRole: article.author.role,
      tags: article.tags.join(", "),
      readTime: article.readTime
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.title || !formData.summary || !formData.content) {
      toast.error("Judul, ringkasan, dan konten wajib diisi!");
      return;
    }

    const newArticle: NewsItem = {
      id: editingArticle ? editingArticle.id : Date.now().toString(),
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      category: formData.category,
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1654718421032-8aee5603b51f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xpbmclMjBncmVlbiUyMGVudmlyb25tZW50JTIwd2FzdGV8ZW58MXx8fHwxNzU5MTE1MTY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: editingArticle ? editingArticle.publishedAt : "Baru saja",
      readTime: formData.readTime,
      author: {
        name: formData.authorName || "Admin EcoBank",
        role: formData.authorRole || "Editor"
      },
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      views: editingArticle ? editingArticle.views : 0,
      likes: editingArticle ? editingArticle.likes : 0,
      comments: editingArticle ? editingArticle.comments : 0
    };

    let updatedArticles: NewsItem[];
    if (editingArticle) {
      updatedArticles = articles.map(article =>
        article.id === editingArticle.id ? newArticle : article
      );
      toast.success("Artikel berhasil diperbarui!");
    } else {
      updatedArticles = [newArticle, ...articles];
      toast.success("Artikel baru berhasil dibuat!");
    }

    saveArticles(updatedArticles);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      const updatedArticles = articles.filter(article => article.id !== id);
      saveArticles(updatedArticles);
      toast.success("Artikel berhasil dihapus!");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      summary: "",
      content: "",
      category: "Tips",
      imageUrl: "",
      authorName: "",
      authorRole: "",
      tags: "",
      readTime: "5 menit"
    });
    setEditingArticle(null);
  };

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || article.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-4 md:p-6 bg-gradient-to-br from-emerald-500 to-green-600 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-1">Kelola Artikel & Tips</h2>
            <p className="text-sm text-white/90">Buat dan kelola konten berita dan tips lingkungan</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleCreate}
                className="bg-white text-emerald-600 hover:bg-gray-100 h-10 px-3 md:px-4"
              >
                <Plus className="w-4 h-4 mr-1.5 shrink-0" />
                <span className="hidden sm:inline truncate">Buat Artikel Baru</span>
                <span className="sm:hidden">Buat Artikel</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingArticle ? "Edit Artikel" : "Buat Artikel Baru"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Artikel *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Masukkan judul artikel..."
                  />
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <Label htmlFor="summary">Ringkasan *</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Ringkasan singkat artikel..."
                    rows={3}
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Konten Artikel *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Tulis konten lengkap artikel... (Gunakan **text** untuk bold, dan paragraf baru untuk pemisah)"
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Tips: Gunakan **text** untuk bold, pisahkan paragraf dengan enter ganda
                  </p>
                </div>

                {/* Category & Read Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="readTime">Waktu Baca</Label>
                    <Input
                      id="readTime"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      placeholder="5 menit"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL Gambar</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://... (kosongkan untuk gambar default)"
                  />
                  {formData.imageUrl && (
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg mt-2"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1654718421032-8aee5603b51f";
                      }}
                    />
                  )}
                </div>

                {/* Author Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="authorName">Nama Penulis</Label>
                    <Input
                      id="authorName"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      placeholder="Admin EcoBank"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authorRole">Posisi Penulis</Label>
                    <Input
                      id="authorRole"
                      value={formData.authorRole}
                      onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                      placeholder="Editor"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="tips, lingkungan, daur-ulang"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 min-w-0 h-10 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-3 md:px-4"
                  >
                    <Save className="w-4 h-4 mr-1.5 shrink-0" />
                    <span className="truncate">{editingArticle ? "Perbarui Artikel" : "Publikasikan Artikel"}</span>
                  </Button>
                  <Button
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                    variant="outline"
                    className="h-10 w-10 p-0 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel..."
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Artikel</p>
              <p className="text-xl font-bold text-gray-900">{articles.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-xl font-bold text-gray-900">
                {articles.reduce((sum, a) => sum + a.views, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Kategori</p>
              <p className="text-xl font-bold text-gray-900">{CATEGORIES.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Artikel Baru</p>
              <p className="text-xl font-bold text-gray-900">
                {articles.filter(a => a.publishedAt.includes("hari") || a.publishedAt.includes("Baru")).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum ada artikel
            </h3>
            <p className="text-gray-600 mb-4">
              Mulai buat artikel pertama Anda untuk ditampilkan kepada pengguna
            </p>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white h-10 px-4"
            >
              <Plus className="w-4 h-4 mr-2 shrink-0" />
              <span className="truncate">Buat Artikel Baru</span>
            </Button>
          </Card>
        ) : (
          filteredArticles.map((article) => (
            <Card key={article.id} className="p-4 md:p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image */}
                <div className="w-full md:w-48 h-32 flex-shrink-0">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1654718421032-8aee5603b51f";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{article.category}</Badge>
                        <span className="text-xs text-gray-500">{article.publishedAt}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{article.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{article.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {article.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(article)}
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(article.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Helper Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Tips Menulis Artikel:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Gunakan judul yang menarik dan deskriptif</li>
              <li>Ringkasan harus singkat dan jelas (1-2 kalimat)</li>
              <li>Gunakan **text** untuk membuat teks tebal pada konten</li>
              <li>Pisahkan paragraf dengan enter ganda untuk readability</li>
              <li>Tambahkan tags yang relevan untuk memudahkan pencarian</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
