import { Truck, Shield, Leaf, HeartHandshake, Clock, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const Benefits = () => {
  const { t } = useTranslation();
  const benefits = [
    {
      icon: Leaf,
      title: t("benefits.organic_title"),
      description: t("benefits.organic_desc"),
    },
    {
      icon: Truck,
      title: t("benefits.delivery_title"),
      description: t("benefits.delivery_desc"),
    },
    {
      icon: Shield,
      title: t("benefits.moneyback_title"),
      description: t("benefits.moneyback_desc"),
    },
    {
      icon: HeartHandshake,
      title: t("benefits.farmer_title"),
      description: t("benefits.farmer_desc"),
    },
    {
      icon: Clock,
      title: t("benefits.support_title"),
      description: t("benefits.support_desc"),
    },
    {
      icon: Award,
      title: t("benefits.quality_title"),
      description: t("benefits.quality_desc"),
    },
  ];

  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("benefits.title")}
          </h2>
          <p className="text-muted-foreground mt-2">
            {t("benefits.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-5 md:p-6 border border-border shadow-card hover:shadow-hover transition-all duration-300 text-center group"
            >
              <div className="w-14 h-14 mx-auto rounded-full gradient-organic flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <benefit.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
