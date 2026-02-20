import { Truck, MapPin, Clock, Package, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";

const ShippingPolicy = () => {
  const { t } = useTranslation();
  const { getItemCount } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={getItemCount()} />

      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("policies.shipping.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("policies.shipping.subtitle")}
            </p>
          </div>

          <div className="space-y-8">
            {/* Delivery Charges */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground mb-4">{t("policies.shipping.charges_title")}</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-medium text-foreground mb-2">{t("policies.shipping.inside_dhaka")}</h3>
                      <p className="text-2xl font-bold text-primary mb-1">৳৬০</p>
                      <p className="text-sm text-muted-foreground">{t("policies.shipping.dhaka_time")}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-medium text-foreground mb-2">{t("policies.shipping.outside_dhaka")}</h3>
                      <p className="text-2xl font-bold text-primary mb-1">৳১২০</p>
                      <p className="text-sm text-muted-foreground">{t("policies.shipping.outside_dhaka_time")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Free Delivery */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl border border-primary/20">
              <h2 className="text-lg font-semibold text-foreground mb-3">{t("policies.shipping.free_delivery_title")}</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {t("policies.shipping.free_dhaka")}</li>
                <li>• {t("policies.shipping.free_outside")}</li>
                <li>• {t("policies.shipping.free_promo")}</li>
              </ul>
            </div>

            {/* Delivery Time */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-3">{t("policies.shipping.delivery_time")}</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      {t("policies.shipping.dhaka_time")}
                    </li>
                    <li className="flex items-start gap-2">
                      {t("policies.shipping.outside_dhaka_time")}
                    </li>
                    <li className="flex items-start gap-2 text-xs">
                      {t("policies.shipping.note")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Courier Partner */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-start gap-4">
                <Package className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-3">{t("policies.shipping.courier_title")}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t("policies.shipping.courier_desc")}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-muted rounded-full text-sm">Steadfast Courier</span>
                    <span className="px-3 py-1 bg-muted rounded-full text-sm">Sundarban Courier</span>
                    <span className="px-3 py-1 bg-muted rounded-full text-sm">Pathao</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Safe Packaging */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-3">{t("policies.shipping.packaging_title")}</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    {(t("policies.shipping.packaging_items", { returnObjects: true }) as string[]).map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-muted/50 p-6 rounded-xl">
              <h2 className="text-lg font-semibold text-foreground mb-3">{t("policies.shipping.important_info")}</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {(t("policies.shipping.info_items", { returnObjects: true }) as string[]).map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShippingPolicy;