import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import CategorySlider from "@/components/home/CategorySlider";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromotionalBanners from "@/components/home/PromotionalBanners";
import AllProducts from "@/components/home/AllProducts";
import CustomerReviews from "@/components/home/CustomerReviews";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Benefits from "@/components/home/Benefits";
import MoneyBackGuarantee from "@/components/home/MoneyBackGuarantee";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={0} />
      
      <main className="flex-1">
        <HeroBanner />
        <CategorySlider />
        <FeaturedProducts />
        <PromotionalBanners />
        <AllProducts />
        <CustomerReviews />
        <WhyChooseUs />
        <Benefits />
        <MoneyBackGuarantee />
      </main>

      <Footer />
    </div>
  );
};

export default Index;