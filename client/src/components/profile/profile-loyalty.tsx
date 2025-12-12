import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Crown, Star } from "lucide-react";

export const tierLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    bronze: { label: "برونزي", color: "text-amber-700", icon: <Star className="w-4 h-4" /> },
    silver: { label: "فضي", color: "text-slate-500", icon: <Star className="w-4 h-4" /> },
    gold: { label: "ذهبي", color: "text-yellow-500", icon: <Crown className="w-4 h-4" /> },
    platinum: { label: "بلاتيني", color: "text-purple-500", icon: <Crown className="w-4 h-4" /> },
};

interface ProfileLoyaltyProps {
    loyaltyPoints: number;
    loyaltyTier: string;
}

export function ProfileLoyalty({ loyaltyPoints, loyaltyTier }: ProfileLoyaltyProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    برنامج الولاء
                </CardTitle>
                <CardDescription>اجمع النقاط واحصل على خصومات حصرية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Points Progress */}
                <div className="bg-gradient-to-br from-primary/10 to-cyan-500/10 rounded-xl p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">رصيد نقاطك</p>
                    <p className="text-5xl font-bold text-primary mb-4">{loyaltyPoints}</p>
                    <p className="text-sm text-muted-foreground">
                        تحتاج <strong>50</strong> نقطة إضافية للترقية إلى المستوى الذهبي
                    </p>
                    <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-cyan-500"
                            style={{ width: `${(loyaltyPoints / 500) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Tiers */}
                <div className="grid grid-cols-4 gap-4">
                    {Object.entries(tierLabels).map(([key, tier], index) => (
                        <div
                            key={key}
                            className={`text-center p-4 rounded-lg ${key === loyaltyTier
                                ? "bg-primary/10 border-2 border-primary"
                                : "bg-muted/50"
                                }`}
                        >
                            <div className={`text-2xl mb-2 ${tier.color}`}>{tier.icon}</div>
                            <p className="font-medium text-sm">{tier.label}</p>
                            <p className="text-xs text-muted-foreground">{(index + 1) * 250} نقطة</p>
                        </div>
                    ))}
                </div>

                {/* How to earn */}
                <div className="bg-muted/50 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">كيف تجمع النقاط؟</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>كل 1,000 د.ع = 10 نقاط</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>تقييم منتج = 5 نقاط</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>دعوة صديق = 50 نقطة</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
