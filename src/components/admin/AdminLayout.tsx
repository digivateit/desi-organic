import { useState } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  MessageCircle,
  Tag,
  Truck,
  Settings,
  LogOut,
  Menu,
  X,
  Leaf,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  TrendingUp,
  FileText,
  CreditCard,
  PlusCircle,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MenuItem {
  icon: any;
  label: string;
  href: string;
}

interface MenuGroup {
  icon: any;
  label: string;
  href?: string;
  children: MenuItem[];
}

type MenuItemOrGroup = MenuItem | MenuGroup;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, signOut, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(["Orders", "Products"]);

  const menuStructure: MenuItemOrGroup[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    {
      icon: ShoppingCart,
      label: "Orders",
      href: "/admin/orders",
      children: [
        { icon: AlertCircle, label: "Incomplete Orders", href: "/admin/incomplete-orders" },
        { icon: TrendingUp, label: "Recovery Analytics", href: "/admin/recovery-analytics" },
        { icon: CreditCard, label: "Payments", href: "/admin/payments" },
        { icon: Users, label: "Customers", href: "/admin/customers" },
      ],
    },
    {
      icon: Package,
      label: "Products",
      href: "/admin/products",
      children: [
        { icon: PlusCircle, label: "Add New Product", href: "/admin/products/new" },
        { icon: FolderTree, label: "Categories", href: "/admin/categories" },
        { icon: Tag, label: "Coupons", href: "/admin/coupons" },
        { icon: Truck, label: "Delivery Zones", href: "/admin/delivery-zones" },
      ],
    },
    { icon: MessageCircle, label: "Live Chat", href: "/admin/chat" },
    {
      icon: FileText,
      label: "Content",
      href: "/admin/content",
      children: [
        { icon: Image, label: "Banners", href: "/admin/banners" },
      ],
    },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  // Auth check
  if (!user || !isAdmin) {
    navigate("/auth");
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  const isGroupActive = (group: MenuGroup) => {
    if (group.href && isActive(group.href)) return true;
    return group.children.some((child) => isActive(child.href));
  };

  const isMenuGroup = (item: MenuItemOrGroup): item is MenuGroup => {
    return "children" in item;
  };

  const renderMenuItem = (item: MenuItem, isChild = false) => (
    <Link
      key={item.href}
      to={item.href}
      onClick={() => setSidebarOpen(false)}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isChild && "ml-4 text-[13px]",
        isActive(item.href)
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-muted"
      )}
    >
      <item.icon className="h-4 w-4" />
      {item.label}
    </Link>
  );

  const renderMenuGroup = (group: MenuGroup) => {
    const isOpen = openGroups.includes(group.label);
    const groupActive = isGroupActive(group);

    return (
      <Collapsible
        key={group.label}
        open={isOpen}
        onOpenChange={() => toggleGroup(group.label)}
      >
        <div className="space-y-1">
          <div className="flex items-center">
            {group.href ? (
              <Link
                to={group.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(group.href)
                    ? "bg-primary text-primary-foreground"
                    : groupActive
                      ? "text-primary"
                      : "text-foreground hover:bg-muted"
                )}
              >
                <group.icon className="h-4 w-4" />
                {group.label}
              </Link>
            ) : (
              <div
                className={cn(
                  "flex-1 flex items-center gap-3 px-3 py-2 text-sm font-medium",
                  groupActive ? "text-primary" : "text-foreground"
                )}
              >
                <group.icon className="h-4 w-4" />
                {group.label}
              </div>
            )}
            <CollapsibleTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-lg">
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-1">
            {group.children.map((child) => renderMenuItem(child, true))}
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-muted rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-bold text-primary">Admin</span>
          </Link>
          <div className="w-10" />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-foreground/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border transform transition-transform lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <Link to="/admin" className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full gradient-organic flex items-center justify-center">
                    <Leaf className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-primary">Admin Panel</p>
                    <p className="text-xs text-muted-foreground">Organic Store</p>
                  </div>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-1 hover:bg-muted rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuStructure.map((item) =>
                isMenuGroup(item) ? renderMenuGroup(item) : renderMenuItem(item)
              )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border space-y-2">
              <Link to="/">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Back to Store
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:min-h-[calc(100vh)] p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
