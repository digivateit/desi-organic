import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, User, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";
import { useBlogPosts } from "@/hooks/useCMSData";

const Blog = () => {
  const { t, i18n } = useTranslation();
  const { getItemCount } = useCart();
  const { data: blogPosts, isLoading } = useBlogPosts(true); // Only published

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={getItemCount()} />

      <main className="flex-1 py-12">
        <div className="container">
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("blog.title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("blog.subtitle")}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : blogPosts && blogPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-card rounded-xl border border-border overflow-hidden group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop"}
                      alt={i18n.language === "bn" ? post.title_bn || post.title : post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString(i18n.language === "bn" ? "bn-BD" : "en-US")
                          : new Date(post.created_at).toLocaleDateString(i18n.language === "bn" ? "bn-BD" : "en-US")
                        }
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {i18n.language === "bn" ? (post.author_bn || post.author || t("blog.author_default")) : (post.author || post.author_bn || t("blog.author_default"))}
                      </span>
                    </div>
                    {post.category && (
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full mb-3">
                        {i18n.language === "bn" ? post.category_bn || post.category : post.category}
                      </span>
                    )}
                    <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {i18n.language === "bn" ? post.title_bn || post.title : post.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {i18n.language === "bn" ? post.excerpt_bn || post.excerpt : post.excerpt}
                    </p>
                    <Link to={`/blog/${post.slug || post.id}`}>
                      <Button variant="link" className="p-0 h-auto gap-2">
                        {t("blog.read_more")}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t("blog.no_posts")}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
