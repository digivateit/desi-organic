import { RotateCcw, CheckCircle, XCircle, Clock, Phone, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";
import { usePageContent } from "@/hooks/useCMSData";

const ReturnPolicy = () => {
  const { t, i18n } = useTranslation();
  const { getItemCount } = useCart();
  const { data: pageContent, isLoading } = usePageContent("return_policy");

  const sections = (pageContent?.content as any)?.sections || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={getItemCount()} />

      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <RotateCcw className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {i18n.language === "bn" ? (pageContent?.title_bn || "রিটার্ন পলিসি") : (pageContent?.title || "Return Policy")}
            </h1>
            <p className="text-muted-foreground">
              {t("policies.return.subtitle")}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="sr-only">{t("policies.return.loading")}</span>
            </div>
          ) : sections.length > 0 ? (
            <div className="space-y-6">
              {sections.map((section: any, index: number) => (
                <div key={index} className="bg-card p-6 rounded-xl border border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-3">
                    {i18n.language === "bn" ? section.title_bn || section.title : section.title}
                  </h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {i18n.language === "bn" ? section.content_bn || section.content : section.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Default content if no CMS data */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-2">{t("policies.return.time_limit_title")}</h2>
                    <p className="text-muted-foreground">
                      {t("policies.return.time_limit_desc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3">{t("policies.return.eligible_title")}</h2>
                    <ul className="space-y-2 text-muted-foreground">
                      {(t("policies.return.eligible_items", { returnObjects: true }) as string[]).map((item, idx) => (
                        <li key={idx}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-start gap-4">
                  <XCircle className="h-6 w-6 text-red-600 mt-1" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3">{t("policies.return.not_eligible_title")}</h2>
                    <ul className="space-y-2 text-muted-foreground">
                      {(t("policies.return.not_eligible_items", { returnObjects: true }) as string[]).map((item, idx) => (
                        <li key={idx}>✗ {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 bg-primary/5 p-6 rounded-xl text-center">
            <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">{t("policies.return.contact_title")}</h3>
            <p className="text-muted-foreground">{t("policies.return.contact_desc")}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReturnPolicy;
