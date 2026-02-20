import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProducts = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddToCart = (productId: string) => {
    console.log("Add to cart:", productId);
  };

  if (isLoading) {
    return (
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-14">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              বিশেষ পণ্যসমূহ
            </h2>
            <p className="text-muted-foreground mt-1">
              আমাদের সেরা মানের অর্গানিক পণ্য
            </p>
          </div>
          <Link to="/shop?featured=true">
            <Button variant="outline" className="hidden sm:flex items-center gap-2">
              সব দেখুন
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name_bn={product.name_bn}
              slug={product.slug}
              image_url={product.images?.[0] || ''}
              base_price={product.base_price}
              sale_price={product.sale_price}
              stock_quantity={product.stock_quantity}
              onAddToCart={() => handleAddToCart(product.id)}
            />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link to="/shop?featured=true">
            <Button variant="outline" className="w-full">
              সব দেখুন
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
