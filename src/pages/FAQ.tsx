import { HelpCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";
import { usePageContent } from "@/hooks/useCMSData";

const FAQ = () => {
  const { t, i18n } = useTranslation();
  const { getItemCount } = useCart();
  const { data: pageContent, isLoading } = usePageContent("faq");

  const faqs = (pageContent?.content as any)?.questions || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={getItemCount()} />

      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {i18n.language === "bn" ? (pageContent?.title_bn || "সাধারণ জিজ্ঞাসা") : (pageContent?.title || "General FAQ")}
            </h1>
            <p className="text-muted-foreground">
              {t("faq.subtitle")}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="sr-only">{t("faq.loading")}</span>
            </div>
          ) : faqs.length > 0 ? (
            <div className="bg-card rounded-xl border border-border p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq: any, index: number) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {i18n.language === "bn" ? faq.question_bn || faq.question : faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {i18n.language === "bn" ? faq.answer_bn || faq.answer : faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-6 text-center text-muted-foreground">
              {t("faq.no_faqs")}
            </div>
          )}

          <div className="mt-8 p-6 bg-muted/50 rounded-xl text-center">
            <p className="text-muted-foreground mb-4">
              {t("faq.not_found")}
            </p>
            <a href="/contact" className="text-primary hover:underline font-medium">
              {t("faq.contact_us")}
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
