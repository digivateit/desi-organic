import { useState } from "react";
import { Plus, Edit, Trash2, MoreHorizontal, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useCategories, useUpdateCategory, useDeleteCategory } from "@/hooks/useAdminData";
import { CategoryDialog } from "@/components/admin/dialogs/CategoryDialog";
import { Skeleton } from "@/components/ui/skeleton";

const AdminCategories = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: categories, isLoading } = useCategories();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleEdit = (category: any) => {
    setEditCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCategory.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleToggle = async (id: string, value: boolean) => {
    await updateCategory.mutateAsync({ id, is_active: value });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">Manage product categories ({categories?.length || 0})</p>
        </div>
        <Button className="gap-2" onClick={() => { setEditCategory(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-center">Products</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((cat: any) => (
              <TableRow key={cat.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {cat.image_url ? (
                        <img src={cat.image_url} alt={cat.name_bn} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <FolderTree className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <span className="font-medium">{cat.name_bn}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                <TableCell className="text-center">{cat.products?.[0]?.count || 0}</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={cat.is_active}
                    onCheckedChange={(v) => handleToggle(cat.id, v)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(cat)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(cat.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editCategory}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This category will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCategories;
