import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Package, User, MapPin, LogOut, ChevronRight, Clock, Truck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Account = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoading, signOut, isAdmin } = useAuth();
  const { getItemCount } = useCart();

  // Demo orders data
  const orders = [
    {
      id: "1",
      order_number: "ORD-20240115-1234",
      created_at: "2024-01-15",
      order_status: "delivered",
      total_amount: 1850,
      items_count: 3,
    },
    {
      id: "2",
      order_number: "ORD-20240118-5678",
      created_at: "2024-01-18",
      order_status: "shipped",
      total_amount: 750,
      items_count: 1,
    },
    {
      id: "3",
      order_number: "ORD-20240120-9012",
      created_at: "2024-01-20",
      order_status: "processing",
      total_amount: 2200,
      items_count: 4,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: t("checkout.confirmation.statuses.pending"), variant: "outline" },
      confirmed: { label: t("checkout.confirmation.statuses.confirmed"), variant: "secondary" },
      processing: { label: t("checkout.confirmation.statuses.processing"), variant: "secondary" },
      shipped: { label: t("checkout.confirmation.statuses.shipped"), variant: "default" },
      delivered: { label: t("checkout.confirmation.statuses.delivered"), variant: "default" },
      cancelled: { label: t("checkout.tracking.cancelled_notice"), variant: "destructive" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatPrice = (price: number) => `৳${price.toLocaleString(i18n.language === "bn" ? "bn-BD" : "en-US")}`;

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("account.loading")}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={getItemCount()} />

      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {t("account.title")}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline">{t("account.admin_panel")}</Button>
              </Link>
            )}
          </div>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 mb-8">
              <TabsTrigger
                value="orders"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                <Package className="h-4 w-4 mr-2" />
                {t("account.tabs.orders")}
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                <User className="h-4 w-4 mr-2" />
                {t("account.tabs.profile")}
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {t("account.tabs.addresses")}
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {t("account.no_orders")}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {t("account.no_orders_desc")}
                  </p>
                  <Link to="/products">
                    <Button>{t("account.start_shopping")}</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-card rounded-xl p-4 md:p-6 border border-border hover:shadow-card transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            {getStatusIcon(order.order_status)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {order.order_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.created_at} • {t("account.items_count", { count: order.items_count })}
                            </p>
                            <div className="mt-2">
                              {getStatusBadge(order.order_status)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                          <p className="text-lg font-bold text-primary">
                            {formatPrice(order.total_amount)}
                          </p>
                          <Button variant="ghost" size="sm" className="gap-1">
                            {t("account.order_details")}
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="bg-card rounded-xl p-6 border border-border max-w-xl">
                <h2 className="text-lg font-bold text-foreground mb-6">
                  {t("account.profile_info")}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">{t("account.email")}</label>
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">{t("account.account_created")}</label>
                    <p className="font-medium text-foreground">
                      {i18n.language === "bn"
                        ? new Date(user.created_at).toLocaleDateString("bn-BD")
                        : new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      signOut();
                      navigate("/");
                    }}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("account.logout")}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <div className="bg-card rounded-xl p-6 border border-border max-w-xl">
                <h2 className="text-lg font-bold text-foreground mb-6">
                  {t("account.saved_addresses")}
                </h2>
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {t("account.no_addresses")}
                  </p>
                  <Button className="mt-4">{t("account.add_address")}</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
