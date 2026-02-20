import { Leaf, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full gradient-organic flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">{t("header.store_name")}</h2>
                <p className="text-[10px] text-muted-foreground">{t("header.store_tagline")}</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer.about_description")}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.quick_links")}</h3>
            <ul className="space-y-2.5">
              {[
                { name: t("nav.shop"), href: "/shop" },
                { name: t("nav.about"), href: "/about" },
                { name: t("nav.contact"), href: "/contact" },
                { name: t("nav.blog") || "Blog", href: "/blog" },
                { name: "FAQ", href: "/faq" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.customer_service")}</h3>
            <ul className="space-y-2.5">
              {[
                { name: t("common.my_orders") || "My Orders", href: "/account" },
                { name: t("nav.track_order"), href: "/track-order" },
                { name: t("footer.return_policy") || "Return Policy", href: "/return-policy" },
                { name: t("footer.shipping_policy") || "Shipping Policy", href: "/shipping-policy" },
                { name: t("footer.terms") || "Terms & Conditions", href: "/terms" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+8801XXXXXXXXX"
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>+880 1XXX-XXXXXX</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@organicstore.com"
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>info@organicstore.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{t("footer.location")}</span>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-foreground mb-2">{t("footer.payment_methods")}</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded">{t("footer.cod")}</span>
                <span className="px-2 py-1 bg-muted rounded">bKash</span>
                <span className="px-2 py-1 bg-muted rounded">Nagad</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-muted/30">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {t("header.store_name")}. {t("footer.rights")}</p>
            <p className="text-xs">{t("footer.developer")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
