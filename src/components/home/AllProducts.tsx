import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const AllProducts = () => {
  const [visibleCount, setVisibleCount] = useState(8);

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['all-products-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const visibleProducts = allProducts.slice(0, visibleCount);
  const hasMore = visibleCount < allProducts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, allProducts.length));
  };

  const handleAddToCart = (productId: string) => {
    console.log("Add to cart:", productId);
  };

  if (isLoading) {
    return (
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-32 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
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

  if (allProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-14">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            সকল পণ্য
          </h2>
          <p className="text-muted-foreground mt-1">
            আমাদের সম্পূর্ণ অর্গানিক পণ্যের তালিকা
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {visibleProducts.map((product) => (
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

        {hasMore && (
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              className="px-8"
            >
              আরো দেখুন
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllProducts;
