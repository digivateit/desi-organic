import { Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MoneyBackGuarantee = () => {
  return (
    <section className="py-10 md:py-14">
      <div className="container">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-moss to-primary p-8 md:p-12 shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.5)]">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/20 translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10 text-primary-foreground">
            {/* Icon */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-12 h-12 md:w-16 md:h-16" />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                ১০০% মানি ব্যাক গ্যারান্টি
              </h2>
              <p className="text-lg opacity-90 mb-6 max-w-xl">
                পণ্যের মানে সন্তুষ্ট না হলে আমরা আপনার সম্পূর্ণ টাকা ফেরত দেব। 
                কোনো প্রশ্ন করা হবে না, কোনো ঝামেলা নেই।
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/products">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 shadow-lg"
                  >
                    এখনই কেনাকাটা করুন
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/return-policy">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-primary-foreground hover:bg-white/10 bg-transparent"
                  >
                    রিটার্ন পলিসি দেখুন
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoneyBackGuarantee;
