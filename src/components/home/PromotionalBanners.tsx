import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const PromotionalBanners = () => {
  const { t } = useTranslation();
  const banners = [
    {
      id: "1",
      title: t("products.honey_collection"),
      subtitle: t("products.pure_honey"),
      image_url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=300&fit=crop",
      link_url: "/category/honey",
      bg_color: "from-amber-500/90 to-orange-600/90",
    },
    {
      id: "2",
      title: t("products.masala_collection"),
      subtitle: t("products.pure_masala"),
      image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=300&fit=crop",
      link_url: "/category/masala",
      bg_color: "from-red-500/90 to-rose-600/90",
    },
  ];

  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {banners.map((banner) => (
            <Link
              key={banner.id}
              to={banner.link_url}
              className="group relative h-48 md:h-56 rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300"
            >
              {/* Background Image */}
              <img
                src={banner.image_url}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg_color}`} />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-center p-6 md:p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-1">
                  {banner.title}
                </h3>
                <p className="text-white/90 mb-4">{banner.subtitle}</p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>{t("products.view_now")}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;
