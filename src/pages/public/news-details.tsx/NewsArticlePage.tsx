// import React from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { ArrowLeft, Calendar, User, Tag, Share2, Bookmark, Printer as Print } from 'lucide-react';
// import { Card } from '../../components/ui/Card';
// import { Button } from '../../components/ui/Button';
// import { Badge } from '../../components/ui/Badge';
// import { mockNews } from '../../data/newsData';

// export const NewsArticlePage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const article = mockNews.find(news => news.id === id);

//   if (!article) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
//           <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
//           <p className="text-slate-600 mb-8">The article you're looking for could not be found.</p>
//           <Link to="/news-events">
//             <Button>Back to News & Events</Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const getCategoryColor = (category: string) => {
//     const colors: { [key: string]: 'default' | 'success' | 'warning' | 'danger' | 'info' } = {
//       news: 'info',
//       announcement: 'success',
//       research: 'warning',
//       acquisition: 'default'
//     };
//     return colors[category] || 'default';
//   };

//   const relatedArticles = mockNews
//     .filter(news => 
//       news.id !== article.id && 
//       (news.category === article.category || 
//        news.tags.some(tag => article.tags.includes(tag)))
//     )
//     .slice(0, 3);

//   return (
//     <div className="min-h-screen bg-gray-50">

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Back Button */}
//         <div className="mb-6">
//           <Link to="/news-events" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
//             <ArrowLeft className="h-4 w-4" />
//             <span>Back to News & Events</span>
//           </Link>
//         </div>

//         {/* Article Header */}
//         <Card className="mb-8">
//           <div className="mb-6">
//             <div className="flex items-center space-x-2 mb-4">
//               <Badge variant={getCategoryColor(article.category)} className="capitalize">
//                 {article.category}
//               </Badge>
//               <span className="text-sm text-slate-500">
//                 {formatDate(article.publishedAt)}
//               </span>
//             </div>
            
//             <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
//               {article.title}
//             </h1>

//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center space-x-2 text-slate-600">
//                 <User className="h-5 w-5" />
//                 <span className="font-medium">{article.author}</span>
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <Button variant="ghost" size="sm">
//                   <Bookmark className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="sm">
//                   <Share2 className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="sm">
//                   <Print className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             {/* Featured Image */}
//             {article.imageUrl && (
//               <img
//                 src={article.imageUrl}
//                 alt={article.title}
//                 className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-sm mb-6"
//               />
//             )}

//             {/* Excerpt */}
//             <div className="bg-slate-50 p-6 rounded-lg mb-6">
//               <p className="text-lg text-slate-700 leading-relaxed font-medium">
//                 {article.excerpt}
//               </p>
//             </div>
//           </div>
//         </Card>

//         {/* Article Content */}
//         <Card className="mb-8">
//           <div className="prose prose-slate prose-lg max-w-none">
//             {article.content.split('\n\n').map((paragraph, index) => {
//               if (paragraph.startsWith('Key highlights') || paragraph.startsWith('The donation includes') || paragraph.startsWith('Fellowship Benefits') || paragraph.startsWith('Tour highlights')) {
//                 const [title, ...items] = paragraph.split('\n');
//                 return (
//                   <div key={index} className="my-6">
//                     <p className="font-semibold text-slate-900 mb-3">{title}</p>
//                     <ul className="list-disc list-inside space-y-2 text-slate-700">
//                       {items.map((item, itemIndex) => (
//                         <li key={itemIndex}>{item.replace(/^- /, '')}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 );
//               }
//               return (
//                 <p key={index} className="text-slate-700 leading-relaxed mb-4">
//                   {paragraph}
//                 </p>
//               );
//             })}
//           </div>
//         </Card>

//         {/* Tags */}
//         <Card className="mb-8">
//           <h3 className="text-lg font-semibold text-slate-900 mb-4">Tags</h3>
//           <div className="flex flex-wrap gap-2">
//             {article.tags.map((tag, index) => (
//               <Link 
//                 key={index} 
//                 to={`/news-events?search=${encodeURIComponent(tag)}`}
//                 className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm transition-colors"
//               >
//                 <Tag className="h-3 w-3" />
//                 <span>{tag}</span>
//               </Link>
//             ))}
//           </div>
//         </Card>

//         {/* Related Articles */}
//         {relatedArticles.length > 0 && (
//           <Card>
//             <h3 className="text-lg font-semibold text-slate-900 mb-6">Related Articles</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {relatedArticles.map((relatedArticle) => (
//                 <Link 
//                   key={relatedArticle.id} 
//                   to={`/news/${relatedArticle.id}`}
//                   className="block group"
//                 >
//                   {relatedArticle.imageUrl && (
//                     <img 
//                       src={relatedArticle.imageUrl} 
//                       alt={relatedArticle.title}
//                       className="w-full h-32 object-cover rounded-lg mb-3 group-hover:shadow-md transition-shadow"
//                     />
//                   )}
//                   <div className="space-y-2">
//                     <Badge variant={getCategoryColor(relatedArticle.category)} size="sm" className="capitalize">
//                       {relatedArticle.category}
//                     </Badge>
//                     <h4 className="font-medium text-slate-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
//                       {relatedArticle.title}
//                     </h4>
//                     <p className="text-xs text-slate-600">
//                       {formatDate(relatedArticle.publishedAt)}
//                     </p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </Card>
//         )}
//       </div>

//     </div>
//   );
// };

import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNews, usePublishedNews } from "../../../hooks/useGovernance";
import { ArticleHeader } from "./ArticleHeader";
import { ArticleContent } from "./ArticleContent";
import { ArticleGallery } from "./ArticleGallery";
import { ArticleMetadata } from "./ArticleMetadata";
import { RelatedArticles } from "./RelatedArticle";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";

export const NewsArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading, error } = useNews(id || "", !!id);
  const { data: allNews } = usePublishedNews();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: {
      [key: string]: "default" | "success" | "warning" | "danger" | "info";
    } = {
      news: "info",
      announcement: "success",
      research: "warning",
      acquisition: "default",
    };
    return colors[category] || "default";
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  if (isLoading) {
    return (
        <LoadingSpinner size="lg" message="Loading article..." />
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-slate-600 mb-8">
            The article you're looking for could not be found.
          </p>
          <Link to="/news-events">
            <Button>Back to News & Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get first image from fileAssets
  const featuredImage = article.fileAssets?.[0];
  const imageUrl = featuredImage?.cloudinaryPublicId
    ? `https://res.cloudinary.com/your-cloud-name/image/upload/${featuredImage.cloudinaryPublicId}`
    : featuredImage?.localPath;

  const excerpt = stripHtml(article.content).substring(0, 200) + "...";

  // Related articles - get 3 most recent articles excluding current one
  const relatedArticles =
    allNews?.filter((news) => news.id !== article.id).slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/news-events"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to News & Events</span>
          </Link>
        </div>

        {/* Article Header */}
        <ArticleHeader
          title={article.title}
          author={article.author || "National Archive"}
          createdAt={article.createdAt}
          imageUrl={imageUrl}
          excerpt={excerpt}
          formatDate={formatDate}
          getCategoryColor={getCategoryColor}
        />

        {/* Article Content */}
        <ArticleContent content={article.content} />

        {/* Additional Images Gallery */}
        <ArticleGallery fileAssets={article.fileAssets || []} />

        {/* Article Metadata */}
        <ArticleMetadata
          createdAt={article.createdAt}
          updatedAt={article.updatedAt}
          status={article.status}
          author={article.author || "National Archive"}
          formatDate={formatDate}
        />

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} formatDate={formatDate} />
      </div>
    </div>
  );
};