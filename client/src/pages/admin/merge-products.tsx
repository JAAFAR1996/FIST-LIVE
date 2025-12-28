import { ProductMerger } from "@/components/admin/product-merger";

export default function MergeProductsPage() {
    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">دمج المنتجات</h1>
                <p className="text-muted-foreground mt-2">
                    قم بدمج المنتجات المكررة لنقل الصور وتنظيف قاعدة البيانات
                </p>
            </div>

            <ProductMerger />
        </div>
    );
}
