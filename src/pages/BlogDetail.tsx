import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, User, ArrowLeft, Tag, Share2, Facebook, Twitter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";
import { useBlogPost, useBlogPosts } from "@/hooks/useCMSData";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { getItemCount } = useCart();

  const { data: post, isLoading } = useBlogPost(id);
  const { data: relatedPosts } = useBlogPosts(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartCount={getItemCount()} />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartCount={getItemCount()} />
        <main className="flex-1 py-12">
          <div className="container text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t("blog.post_not_found")}</h1>
            <p className="text-muted-foreground mb-6">{t("blog.post_not_found_desc")}</p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("blog.back_to_blog")}
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const otherPosts = (relatedPosts || []).filter(p => p.id !== post.id).slice(0, 3);

  const displayTitle = i18n.language === "bn" ? post.title_bn || post.title : post.title;
  const displayAuthor = i18n.language === "bn" ? post.author_bn || post.author || t("blog.author_default") : post.author || post.author_bn || t("blog.author_default");
  const displayCategory = i18n.language === "bn" ? post.category_bn || post.category : post.category;
  const displayContent = i18n.language === "bn" ? (post.content_bn || post.content) : (post.content || post.content_bn);
  const displayDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString(i18n.language === "bn" ? "bn-BD" : "en-US")
    : new Date(post.created_at).toLocaleDateString(i18n.language === "bn" ? "bn-BD" : "en-US");

  // Content might be an array or a string (if from DB)
  const paragraphs = Array.isArray(displayContent) ? displayContent : (displayContent ? [displayContent] : []);



  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={getItemCount()} />

      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={post.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=600&fit=crop"}
            alt={displayTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="container py-8">
          {/* Back Button */}
          <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("blog.see_all")}
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-2">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {displayDate}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {displayAuthor}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  <Tag className="h-3 w-3" />
                  {displayCategory}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6">
                {displayTitle}
              </h1>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground mb-4 leading-relaxed whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Share Section */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-foreground font-medium">
                    <Share2 className="h-4 w-4" />
                    {t("blog.share")}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(displayTitle)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t("blog.related_posts")}</h3>
                <div className="space-y-4">
                  {otherPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug || relatedPost.id}`}
                      className="block group"
                    >
                      <h4 className="text-foreground group-hover:text-primary transition-colors font-medium mb-1">
                        {i18n.language === "bn" ? relatedPost.title_bn || relatedPost.title : relatedPost.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {i18n.language === "bn" ? relatedPost.category_bn || relatedPost.category : relatedPost.category}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <Link to="/shop">
                    <Button className="w-full">{t("blog.view_products")}</Button>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
