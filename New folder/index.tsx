import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { Upload, Image as ImageIcon, Download, Sparkles, Loader2, RefreshCw, X, Crown, Zap, AlertCircle, LogOut, User } from 'lucide-react';

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
// Important: These scopes allow access to Gemini API via OAuth
const SCOPES = 'openid email profile';

interface GoogleUser {
  accessToken: string;
  email: string;
  name: string;
  picture: string;
  expiresAt: number;
}

const App = () => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tokenClientRef = useRef<any>(null);

  // Load Google Identity Services
  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('gemini_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.expiresAt > Date.now()) {
          setUser(parsed);
        } else {
          localStorage.removeItem('gemini_user');
        }
      } catch (e) {
        localStorage.removeItem('gemini_user');
      }
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeGoogleAuth();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleAuth = useCallback(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError('يرجى إعداد VITE_GOOGLE_CLIENT_ID في ملف .env.local');
      setIsAuthLoading(false);
      return;
    }

    const google = (window as any).google;
    if (google && google.accounts) {
      // Initialize Token Client for OAuth 2.0
      tokenClientRef.current = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: handleTokenResponse,
      });
      setIsAuthLoading(false);
    } else {
      setIsAuthLoading(false);
      setError('فشل في تحميل Google Identity Services');
    }
  }, []);

  const handleTokenResponse = async (response: any) => {
    if (response.error) {
      setError(`خطأ في تسجيل الدخول: ${response.error}`);
      return;
    }

    try {
      // Get user info
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      });

      if (!userInfoResponse.ok) {
        throw new Error('فشل في جلب معلومات المستخدم');
      }

      const userInfo = await userInfoResponse.json();

      const userData: GoogleUser = {
        accessToken: response.access_token,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        expiresAt: Date.now() + (response.expires_in * 1000),
      };

      setUser(userData);
      localStorage.setItem('gemini_user', JSON.stringify(userData));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'خطأ في تسجيل الدخول');
    }
  };

  const handleLogin = () => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken({ prompt: 'consent' });
    } else {
      setError('خدمة تسجيل الدخول غير متاحة');
    }
  };

  const handleLogout = () => {
    const google = (window as any).google;
    if (google && google.accounts && user?.accessToken) {
      google.accounts.oauth2.revoke(user.accessToken, () => {
        console.log('Token revoked');
      });
    }
    setUser(null);
    localStorage.removeItem('gemini_user');
    setSelectedImage(null);
    setGeneratedImage(null);
    setPrompt('');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("حجم الصورة كبير جداً. يرجى رفع صورة أقل من 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt || !user) return;

    // Check if token expired
    if (user.expiresAt < Date.now()) {
      setError('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً.');
      handleLogout();
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Data = selectedImage.split(',')[1];
      const mimeType = selectedImage.split(';')[0].split(':')[1];

      // Use OAuth Bearer Token directly with Gemini API
      const requestBody = {
        contents: [{
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
            {
              text: prompt,
            },
          ],
        }],
        generationConfig: {
          responseModalities: ['Text', 'Image'],
        }
      };

      // Use API Key with Gemini API (OAuth is just for user profile)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error ${response.status}`);
      }

      const data = await response.json();

      let foundImage = false;
      if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData) {
            const resultBase64 = part.inlineData.data;
            const resultMimeType = part.inlineData.mimeType || 'image/png';
            setGeneratedImage(`data:${resultMimeType};base64,${resultBase64}`);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textOutput) {
          setError(`النموذج أرجع نصاً بدلاً من صورة: "${textOutput}". حاول تعديل الوصف.`);
        } else {
          setError("فشل في توليد الصورة. يرجى المحاولة مرة أخرى.");
        }
      }

    } catch (err: any) {
      console.error(err);

      if (err.message && (err.message.includes("401") || err.message.includes("403"))) {
        setError("انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً.");
        handleLogout();
      } else if (err.message && err.message.includes("429")) {
        setError("تم تجاوز حد الاستخدام. يرجى المحاولة لاحقاً.");
      } else {
        setError(err.message || "حدث خطأ أثناء التوليد.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Loading Screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
        <p className="mt-4 text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 border border-gray-100">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl transform -rotate-3 hover:rotate-0 transition-transform">
            <Crown className="w-12 h-12 text-white" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Product AI Studio
            </h1>
            <p className="text-xl text-indigo-600 font-semibold">PRO</p>
            <p className="text-gray-500">
              سجّل دخولك بحساب Google للوصول إلى جميع ميزات <strong>Gemini</strong> المتقدمة
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-5 rounded-2xl text-right flex gap-4 border border-indigo-100">
            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="text-sm text-gray-700">
              <p className="font-bold text-indigo-900 mb-1">ميزات الحساب</p>
              <ul className="space-y-1 text-gray-600">
                <li>✓ توليد صور عالية الجودة</li>
                <li>✓ جميع نماذج Gemini</li>
                <li>✓ لا حاجة لـ API Key</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-4 px-6 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>تسجيل الدخول بحساب Google</span>
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2 justify-center border border-red-100" dir="rtl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            بتسجيل الدخول، أنت توافق على سياسة الخصوصية وشروط الاستخدام
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-12" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-2 rounded-xl">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Product AI Studio
              <span className="mr-2 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-xs border border-indigo-100">PRO</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
              <img src={user.picture} alt="" className="w-6 h-6 rounded-full" />
              <span>{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

          {/* Right Column: Input */}
          <div className="space-y-6">

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-gray-400" />
                الخطوة 1: رفع صورة المنتج
              </h2>

              {!selectedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors group h-80"
                >
                  <div className="p-4 bg-gray-100 rounded-full mb-4 group-hover:bg-white group-hover:shadow-md transition-all">
                    <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-indigo-500" />
                  </div>
                  <p className="text-gray-600 font-medium text-center">اضغط لرفع صورة المنتج</p>
                  <p className="text-gray-400 text-sm mt-2 text-center">JPG, PNG حتى 5MB</p>
                </div>
              ) : (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200 h-80 bg-gray-100 flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Original"
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    onClick={handleClear}
                    className="absolute top-2 left-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gray-400" />
                الخطوة 2: وصف المشهد المطلوب
              </h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="مثال: ضع هذا المنتج على طاولة رخامية في حمام فاخر مع إضاءة ناعمة..."
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none h-32 text-gray-700 placeholder-gray-400 transition-all font-medium"
                dir="auto"
              />

              <button
                onClick={handleGenerate}
                disabled={!selectedImage || !prompt || isLoading}
                className={`w-full mt-4 py-4 px-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${!selectedImage || !prompt || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xl shadow-indigo-200'
                  }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    جاري توليد الصورة...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    توليد صورة احترافية
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Left Column: Output */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                النتيجة
              </h2>

              <div className="flex-1 min-h-[400px] bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
                {isLoading ? (
                  <div className="text-center px-6">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-900 font-medium mb-1">جاري معالجة الصورة</p>
                    <p className="text-gray-500 text-sm">Gemini يعمل على طلبك...</p>
                  </div>
                ) : generatedImage ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-[#1a1a1a]">
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Crown className="w-10 h-10 text-gray-300" />
                    </div>
                    <p>الصورة المولّدة ستظهر هنا</p>
                  </div>
                )}
              </div>

              {generatedImage && (
                <div className="mt-6 flex gap-3">
                  <a
                    href={generatedImage}
                    download={`product-ai-${Date.now()}.png`}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    تحميل الصورة
                  </a>
                  <button
                    onClick={() => setGeneratedImage(null)}
                    className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}