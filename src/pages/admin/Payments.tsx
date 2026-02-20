import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, CreditCard, DollarSign, Clock, CheckCircle } from "lucide-react";

const AdminPayments = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_phone.includes(search);
    const matchesStatus =
      statusFilter === "all" || order.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0,
    paid: orders?.filter((o) => o.payment_status === "paid").reduce((sum, o) => sum + Number(o.total_amount), 0) || 0,
    unpaid: orders?.filter((o) => o.payment_status === "unpaid").reduce((sum, o) => sum + Number(o.total_amount), 0) || 0,
    partial: orders?.filter((o) => o.payment_status === "partial").reduce((sum, o) => sum + Number(o.partial_payment_amount || 0), 0) || 0,
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">পেইড</Badge>;
      case "partial":
        return <Badge className="bg-yellow-500">আংশিক</Badge>;
      case "unpaid":
        return <Badge variant="destructive">বকেয়া</Badge>;
      case "refunded":
        return <Badge variant="secondary">রিফান্ড</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cod":
        return "ক্যাশ অন ডেলিভারি";
      case "bkash":
        return "বিকাশ";
      case "nagad":
        return "নগদ";
      case "uddoktapay":
        return "অনলাইন পেমেন্ট";
      default:
        return method;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">পেমেন্ট</h1>
        <p className="text-muted-foreground">সব পেমেন্ট দেখুন ও পরিচালনা করুন</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট বিক্রয়</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.total.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">পেইড</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">৳{stats.paid.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">বকেয়া</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">৳{stats.unpaid.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">আংশিক পেমেন্ট</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">৳{stats.partial.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="অর্ডার নম্বর, নাম বা ফোন দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="স্ট্যাটাস" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
            <SelectItem value="paid">পেইড</SelectItem>
            <SelectItem value="unpaid">বকেয়া</SelectItem>
            <SelectItem value="partial">আংশিক</SelectItem>
            <SelectItem value="refunded">রিফান্ড</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>অর্ডার</TableHead>
                <TableHead>গ্রাহক</TableHead>
                <TableHead>পেমেন্ট মেথড</TableHead>
                <TableHead>মোট</TableHead>
                <TableHead>পেইড</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead>তারিখ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getPaymentMethodLabel(order.payment_method)}</TableCell>
                  <TableCell>৳{Number(order.total_amount).toLocaleString()}</TableCell>
                  <TableCell>
                    {order.payment_status === "paid" 
                      ? `৳${Number(order.total_amount).toLocaleString()}`
                      : order.payment_status === "partial"
                      ? `৳${Number(order.partial_payment_amount || 0).toLocaleString()}`
                      : "৳০"
                    }
                  </TableCell>
                  <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString("bn-BD")}
                  </TableCell>
                </TableRow>
              ))}
              {!filteredOrders?.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    কোন পেমেন্ট পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
