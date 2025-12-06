import { ChevronLeft, Home } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground",
                className
            )}
        >
            <Link href="/">
                <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                    <Home className="w-4 h-4" />
                    <span className="sr-only">الرئيسية</span>
                </span>
            </Link>

            {items.map((item, index) => (
                <span key={index} className="flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4 text-muted-foreground/50" />
                    {item.href ? (
                        <Link href={item.href}>
                            <span className="hover:text-primary transition-colors cursor-pointer">
                                {item.label}
                            </span>
                        </Link>
                    ) : (
                        <span className="text-foreground font-medium">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
