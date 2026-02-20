import { Truck, Shield, Leaf, HeartHandshake, Clock, Award } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: Leaf,
      title: "১০০% অর্গানিক",
      description: "সম্পূর্ণ প্রাকৃতিক ও রাসায়নিক মুক্ত পণ্য",
    },
    {
      icon: Truck,
      title: "দ্রুত ডেলিভারি",
      description: "ঢাকায় ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ৩-৫ দিন",
    },
    {
      icon: Shield,
      title: "মানি ব্যাক গ্যারান্টি",
      description: "সন্তুষ্ট না হলে সম্পূর্ণ টাকা ফেরত",
    },
    {
      icon: HeartHandshake,
      title: "সরাসরি কৃষক থেকে",
      description: "মধ্যস্বত্বভোগী ছাড়াই সেরা দাম",
    },
    {
      icon: Clock,
      title: "২৪/৭ সাপোর্ট",
      description: "যেকোনো সমস্যায় আমরা আছি আপনার পাশে",
    },
    {
      icon: Award,
      title: "সেরা মান",
      description: "কঠোর মান নিয়ন্ত্রণে সেরা পণ্য",
    },
  ];

  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            কেন আমাদের বেছে নেবেন?
          </h2>
          <p className="text-muted-foreground mt-2">
            আপনার বিশ্বাসই আমাদের পুঁজি
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
