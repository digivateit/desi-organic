import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Phone, MapPin, Clock, Eye, Trash2, RefreshCw, ArrowRightLeft, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from "date-fns";
import { bn, enUS } from "date-fns/locale";
import { OrderDialog } from "@/components/admin/dialogs/OrderDialog";

interface CartItem {
  productId: string;
  name_bn: string;
  quantity: number;
  price: number;
  variant_name_bn?: string;
}

interface IncompleteOrder {
  id: string;
  session_id: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_area: string | null;
  delivery_zone_id: string | null;
  cart_data: CartItem[] | null;
  last_updated_at: string;
  created_at: string;
  is_converted: boolean;
  converted_order_id: string | null;
}

interface RecoveryStats {
  total: number;
  converted: number;
  pending: number;
  conversionRate: number;
  recoveredRevenue: number;
  potentialRevenue: number;
}

const AdminIncompleteOrders = () => {
  const [orders, setOrders] = useState<IncompleteOrder[]>([]);
  const [allOrders, setAllOrders] = useState<IncompleteOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IncompleteOrder | null>(null);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [orderToConvert, setOrderToConvert] = useState<IncompleteOrder | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);

    // Fetch all incomplete orders for stats
    const { data: allData, error: allError } = await supabase
      .from("incomplete_orders")
      .select("*")
      .order("last_updated_at", { ascending: false });

    if (allError) {
      toast({ title: "Failed to load data", variant: "destructive" });
    } else {
      setAllOrders((allData as unknown as IncompleteOrder[]) || []);
      // Filter out converted orders for display
      setOrders((allData as unknown as IncompleteOrder[])?.filter(o => !o.is_converted) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("incomplete-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "incomplete_orders" },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteOrder = async (id: string) => {
    const { error } = await supabase.from("incomplete_orders").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to delete", variant: "destructive" });
    } else {
      toast({ title: "Deleted successfully" });
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setAllOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const formatPrice = (price: number) => `৳${price.toLocaleString("en-US")}`;

  const getCartTotal = (cartData: CartItem[] | null) => {
    if (!cartData || cartData.length === 0) return 0;
    return cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getCompletionPercentage = (order: IncompleteOrder) => {
    const fields = [
      order.customer_name,
      order.customer_phone,
      order.shipping_address,
      order.shipping_city,
      order.cart_data && order.cart_data.length > 0,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  // Calculate recovery stats
  const recoveryStats: RecoveryStats = {
    total: allOrders.length,
    converted: allOrders.filter(o => o.is_converted).length,
    pending: allOrders.filter(o => !o.is_converted).length,
    conversionRate: allOrders.length > 0
      ? Math.round((allOrders.filter(o => o.is_converted).length / allOrders.length) * 100)
      : 0,
    recoveredRevenue: allOrders
      .filter(o => o.is_converted)
      .reduce((sum, o) => sum + getCartTotal(o.cart_data), 0),
    potentialRevenue: allOrders
      .filter(o => !o.is_converted)
      .reduce((sum, o) => sum + getCartTotal(o.cart_data), 0),
  };

  const handleConvertToOrder = (order: IncompleteOrder) => {
    setOrderToConvert(order);
    setConvertDialogOpen(true);
  };

  const handleOrderDialogClose = (open: boolean) => {
    setConvertDialogOpen(open);
    if (!open) {
      setOrderToConvert(null);
    }
  };

  // Called when an order is successfully converted
  const handleOrderConverted = useCallback((incompleteOrderId: string, newOrderId: string) => {
    // Optimistically remove from the orders list
    setOrders(prev => prev.filter(o => o.id !== incompleteOrderId));

    // Update allOrders to reflect the conversion for stats
    setAllOrders(prev => prev.map(o =>
      o.id === incompleteOrderId
        ? { ...o, is_converted: true, converted_order_id: newOrderId }
        : o
    ));

    toast({
      title: "Order successfully converted",
      description: "You can view it in the order list",
    });

    // Close dialog
    setConvertDialogOpen(false);
    setOrderToConvert(null);
  }, [toast]);

  // Create pre-filled order data for conversion
  const getConversionOrderData = (incompleteOrder: IncompleteOrder) => {
    if (!incompleteOrder) return null;

    // Transform cart_data to order items format
    const orderItems = incompleteOrder.cart_data?.map(item => ({
      product_id: item.productId,
      product_name: item.name_bn,
      variant_name: item.variant_name_bn || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    })) || [];

    return {
      customer_name: incompleteOrder.customer_name || "",
      customer_phone: incompleteOrder.customer_phone || "",
      customer_email: incompleteOrder.customer_email || "",
      shipping_address: incompleteOrder.shipping_address || "",
      shipping_city: incompleteOrder.shipping_city || "",
      shipping_area: incompleteOrder.shipping_area || "",
      delivery_zone_id: incompleteOrder.delivery_zone_id,
      order_items: orderItems,
      subtotal: getCartTotal(incompleteOrder.cart_data),
      // Will be set to mark as converted after order creation
      _incomplete_order_id: incompleteOrder.id,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Incomplete Orders</h1>
          <p className="text-muted-foreground">
            Real-time checkout tracking & recovery
          </p>
        </div>
        <Button variant="outline" onClick={fetchOrders} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards - Recovery Report */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{recoveryStats.pending}</p>
                <p className="text-sm text-muted-foreground">Incomplete Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{recoveryStats.converted}</p>
                <p className="text-sm text-muted-foreground">Converted Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{recoveryStats.conversionRate}%</p>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatPrice(recoveryStats.recoveredRevenue)}</p>
                <p className="text-sm text-muted-foreground">Recovered Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Potential Revenue Card */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Potential Revenue (Incomplete)</p>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{formatPrice(recoveryStats.potentialRevenue)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Has phone number</p>
              <p className="text-lg font-semibold">{orders.filter(o => o.customer_phone).length} items</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Incomplete Checkout List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No incomplete orders found
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Cart Value</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <span className="font-medium">
                          {order.customer_name || "—"}
                        </span>
                        {order.customer_email && (
                          <p className="text-xs text-muted-foreground">
                            {order.customer_email}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.customer_phone ? (
                          <a
                            href={`tel:${order.customer_phone}`}
                            className="text-primary hover:underline"
                          >
                            {order.customer_phone}
                          </a>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate">
                          {order.shipping_address || order.shipping_city || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.cart_data && order.cart_data.length > 0 ? (
                          <div>
                            <span className="font-medium">
                              {formatPrice(getCartTotal(order.cart_data))}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {order.cart_data.length} items
                            </p>
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            getCompletionPercentage(order) > 60
                              ? "default"
                              : "secondary"
                          }
                        >
                          {getCompletionPercentage(order)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(order.last_updated_at), {
                            addSuffix: true,
                            locale: enUS,
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Convert to Order Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => handleConvertToOrder(order)}
                            title="Convert to Order"
                          >
                            <ArrowRightLeft className="h-4 w-4" />
                            Order
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This incomplete order will be deleted.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>No</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteOrder(order.id)}>
                                  Yes, delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Incomplete Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedOrder.customer_name || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedOrder.customer_phone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedOrder.customer_email || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium">{selectedOrder.shipping_city || "—"}</p>
                </div>
              </div>

              {selectedOrder.shipping_address && (
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedOrder.shipping_address}</p>
                </div>
              )}

              {selectedOrder.cart_data && selectedOrder.cart_data.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Cart Items</p>
                  <div className="space-y-2">
                    {selectedOrder.cart_data.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{item.name_bn}</p>
                          {item.variant_name_bn && (
                            <p className="text-xs text-muted-foreground">
                              {item.variant_name_bn}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} x {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-primary">
                        {formatPrice(getCartTotal(selectedOrder.cart_data))}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-xs text-muted-foreground">
                  Last updated:{" "}
                  {format(new Date(selectedOrder.last_updated_at), "dd MMM yyyy, hh:mm a", {
                    locale: enUS,
                  })}
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedOrder(null);
                    handleConvertToOrder(selectedOrder);
                  }}
                  className="gap-1"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Convert to Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Conversion Dialog */}
      <OrderDialog
        open={convertDialogOpen}
        onOpenChange={handleOrderDialogClose}
        prefilledData={orderToConvert ? getConversionOrderData(orderToConvert) : undefined}
        incompleteOrderId={orderToConvert?.id}
        onConverted={handleOrderConverted}
      />
    </div>
  );
};

export default AdminIncompleteOrders;