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
import { Check, X, Minus, ShoppingCart } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { cn } from "@/lib/utils";

interface ProductComparisonProps {
  products: Product[];
}

export function ProductComparison({ products }: ProductComparisonProps) {
  if (!products.length) return null;

  return (
    <div className="w-full overflow-x-auto border rounded-xl shadow-lg bg-card/50 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b-2 border-primary/10">
            <TableHead className="w-[200px] bg-muted/50 sticky left-0 z-10 text-lg font-bold">المواصفات</TableHead>
            {products.map((product) => (
              <TableHead key={product.id} className="min-w-[240px] text-center align-bottom pb-6">
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="relative w-32 h-32 p-4 bg-background rounded-xl shadow-sm border">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" 
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="font-bold text-foreground line-clamp-2 h-12 text-lg leading-tight px-2">
                      {product.name}
                    </span>
                    <Button size="sm" className="w-full gap-2">
                      <ShoppingCart className="w-4 h-4" /> إضافة
                    </Button>
                  </div>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-muted/20">
            <TableCell className="font-bold bg-muted/30 sticky left-0 z-10">السعر</TableCell>
            {products.map((p) => (
              <TableCell key={p.id} className="text-center font-bold text-xl text-primary">
                {p.price.toLocaleString()} <span className="text-xs text-muted-foreground">د.ع</span>
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow className="hover:bg-muted/20">
            <TableCell className="font-bold bg-muted/30 sticky left-0 z-10">مستوى الصعوبة</TableCell>
            {products.map((p) => (
              <TableCell key={p.id} className="text-center">
                <div className="flex justify-center">
                  <DifficultyBadge level={p.difficulty} />
                </div>
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="hover:bg-muted/20">
            <TableCell className="font-bold bg-muted/30 sticky left-0 z-10">التقييم</TableCell>
            {products.map((p) => (
              <TableCell key={p.id} className="text-center">
                <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                  <span>★</span>
                  <span>{p.rating}</span>
                  <span className="text-muted-foreground font-normal text-xs">({p.reviewCount})</span>
                </div>
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="hover:bg-muted/20">
            <TableCell className="font-bold bg-muted/30 sticky left-0 z-10">العلامة التجارية</TableCell>
            {products.map((p) => (
              <TableCell key={p.id} className="text-center text-muted-foreground font-medium">
                {p.brand}
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="hover:bg-muted/20">
            <TableCell className="font-bold bg-muted/30 sticky left-0 z-10">صديق للبيئة</TableCell>
            {products.map((p) => (
              <TableCell key={p.id} className="text-center">
                {p.ecoFriendly ? (
                  <div className="flex items-center justify-center gap-1 text-green-600 bg-green-100 w-fit mx-auto px-2 py-1 rounded-full text-xs font-bold">
                    <Check className="w-4 h-4" /> نعم
                  </div>
                ) : (
                  <Minus className="w-5 h-5 text-muted-foreground mx-auto" />
                )}
              </TableCell>
            ))}
          </TableRow>
          
          <TableRow className="hover:bg-muted/20">
            <TableCell className="font-bold bg-muted/30 sticky left-0 z-10">المواصفات التقنية</TableCell>
            {products.map((p) => (
              <TableCell key={p.id} className="text-center text-sm text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                {p.specs}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
