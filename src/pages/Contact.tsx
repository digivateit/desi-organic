import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const Contact = () => {
  const { t } = useTranslation();
  const { getItemCount } = useCart();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success(t("contact.success_message"));
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={getItemCount()} />

      <main className="flex-1 py-12">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("contact.title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("contact.subtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t("contact.phone")}</h3>
                    <p className="text-muted-foreground">+880 1XXX-XXXXXX</p>
                    <p className="text-muted-foreground">+880 1XXX-XXXXXX</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t("contact.email")}</h3>
                    <p className="text-muted-foreground">info@organicstore.com</p>
                    <p className="text-muted-foreground">support@organicstore.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t("contact.address")}</h3>
                    <p className="text-muted-foreground">
                      {t("contact.address_value")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t("contact.service_hours")}</h3>
                    <p className="text-muted-foreground">{t("contact.hours_sat_thu")}</p>
                    <p className="text-muted-foreground">{t("contact.hours_fri")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">{t("contact.send_message")}</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("contact.name_label")}</Label>
                      <Input id="name" required placeholder={t("contact.name_placeholder")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("contact.phone_label")}</Label>
                      <Input id="phone" required placeholder={t("contact.phone_placeholder")} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("contact.email_label")}</Label>
                    <Input id="email" type="email" placeholder={t("contact.email_placeholder")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{t("contact.subject_label")}</Label>
                    <Input id="subject" placeholder={t("contact.subject_placeholder")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t("contact.message_label")}</Label>
                    <Textarea
                      id="message"
                      required
                      placeholder={t("contact.message_placeholder")}
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={loading}>
                    {loading ? t("contact.sending") : (
                      <>
                        <Send className="h-4 w-4" />
                        {t("contact.send_button")}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;