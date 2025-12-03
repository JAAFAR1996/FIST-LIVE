import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      setLocation("/admin");
    } catch (err: any) {
      setError(err.message || "فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">تسجيل دخول المسؤول</CardTitle>
          <CardDescription>
            أدخل بيانات اعتماد المسؤول للوصول إلى لوحة التحكم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="email"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="current-password"
                dir="ltr"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-lg h-12"
              disabled={isLoading}
            >
              {isLoading ? "جاري التحقق..." : "تسجيل الدخول"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <Shield className="w-3 h-3 inline ml-1" />
              هذه الصفحة محمية. فقط المسؤولون المصرح لهم يمكنهم الوصول.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
