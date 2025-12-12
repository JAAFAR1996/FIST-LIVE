import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function SettingsManagement() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast({ title: "تم حفظ الإعدادات بنجاح" });
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-6 w-6" />
                        إعدادات المتجر العامة
                    </CardTitle>
                    <CardDescription>تكوين إعدادات الموقع الأساسية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>اسم المتجر</Label>
                            <Input defaultValue="FishWeb IQ" />
                        </div>
                        <div className="space-y-2">
                            <Label>البريد الإلكتروني للدعم</Label>
                            <Input defaultValue="support@fishweb.iq" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label>وضع الصيانة</Label>
                            <p className="text-sm text-muted-foreground">تفعيل صفحة "قريباً" وإيقاف الموقع للزوار</p>
                        </div>
                        <Switch />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label>تفعيل الطلبات</Label>
                            <p className="text-sm text-muted-foreground">السماح للعملاء بإنشاء طلبات جديدة</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading} size="lg">
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التغييرات
                </Button>
            </div>
        </div>
    );
}
