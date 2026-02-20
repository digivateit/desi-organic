import { Leaf, Users, Award, Heart, Target, Truck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";

const About = () => {
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
              আমাদের সম্পর্কে
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              প্রকৃতির বিশুদ্ধতা আপনার দোরগোড়ায় পৌঁছে দেওয়াই আমাদের লক্ষ্য
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">আমাদের গল্প</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    অর্গানিক স্টোর শুরু হয়েছিল একটি সাধারণ স্বপ্ন থেকে - বাংলাদেশের মানুষদের জন্য খাঁটি ও বিশুদ্ধ খাদ্যপণ্য সহজলভ্য করা। আজকের বাজারে যেখানে ভেজাল ও রাসায়নিক মিশ্রিত খাবার সর্বত্র, সেখানে আমরা প্রকৃতির বিশুদ্ধতা আপনার কাছে পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ।
                  </p>
                  <p>
                    আমরা সরাসরি কৃষক ও উৎপাদকদের সাথে কাজ করি যারা প্রাকৃতিক পদ্ধতিতে চাষাবাদ করেন। প্রতিটি পণ্য যাচাই করে তবেই গ্রাহকদের কাছে পৌঁছায়।
                  </p>
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
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">আমাদের মূল্যবোধ</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: "বিশুদ্ধতা",
                  description: "১০০% খাঁটি ও অর্গানিক পণ্য, কোনো রাসায়নিক বা ভেজাল নেই",
                },
                {
                  icon: Users,
                  title: "বিশ্বস্ততা",
                  description: "গ্রাহকদের সাথে সৎ ও স্বচ্ছ সম্পর্ক বজায় রাখা",
                },
                {
                  icon: Target,
                  title: "গুণমান",
                  description: "প্রতিটি পণ্যে সর্বোচ্চ মান নিশ্চিত করা",
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
                { value: "৫০০০+", label: "সন্তুষ্ট গ্রাহক" },
                { value: "১০০+", label: "অর্গানিক পণ্য" },
                { value: "৫০+", label: "জেলায় ডেলিভারি" },
                { value: "৪.৯", label: "গ্রাহক রেটিং" },
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
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">কেন আমাদের বেছে নেবেন?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Leaf, title: "১০০% অর্গানিক", description: "সম্পূর্ণ প্রাকৃতিক ও জৈব পদ্ধতিতে উৎপাদিত" },
                { icon: Award, title: "মানের নিশ্চয়তা", description: "প্রতিটি পণ্য কঠোর মান নিয়ন্ত্রণের মধ্য দিয়ে যায়" },
                { icon: Truck, title: "দ্রুত ডেলিভারি", description: "সারাদেশে দ্রুত ও নিরাপদ ডেলিভারি" },
                { icon: Heart, title: "মানি ব্যাক গ্যারান্টি", description: "সন্তুষ্ট না হলে সম্পূর্ণ টাকা ফেরত" },
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