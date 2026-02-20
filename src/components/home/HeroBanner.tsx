import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Banner {
  id: string;
  title_bn: string;
  subtitle_bn?: string;
  image_url: string;
  link_url?: string;
}

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Demo banners - will be replaced with data from Supabase
  const banners: Banner[] = [
    {
      id: "1",
      title_bn: "১০০% খাঁটি অর্গানিক পণ্য",
      subtitle_bn: "প্রকৃতির স্পর্শে স্বাস্থ্যকর জীবন শুরু করুন",
      image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=500&fit=crop",
      link_url: "/products",
    },
    {
      id: "2",
      title_bn: "সরাসরি কৃষকদের কাছ থেকে",
      subtitle_bn: "মধ্যস্বত্বভোগী ছাড়াই সেরা দামে",
      image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=500&fit=crop",
      link_url: "/products",
    },
    {
      id: "3",
      title_bn: "বিশেষ ছাড় চলছে!",
      subtitle_bn: "৩টি পণ্য কিনলে ৫% ছাড়, ৫টি কিনলে ১০% ছাড়",
      image_url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&h=500&fit=crop",
      link_url: "/products",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${banner.image_url})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="container relative h-full flex items-center">
              <div className="max-w-lg text-primary-foreground space-y-4 animate-fade-in">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  {banner.title_bn}
                </h2>
                {banner.subtitle_bn && (
                  <p className="text-lg sm:text-xl opacity-90">
                    {banner.subtitle_bn}
                  </p>
                )}
                {banner.link_url && (
                  <Link to={banner.link_url}>
                    <Button size="lg" className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground shadow-hover">
                      এখনই কিনুন
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-md"
          aria-label="আগের ব্যানার"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-md"
          aria-label="পরের ব্যানার"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-accent w-8"
                  : "bg-card/60 hover:bg-card"
              }`}
              aria-label={`ব্যানার ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
