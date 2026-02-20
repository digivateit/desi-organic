import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Cart = () => {
  const { t, i18n } = useTranslation();
  const {
    items,
    removeItem,
    updateQuantity,
    getItemCount,
    getSubtotal,
    getQuantityDiscount,
  } = useCart();

  const subtotal = getSubtotal();
  const { percentage: discountPercentage, amount: discountAmount } = getQuantityDiscount();
  const total = subtotal - discountAmount;

  const formatPrice = (price: number) => `৳${price.toLocaleString(i18n.language === "bn" ? "bn-BD" : "en-US")}`;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartCount={0} />

        <main className="flex-1 flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t("cart.empty_title")}</h1>
            <p className="text-muted-foreground">{t("cart.empty_desc")}</p>
            <Link to="/shop">
              <Button className="mt-4">
                {t("cart.start_shopping")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={getItemCount()} />

      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            {t("cart.title")}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-xl p-4 border border-border flex gap-4"
                >
                  {/* Image */}
                  <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                    <img
                      src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop"}
                      alt={i18n.language === "bn" ? item.name_bn : (item.name || item.name_bn)}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/product/${item.productId}`}>
                          <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                            {i18n.language === "bn" ? item.name_bn : (item.name || item.name_bn)}
                          </h3>
                        </Link>
                        {item.variant_name_bn && (
                          <p className="text-sm text-muted-foreground">
                            {i18n.language === "bn" ? item.variant_name_bn : (item.variant_name || item.variant_name_bn)}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={t("cart.remove")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-muted transition-colors"
                          disabled={item.quantity >= item.stock_quantity}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="font-bold text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  {t("cart.order_summary")}
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cart.subtotal")} ({getItemCount()}{t("cart.items_suffix")})</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>পরিমাণ ছাড় ({discountPercentage}%)</span>
                      <span className="font-medium">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="border-t border-border pt-3 flex justify-between text-base">
                    <span className="font-semibold">{t("cart.total")}</span>
                    <span className="font-bold text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Quantity Discount Info */}
                {discountPercentage === 0 && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg text-sm">
                    <p className="text-primary font-medium">
                      {t("cart.discount_info")}
                    </p>
                  </div>
                )}

                <Link to="/checkout" className="block mt-6">
                  <Button className="w-full" size="lg">
                    {t("cart.checkout")}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>

                <Link to="/products" className="block mt-3">
                  <Button variant="outline" className="w-full">
                    {t("cart.continue_shopping")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
