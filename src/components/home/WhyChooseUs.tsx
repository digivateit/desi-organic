import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const WhyChooseUs = () => {
  const { t } = useTranslation();
  const comparisons = [
    {
      feature: t("why_us.source_topic"),
      others: t("why_us.source_others"),
      us: t("why_us.source_us"),
    },
    {
      feature: t("why_us.chem_topic"),
      others: t("why_us.chem_others"),
      us: t("why_us.chem_us"),
    },
    {
      feature: t("why_us.quality_topic"),
      others: t("why_us.quality_others"),
      us: t("why_us.quality_us"),
    },
    {
      feature: t("why_us.price_topic"),
      others: t("why_us.price_others"),
      us: t("why_us.price_us"),
    },
    {
      feature: t("why_us.health_topic"),
      others: t("why_us.health_others"),
      us: t("why_us.health_us"),
    },
  ];

  return (
    <section className="py-10 md:py-14">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("why_us.title")}
          </h2>
          <p className="text-muted-foreground mt-2">
            {t("why_us.subtitle")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center font-semibold text-foreground">{t("why_us.topic")}</div>
            <div className="text-center font-semibold text-destructive">{t("why_us.others")}</div>
            <div className="text-center font-semibold text-primary">{t("why_us.us")}</div>
          </div>

          {/* Comparison Rows */}
          <div className="space-y-3">
            {comparisons.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 bg-card rounded-xl p-4 border border-border"
              >
                <div className="font-medium text-foreground flex items-center">
                  {item.feature}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-destructive flex-shrink-0" />
                  <span>{item.others}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{item.us}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
