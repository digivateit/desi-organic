import { Check, X } from "lucide-react";

const WhyChooseUs = () => {
  const comparisons = [
    {
      feature: "পণ্যের উৎস",
      others: "অজানা/মিশ্রিত",
      us: "সরাসরি কৃষকদের কাছ থেকে",
    },
    {
      feature: "রাসায়নিক",
      others: "ক্ষতিকর রাসায়নিক মিশ্রিত",
      us: "সম্পূর্ণ রাসায়নিক মুক্ত",
    },
    {
      feature: "মান নিয়ন্ত্রণ",
      others: "নেই বা দুর্বল",
      us: "কঠোর মান নিয়ন্ত্রণ",
    },
    {
      feature: "দাম",
      others: "মধ্যস্বত্বভোগীদের জন্য বেশি",
      us: "সরাসরি ক্রয়ে সাশ্রয়ী",
    },
    {
      feature: "স্বাস্থ্য সুরক্ষা",
      others: "ঝুঁকিপূর্ণ",
      us: "নিরাপদ ও স্বাস্থ্যকর",
    },
  ];

  return (
    <section className="py-10 md:py-14">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            অন্যরা vs আমরা
          </h2>
          <p className="text-muted-foreground mt-2">
            কেন অর্গানিক স্টোর থেকে কেনাকাটা করবেন?
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center font-semibold text-foreground">বিষয়</div>
            <div className="text-center font-semibold text-destructive">অন্যান্য দোকান</div>
            <div className="text-center font-semibold text-primary">আমরা</div>
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
