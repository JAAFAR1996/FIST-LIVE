import { Product } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Minus } from "lucide-react";

interface ProductComparisonProps {
  products: Product[];
}

export function ProductComparison({ products }: ProductComparisonProps) {
  if (!products.length) return null;

  return (
    <div className="w-full overflow-x-auto border rounded-xl shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[200px] bg-muted/50 sticky left-0 z-10">المواصفات</TableHead>
            {products.map((product) => (
              <TableHead key={product.id} className="min-w-[200px] text-center">
                <div className="flex flex-col items-center gap-2 py-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-24 h-24 object-contain mix-blend-multiply dark:mix-blend-normal" 
                  />
                  <span className="font-bold text-foreground line-clamp-2 h-10">{product.name}</span>
                  <Button size="sm" variant="outline">إضافة</Button>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium bg-muted/50 sticky left-0 z-10">السعر</TableCell>
            {products.map((p) => (
              <TableCell key={p.id} className="text-center font-bold text-primary">
                {p.price.toLocaleString()} د.ع
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium bg-muted/50 sticky left-0 z-10">التقييم</TableCell>
            {products.map((p) => (
              <TableCell key={p.id} className="text-center">
                ⭐ {p.rating} ({p.reviewCount})
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium bg-muted/50 sticky left-0 z-10">العلامة التجارية</TableCell>
            {products.map((p) => (
              <TableCell key={p.id} className="text-center text-muted-foreground">
                {p.brand}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium bg-muted/50 sticky left-0 z-10">صديق للبيئة</TableCell>
            {products.map((p) => (
              <TableCell key={p.id} className="text-center">
                {p.ecoFriendly ? (
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                ) : (
                  <Minus className="w-5 h-5 text-muted-foreground mx-auto" />
                )}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium bg-muted/50 sticky left-0 z-10">المواصفات التقنية</TableCell>
            {products.map((p) => (
              <TableCell key={p.id} className="text-center text-xs text-muted-foreground">
                {p.specs}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
