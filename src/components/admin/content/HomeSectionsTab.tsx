import { useState } from "react";
import { Save, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useHomepageSections, useUpdateHomepageSection, useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from "@/hooks/useCMSData";
import TestimonialDialog from "../dialogs/TestimonialDialog";
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

const HomeSectionsTab = () => {
  const { data: sections, isLoading: sectionsLoading } = useHomepageSections();
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials();
  const updateSection = useUpdateHomepageSection();
  const deleteTestimonial = useDeleteTestimonial();
  
  const [editedSections, setEditedSections] = useState<Record<string, any>>({});
  const [testimonialDialog, setTestimonialDialog] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getSection = (key: string) => {
    if (editedSections[key]) return editedSections[key];
    return sections?.find((s) => s.section_key === key);
  };

  const setSection = (key: string, updates: any) => {
    const current = getSection(key) || {};
    setEditedSections((prev) => ({ ...prev, [key]: { ...current, ...updates } }));
  };

  const saveSection = (key: string) => {
    const section = editedSections[key];
    if (section) {
      updateSection.mutate({ sectionKey: key, ...section });
    }
  };

  if (sectionsLoading || testimonialsLoading) {
    return <div className="text-center py-8">লোড হচ্ছে...</div>;
  }

  const whyChooseUs = getSection("why_choose_us");
  const moneyBack = getSection("money_back_guarantee");
  const orderConfirm = getSection("order_confirmation");

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="space-y-4">
        {/* Customer Reviews */}
        <AccordionItem value="reviews" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="font-medium">কাস্টমার রিভিউ ({testimonials?.length || 0})</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div className="grid gap-4">
                {testimonials?.map((t) => (
                  <Card key={t.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{t.customer_name}</span>
                            <span className="text-yellow-500">{"★".repeat(t.rating)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{t.comment}</p>
                          {t.product_name && (
                            <p className="text-xs text-muted-foreground mt-1">পণ্য: {t.product_name}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditTestimonial(t); setTestimonialDialog(true); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => setDeleteId(t.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => { setEditTestimonial(null); setTestimonialDialog(true); }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                নতুন রিভিউ যোগ করুন
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Why Choose Us / Others vs Us */}
        <AccordionItem value="comparison" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="font-medium">অন্যরা বনাম আমরা</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>শিরোনাম</Label>
                <Input
                  value={whyChooseUs?.title_bn || ""}
                  onChange={(e) => setSection("why_choose_us", { title_bn: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label>তুলনা তালিকা</Label>
                {(whyChooseUs?.content || []).map((item: any, idx: number) => (
                  <Card key={idx}>
                    <CardContent className="p-3 grid grid-cols-3 gap-2">
                      <Input
                        placeholder="বিষয়"
                        value={item.feature || ""}
                        onChange={(e) => {
                          const content = [...(whyChooseUs?.content || [])];
                          content[idx] = { ...content[idx], feature: e.target.value };
                          setSection("why_choose_us", { content });
                        }}
                      />
                      <Input
                        placeholder="অন্যরা"
                        value={item.others || ""}
                        onChange={(e) => {
                          const content = [...(whyChooseUs?.content || [])];
                          content[idx] = { ...content[idx], others: e.target.value };
                          setSection("why_choose_us", { content });
                        }}
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="আমরা"
                          value={item.us || ""}
                          onChange={(e) => {
                            const content = [...(whyChooseUs?.content || [])];
                            content[idx] = { ...content[idx], us: e.target.value };
                            setSection("why_choose_us", { content });
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive shrink-0"
                          onClick={() => {
                            const content = [...(whyChooseUs?.content || [])];
                            content.splice(idx, 1);
                            setSection("why_choose_us", { content });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const content = [...(whyChooseUs?.content || []), { feature: "", others: "", us: "" }];
                    setSection("why_choose_us", { content });
                  }}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  সারি যোগ করুন
                </Button>
                <Button onClick={() => saveSection("why_choose_us")} className="gap-2">
                  <Save className="h-4 w-4" />
                  সংরক্ষণ
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Money Back Guarantee */}
        <AccordionItem value="moneyback" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="font-medium">মানি ব্যাক গ্যারান্টি</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>শিরোনাম</Label>
                <Input
                  value={moneyBack?.title_bn || ""}
                  onChange={(e) => setSection("money_back_guarantee", { title_bn: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>বিবরণ</Label>
                <Textarea
                  value={(moneyBack?.content as any)?.description || ""}
                  onChange={(e) => setSection("money_back_guarantee", { 
                    content: { ...(moneyBack?.content || {}), description: e.target.value } 
                  })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>বাটন টেক্সট</Label>
                  <Input
                    value={(moneyBack?.content as any)?.cta_text || ""}
                    onChange={(e) => setSection("money_back_guarantee", { 
                      content: { ...(moneyBack?.content || {}), cta_text: e.target.value } 
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>বাটন লিংক</Label>
                  <Input
                    value={(moneyBack?.content as any)?.cta_link || ""}
                    onChange={(e) => setSection("money_back_guarantee", { 
                      content: { ...(moneyBack?.content || {}), cta_link: e.target.value } 
                    })}
                  />
                </div>
              </div>
              <Button onClick={() => saveSection("money_back_guarantee")} className="gap-2">
                <Save className="h-4 w-4" />
                সংরক্ষণ
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Order Confirmation */}
        <AccordionItem value="orderconfirm" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="font-medium">অর্ডার কনফার্মেশন নোট</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>ধন্যবাদ মেসেজ</Label>
                <Input
                  value={(orderConfirm?.content as any)?.thank_you_message || ""}
                  onChange={(e) => setSection("order_confirmation", { 
                    content: { ...(orderConfirm?.content || {}), thank_you_message: e.target.value } 
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label>নোট</Label>
                <Textarea
                  value={(orderConfirm?.content as any)?.note || ""}
                  onChange={(e) => setSection("order_confirmation", { 
                    content: { ...(orderConfirm?.content || {}), note: e.target.value } 
                  })}
                  rows={3}
                />
              </div>
              <Button onClick={() => saveSection("order_confirmation")} className="gap-2">
                <Save className="h-4 w-4" />
                সংরক্ষণ
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <TestimonialDialog
        open={testimonialDialog}
        onOpenChange={setTestimonialDialog}
        testimonial={editTestimonial}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>রিভিউ মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription>
              এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) deleteTestimonial.mutate(deleteId);
                setDeleteId(null);
              }}
            >
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HomeSectionsTab;
