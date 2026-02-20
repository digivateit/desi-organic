import { Leaf, Users, Award, Heart, Target, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";

const About = () => {
  const { t } = useTranslation();
  const { getItemCount } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={getItemCount()} />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.hero_title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("about.hero_subtitle")}
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">{t("about.story_title")}</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>{t("about.story_p1")}</p>
                  <p>{t("about.story_p2")}</p>
                </div>
              </div>
              <div className="bg-muted rounded-2xl p-8">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop"
                  alt="Organic farming"
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">{t("about.values_title")}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: t("about.values.purity_title"),
                  description: t("about.values.purity_desc"),
                },
                {
                  icon: Users,
                  title: t("about.values.trust_title"),
                  description: t("about.values.trust_desc"),
                },
                {
                  icon: Target,
                  title: t("about.values.quality_title"),
                  description: t("about.values.quality_desc"),
                },
              ].map((value) => (
                <div key={value.title} className="bg-card p-6 rounded-xl border border-border text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: t("about.stats.customers"), label: t("about.stats.customers_label") },
                { value: t("about.stats.products"), label: t("about.stats.products_label") },
                { value: t("about.stats.delivery"), label: t("about.stats.delivery_label") },
                { value: t("about.stats.rating"), label: t("about.stats.rating_label") },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-6 bg-muted/30 rounded-xl">
                  <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-primary/5">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">{t("about.why_choose_us")}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Leaf, title: t("about.reasons.organic_title"), description: t("about.reasons.organic_desc") },
                { icon: Award, title: t("about.reasons.quality_assurance_title"), description: t("about.reasons.quality_assurance_desc") },
                { icon: Truck, title: t("about.reasons.fast_delivery_title"), description: t("about.reasons.fast_delivery_desc") },
                { icon: Heart, title: t("about.reasons.money_back_title"), description: t("about.reasons.money_back_desc") },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;