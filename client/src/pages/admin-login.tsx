import { useState, useEffect } from "react";
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
  const [blockCountdown, setBlockCountdown] = useState<number | null>(null);
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  // Countdown timer effect
  useEffect(() => {
    if (blockCountdown && blockCountdown > 0) {
      const timer = setInterval(() => {
        setBlockCountdown(prev => {
          if (prev && prev > 1) return prev - 1;
          setError("");
          return null;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [blockCountdown]);

  // Format seconds to MM:SS
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      setLocation("/admin");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.";
      setError(message);
      // Check for IP blocking countdown
      if (err && typeof err === 'object' && 'retryAfter' in err) {
        setBlockCountdown((err as any).retryAfter);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-dotted-pattern opacity-5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="w-full shadow-2xl border-primary/20 bg-card/50 backdrop-blur-xl">
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
                  <AlertDescription>
                    {error}
                    {blockCountdown && blockCountdown > 0 && (
                      <div className="mt-2 font-bold text-lg">
                        ⏳ يمكنك المحاولة مرة أخرى خلال {formatCountdown(blockCountdown)}
                      </div>
                    )}
                  </AlertDescription>
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
                disabled={isLoading || (blockCountdown !== null && blockCountdown > 0)}
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
    </div>
  );
}
