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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: any;
}

export const CategoryDialog = ({ open, onOpenChange, category }: CategoryDialogProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    name_bn: "",
    slug: "",
    image_url: "",
    is_active: true,
  });

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        name_bn: category.name_bn || "",
        slug: category.slug || "",
        image_url: category.image_url || "",
        is_active: category.is_active ?? true,
      });
    } else {
      setForm({
        name: "",
        name_bn: "",
        slug: "",
        image_url: "",
        is_active: true,
      });
    }
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name: form.name,
      name_bn: form.name_bn,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      image_url: form.image_url || null,
      is_active: form.is_active,
    };

    try {
      if (category) {
        const { error } = await supabase.from("categories").update(data).eq("id", category.id);
        if (error) throw error;
        toast.success("Category updated");
      } else {
        const { error } = await supabase.from("categories").insert(data);
        if (error) throw error;
        toast.success("Category added");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
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
          <DialogTitle>{category ? "Edit Category" : "New Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name (English)</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Name (Bengali)</Label>
            <Input
              value={form.name_bn}
              onChange={(e) => setForm({ ...form, name_bn: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
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
              {loading ? "Saving..." : "Save Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
