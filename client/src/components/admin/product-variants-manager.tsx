/**
 * Product Variants Manager Component
 * Allows admin to add, edit, and delete product variants with images
 */
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Image as ImageIcon, Save, X } from "lucide-react";
import type { ProductVariant } from "@/types";

interface ProductVariantsManagerProps {
  productId: string;
  productName: string;
  variants: ProductVariant[] | null;
  hasVariants: boolean;
  onUpdate: () => void;
}

export function ProductVariantsManager({
  productId,
  productName,
  variants: initialVariants,
  hasVariants: initialHasVariants,
  onUpdate,
}: ProductVariantsManagerProps) {
  const { toast } = useToast();
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants || []);
  const [hasVariants, setHasVariants] = useState(initialHasVariants);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for variant editor
  const [formData, setFormData] = useState<Partial<ProductVariant>>({
    id: "",
    label: "",
    price: 0,
    originalPrice: undefined,
    stock: 0,
    isDefault: false,
    image: "",
    specifications: {},
  });

  const handleAddVariant = () => {
    setEditingVariant(null);
    setFormData({
      id: "",
      label: "",
      price: 0,
      originalPrice: undefined,
      stock: 0,
      isDefault: false,
      image: "",
      specifications: {},
    });
    setIsDialogOpen(true);
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setFormData(variant);
    setIsDialogOpen(true);
  };

  const handleDeleteVariant = (variantId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الخيار؟")) return;

    const newVariants = variants.filter((v) => v.id !== variantId);
    setVariants(newVariants);
  };

  const handleSaveVariant = () => {
    if (!formData.id || !formData.label || !formData.price) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const newVariant: ProductVariant = {
      id: formData.id,
      label: formData.label,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stock: Number(formData.stock || 0),
      isDefault: formData.isDefault || false,
      image: formData.image,
      specifications: formData.specifications || {},
    };

    if (editingVariant) {
      // Update existing variant
      const newVariants = variants.map((v) =>
        v.id === editingVariant.id ? newVariant : v
      );
      setVariants(newVariants);
    } else {
      // Add new variant
      setVariants([...variants, newVariant]);
    }

    setIsDialogOpen(false);
    toast({
      title: "نجح",
      description: editingVariant ? "تم تحديث الخيار" : "تم إضافة الخيار",
    });
  };

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/products/${productId}/variants`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hasVariants: variants.length > 0,
          variants: variants.length > 0 ? variants : null,
        }),
      });

      if (!response.ok) throw new Error("فشل في حفظ الخيارات");

      toast({
        title: "نجح! ✅",
        description: "تم حفظ الخيارات بنجاح",
      });

      onUpdate();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الخيارات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVariants = () => {
    if (hasVariants && variants.length > 0) {
      if (!confirm("هل أنت متأكد من تعطيل جميع الخيارات؟")) return;
      setVariants([]);
    }
    setHasVariants(!hasVariants);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>خيارات المنتج (Variants)</CardTitle>
            <CardDescription>
              {productName} - إدارة الأحجام والألوان والخيارات المختلفة
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={hasVariants}
              onCheckedChange={handleToggleVariants}
              id="has-variants"
            />
            <Label htmlFor="has-variants" className="cursor-pointer">
              تفعيل الخيارات
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {hasVariants && (
          <>
            <div className="flex justify-between items-center mb-4">
              <Button onClick={handleAddVariant} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                إضافة خيار جديد
              </Button>
              <Button
                onClick={handleSaveToDatabase}
                disabled={isSaving}
                variant="default"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>

            {variants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>لا توجد خيارات بعد. اضغط "إضافة خيار جديد" للبدء.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>التسمية</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>المخزون</TableHead>
                    <TableHead>الصورة</TableHead>
                    <TableHead>افتراضي</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {variant.id}
                        </code>
                      </TableCell>
                      <TableCell className="font-medium">{variant.label}</TableCell>
                      <TableCell>
                        {variant.price.toLocaleString()} د.ع
                        {variant.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through mr-2">
                            {variant.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={variant.stock > 0 ? "default" : "destructive"}>
                          {variant.stock} قطعة
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {variant.image ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={variant.image}
                              alt={variant.label}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <ImageIcon className="w-4 h-4 text-green-500" />
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            لا توجد صورة
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {variant.isDefault && (
                          <Badge variant="secondary">افتراضي</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditVariant(variant)}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteVariant(variant.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}

        {!hasVariants && (
          <div className="text-center py-8 text-muted-foreground">
            <p>الخيارات معطلة. فعّل الخيارات لإضافة أحجام وألوان مختلفة.</p>
          </div>
        )}

        {/* Variant Editor Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVariant ? "تعديل الخيار" : "إضافة خيار جديد"}
              </DialogTitle>
              <DialogDescription>
                أدخل تفاصيل الخيار (مثل: الحجم، اللون، القدرة)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4" dir="rtl">
              {/* ID */}
              <div>
                <Label htmlFor="variant-id">
                  ID الخيار <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="variant-id"
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                  placeholder="مثال: 5g-green, M, 18W"
                  disabled={!!editingVariant}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  معرف فريد للخيار (بالإنجليزية فقط)
                </p>
              </div>

              {/* Label */}
              <div>
                <Label htmlFor="variant-label">
                  التسمية (العرض) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="variant-label"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="مثال: 5 جرام - أخضر"
                />
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="variant-price">
                    السعر (د.ع) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="variant-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="variant-original-price">
                    السعر الأصلي (اختياري)
                  </Label>
                  <Input
                    id="variant-original-price"
                    type="number"
                    value={formData.originalPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <Label htmlFor="variant-stock">المخزون</Label>
                <Input
                  id="variant-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                />
              </div>

              {/* Image */}
              <div>
                <Label htmlFor="variant-image">رابط الصورة (اختياري)</Label>
                <Input
                  id="variant-image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="/images/products/..."
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="معاينة"
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  انسخ رابط الصورة من صور المنتج الأساسية
                </p>
              </div>

              {/* Is Default */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="variant-default"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isDefault: !!checked })
                  }
                />
                <Label htmlFor="variant-default" className="cursor-pointer">
                  جعل هذا الخيار افتراضياً (الأكثر شعبية)
                </Label>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                إلغاء
              </Button>
              <Button onClick={handleSaveVariant}>
                <Save className="w-4 h-4 mr-2" />
                حفظ الخيار
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
