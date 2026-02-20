import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, Phone, Leaf, PackageSearch, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  cartCount?: number;
}

const Header = ({ cartCount = 0 }: HeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.shop"), href: "/shop" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.contact"), href: "/contact" },
    { name: t("nav.track_order"), href: "/track-order", icon: PackageSearch },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      {/* Contact bar */}
      <div className="hidden md:block bg-muted/50 border-b border-border">
        <div className="container flex items-center justify-between py-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <a href="tel:+8801XXXXXXXXX" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Phone className="h-3.5 w-3.5" />
              <span>+880 1XXX-XXXXXX</span>
            </a>
          </div>
          <p className="text-xs">{t("header.working_hours")}</p>
        </div>
      </div>

      {/* Main header */}
      <div className="container">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-primary">
                  <Leaf className="h-5 w-5" />
                  {t("header.store_name")}
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-full gradient-organic flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-primary leading-tight">{t("header.store_name")}</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">{t("header.store_tagline")}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2">
            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
              <Input
                type="search"
                placeholder={t("header.search_placeholder")}
                className="w-48 xl:w-64 pr-10 bg-muted/50 border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3">
                <Search className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              </button>
            </form>

            {/* Search - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="lg:hidden pb-4 animate-slide-in-up">
            <div className="relative">
              <Input
                type="search"
                placeholder={t("header.search_placeholder")}
                className="w-full pr-10 bg-muted/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              </button>
            </div>
          </form>
        )}
      </div>
    </header >
  );
};

export default Header;
