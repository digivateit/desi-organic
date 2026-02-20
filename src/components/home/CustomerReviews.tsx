import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  product_name?: string;
  avatar?: string;
}

const CustomerReviews = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Demo reviews - will be replaced with Supabase data
  const reviews: Review[] = [
    {
      id: "1",
      customer_name: "রহিম উদ্দিন",
      rating: 5,
      comment: "সুন্দরবনের মধু অসাধারণ! এত খাঁটি মধু আগে কখনো খাইনি। পুরো পরিবার খুব খুশি।",
      product_name: "সুন্দরবনের খাঁটি মধু",
    },
    {
      id: "2",
      customer_name: "ফাতেমা বেগম",
      rating: 5,
      comment: "ঘি এর মান অতুলনীয়। রান্নায় ব্যবহার করলে আলাদা স্বাদ পাওয়া যায়। ধন্যবাদ অর্গানিক স্টোরকে।",
      product_name: "খাঁটি গাওয়া ঘি",
    },
    {
      id: "3",
      customer_name: "করিম সাহেব",
      rating: 4,
      comment: "ডেলিভারি খুব দ্রুত হয়েছে। পণ্যের মান ভালো। আবার অর্ডার করব।",
      product_name: "মিক্সড ড্রাই ফ্রুটস",
    },
    {
      id: "4",
      customer_name: "নাসরিন আক্তার",
      rating: 5,
      comment: "বাচ্চাদের জন্য খাঁটি মধু খুঁজছিলাম। এখানে পেয়ে গেলাম। প্যাকেজিংও সুন্দর ছিল।",
      product_name: "সুন্দরবনের খাঁটি মধু",
    },
    {
      id: "5",
      customer_name: "আলী হোসেন",
      rating: 5,
      comment: "চিনিগুঁড়া চাল এত ভালো মানের! পোলাও রান্না করলে অন্য রকম সুগন্ধ। সবাইকে recommend করছি।",
      product_name: "চিনিগুঁড়া চাল",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              গ্রাহকদের মতামত
            </h2>
            <p className="text-muted-foreground mt-1">
              আমাদের সম্মানিত গ্রাহকদের অভিজ্ঞতা
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex-shrink-0 w-80 bg-card rounded-xl p-6 border border-border shadow-card"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-primary/20 mb-4" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-foreground leading-relaxed mb-4 line-clamp-3">
                "{review.comment}"
              </p>

              {/* Product */}
              {review.product_name && (
                <p className="text-sm text-primary font-medium mb-4">
                  {review.product_name}
                </p>
              )}

              {/* Customer */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">
                    {review.customer_name.charAt(0)}
                  </span>
                </div>
                <span className="font-medium text-foreground">
                  {review.customer_name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
