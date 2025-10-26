import { NewsItem, mockNews } from "../data/mockNews";

/**
 * Load all articles from both mockNews and localStorage (admin-created)
 */
export function loadAllArticles(): NewsItem[] {
  // Get admin-created articles from localStorage
  const storedArticles = localStorage.getItem("ecobank_articles");
  const adminArticles: NewsItem[] = storedArticles ? JSON.parse(storedArticles) : [];

  // Combine admin articles (first) with mock articles
  // This ensures admin articles appear first
  return [...adminArticles, ...mockNews];
}

/**
 * Get a single article by ID from both sources
 */
export function getArticleById(id: string): NewsItem | undefined {
  const allArticles = loadAllArticles();
  return allArticles.find(article => article.id === id);
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): NewsItem[] {
  const allArticles = loadAllArticles();
  if (category === "all") return allArticles;
  return allArticles.filter(article => article.category === category);
}

/**
 * Get featured articles (top 3 most viewed)
 */
export function getFeaturedArticles(limit: number = 3): NewsItem[] {
  const allArticles = loadAllArticles();
  return allArticles
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

/**
 * Increment view count for an article
 */
export function incrementArticleViews(id: string): void {
  // Check if it's an admin article
  const storedArticles = localStorage.getItem("ecobank_articles");
  if (storedArticles) {
    const adminArticles: NewsItem[] = JSON.parse(storedArticles);
    const articleIndex = adminArticles.findIndex(article => article.id === id);
    
    if (articleIndex !== -1) {
      adminArticles[articleIndex].views += 1;
      localStorage.setItem("ecobank_articles", JSON.stringify(adminArticles));
    }
  }
  
  // Note: We don't increment views for mockNews articles as they're read-only
}

/**
 * Increment like count for an article
 */
export function toggleArticleLike(id: string, userId: string): boolean {
  const likesKey = `article_likes_${userId}`;
  const likedArticles = JSON.parse(localStorage.getItem(likesKey) || "[]");
  const isLiked = likedArticles.includes(id);

  // Check if it's an admin article
  const storedArticles = localStorage.getItem("ecobank_articles");
  if (storedArticles) {
    const adminArticles: NewsItem[] = JSON.parse(storedArticles);
    const articleIndex = adminArticles.findIndex(article => article.id === id);
    
    if (articleIndex !== -1) {
      if (isLiked) {
        // Unlike
        adminArticles[articleIndex].likes -= 1;
        const newLikedArticles = likedArticles.filter((articleId: string) => articleId !== id);
        localStorage.setItem(likesKey, JSON.stringify(newLikedArticles));
      } else {
        // Like
        adminArticles[articleIndex].likes += 1;
        likedArticles.push(id);
        localStorage.setItem(likesKey, JSON.stringify(likedArticles));
      }
      
      localStorage.setItem("ecobank_articles", JSON.stringify(adminArticles));
      return !isLiked; // Return new like status
    }
  }

  // For mockNews articles, just track user's like without modifying the article
  if (isLiked) {
    const newLikedArticles = likedArticles.filter((articleId: string) => articleId !== id);
    localStorage.setItem(likesKey, JSON.stringify(newLikedArticles));
    return false;
  } else {
    likedArticles.push(id);
    localStorage.setItem(likesKey, JSON.stringify(likedArticles));
    return true;
  }
}

/**
 * Check if user has liked an article
 */
export function hasUserLikedArticle(id: string, userId: string): boolean {
  const likesKey = `article_likes_${userId}`;
  const likedArticles = JSON.parse(localStorage.getItem(likesKey) || "[]");
  return likedArticles.includes(id);
}
