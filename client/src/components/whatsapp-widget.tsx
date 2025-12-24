import { useState } from "react";
import { MessageCircle, X, Send, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "9647700000000"; // Replace with actual number
const DEFAULT_MESSAGE = "مرحباً! أريد الاستفسار عن المنتجات";

export function WhatsAppWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState(DEFAULT_MESSAGE);

    const handleSend = () => {
        const encodedMessage = encodeURIComponent(message);
        window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`,
            "_blank"
        );
        setIsOpen(false);
    };

    return (
        <>
            {/* Chat Panel */}
            <div
                className={cn(
                    "fixed bottom-24 left-4 z-50 w-80 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden transition-all duration-300",
                    isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <Phone className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">AQUAVO</h3>
                                <p className="text-xs text-white/80">متصل الآن • نرد خلال دقائق</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="p-4 bg-[#ECE5DD] dark:bg-gray-800">
                    {/* Welcome Message */}
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm max-w-[90%]">
                        <p className="text-sm">مرحباً! 👋</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            كيف يمكننا مساعدتك اليوم؟
                        </p>
                        <span className="text-[10px] text-muted-foreground mt-1 block text-left">
                            {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-3 bg-card border-t border-border">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="اكتب رسالتك..."
                            className="flex-1 px-4 py-2.5 rounded-full bg-muted text-sm border-none outline-none focus:ring-2 focus:ring-[#25D366]"
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#128C7E] flex items-center justify-center transition-colors shadow-lg"
                        >
                            <Send className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110",
                    isOpen
                        ? "bg-gray-600 hover:bg-gray-700"
                        : "bg-[#25D366] hover:bg-[#128C7E]"
                )}
                aria-label="تواصل معنا عبر واتساب"
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white" />
                )}

                {/* Pulse Animation */}
                {!isOpen && (
                    <>
                        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                            1
                        </span>
                    </>
                )}
            </button>

            {/* Tooltip */}
            {!isOpen && (
                <div className="fixed bottom-8 left-24 z-40 bg-card px-3 py-2 rounded-lg shadow-lg border border-border animate-in fade-in slide-in-from-left-2">
                    <p className="text-sm font-medium">هل تحتاج مساعدة؟ 💬</p>
                    <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-8 border-transparent border-r-card" />
                </div>
            )}
        </>
    );
}

export default WhatsAppWidget;
