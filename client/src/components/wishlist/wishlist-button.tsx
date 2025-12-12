import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { HeartFloatAnimation } from "./heart-float-animation";

interface WishlistButtonProps {
  product: Product;
  variant?: "icon" | "default";
  size?: "sm" | "default" | "lg" | "icon";
  className?: string;
  showBadge?: boolean;
}

export function WishlistButton({
  product,
  variant = "icon",
  size = "icon",
  className,
  showBadge = false,
}: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist, totalItems } = useWishlist();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeItem(product.id);
      toast({
        title: "انحذف 💔",
        description: "الجمبري زعلان منك... بس عادي!",
        variant: "default",
      });
    } else {
      addItem(product);
      setTriggerAnimation(true);
      toast({
        title: "انضاف للمفضلة 💖",
        description: "ولا يهمك، الجمبري حارس عليه 😉",
      });
    }
  };

  if (variant === "default") {
    return (
      <>
        <HeartFloatAnimation trigger={triggerAnimation} onComplete={() => setTriggerAnimation(false)} />
        <Button
          variant={inWishlist ? "default" : "secondary"}
          size={size}
          className={cn(
            "gap-2 transition-all",
            inWishlist && "bg-red-500 hover:bg-red-600 text-white",
            className
          )}
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? `إزالة ${product.name} من المفضلة` : `إضافة ${product.name} للمفضلة`}
        >
          <Heart
            className={cn("w-4 h-4 transition-all", inWishlist && "fill-current")}
            aria-hidden="true"
          />
          {inWishlist ? "إزالة من المفضلة" : "أضف للمفضلة"}
        </Button>
      </>
    );
  }

  return (
    <>
      <HeartFloatAnimation trigger={triggerAnimation} onComplete={() => setTriggerAnimation(false)} />
      <Button
        size={size}
        variant="secondary"
        className={cn(
          "rounded-full relative transition-all",
          inWishlist
            ? "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            : "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30",
          className
        )}
        onClick={handleToggleWishlist}
        aria-label={inWishlist ? `إزالة ${product.name} من المفضلة` : `إضافة ${product.name} للمفضلة`}
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-all",
            inWishlist && "fill-current scale-110"
          )}
          aria-hidden="true"
        />
        {showBadge && totalItems > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
            aria-label={`${totalItems} منتج في المفضلة`}
          >
            {totalItems}
          </span>
        )}
      </Button>
    </>
  );
}
