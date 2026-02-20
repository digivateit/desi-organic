import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface CouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: any;
}

export const CouponDialog = ({ open, onOpenChange, coupon }: CouponDialogProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_amount: "",
    max_discount: "",
    usage_limit: "",
    valid_until: "",
    is_active: true,
  });

  useEffect(() => {
    if (coupon) {
      setForm({
        code: coupon.code || "",
        discount_type: coupon.discount_type || "percentage",
        discount_value: coupon.discount_value?.toString() || "",
        min_order_amount: coupon.min_order_amount?.toString() || "",
        max_discount: coupon.max_discount?.toString() || "",
        usage_limit: coupon.usage_limit?.toString() || "",
        valid_until: coupon.valid_until ? new Date(coupon.valid_until).toISOString().split("T")[0] : "",
        is_active: coupon.is_active ?? true,
      });
    } else {
      setForm({
        code: "",
        discount_type: "percentage",
        discount_value: "",
        min_order_amount: "",
        max_discount: "",
        usage_limit: "",
        valid_until: "",
        is_active: true,
      });
    }
  }, [coupon, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : 0,
      max_discount: form.max_discount ? parseFloat(form.max_discount) : null,
      usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
      valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : null,
      is_active: form.is_active,
    };

    try {
      if (coupon) {
        const { error } = await supabase.from("coupons").update(data).eq("id", coupon.id);
        if (error) throw error;
        toast.success("Coupon updated");
      } else {
        const { error } = await supabase.from("coupons").insert(data);
        if (error) throw error;
        toast.success("Coupon added");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      onOpenChange(false);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit Coupon" : "New Coupon"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Coupon Code</Label>
            <Input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select value={form.discount_type} onValueChange={(v) => setForm({ ...form, discount_type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Discount Value</Label>
              <Input
                type="number"
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Minimum Order (৳)</Label>
              <Input
                type="number"
                value={form.min_order_amount}
                onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum Discount (৳)</Label>
              <Input
                type="number"
                value={form.max_discount}
                onChange={(e) => setForm({ ...form, max_discount: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Usage Limit</Label>
              <Input
                type="number"
                value={form.usage_limit}
                onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Valid Until</Label>
              <Input
                type="date"
                value={form.valid_until}
                onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => setForm({ ...form, is_active: v })}
            />
            <Label>Active</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Coupon"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
