import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppWidgetProps {
    phoneNumber?: string;
    message?: string;
    className?: string;
}

export function WhatsAppWidget({
    phoneNumber = "9647700000000",
    message = "مرحباً، عندي استفسار عن المنتجات",
    className,
}: WhatsAppWidgetProps) {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "fixed bottom-6 left-6 z-50",
                "bg-green-500 hover:bg-green-600",
                "text-white p-4 rounded-full",
                "shadow-2xl hover:shadow-green-500/25",
                "transition-all duration-300 hover:scale-110",
                "animate-pulse hover:animate-none",
                "group",
                className
            )}
            aria-label="تواصل معنا عبر واتساب"
        >
            <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />

            {/* Tooltip */}
            <span className="absolute left-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                تواصل معنا الآن!
            </span>

            {/* Ping animation ring */}
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-25" />
        </a>
    );
}
