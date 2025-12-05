import { useState, useRef } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Upload,
  Activity,
  AlertCircle,
  CheckCircle,
  Info,
  Stethoscope,
  Pill,
  Droplets,
  Thermometer,
  FileText,
  Sparkles
} from "lucide-react";

interface DiagnosisResult {
  disease: string;
  arabicName: string;
  confidence: number;
  symptoms: string[];
  causes: string[];
  treatment: string[];
  prevention: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  waterParameters?: {
    temperature: string;
    ph: string;
    ammonia: string;
  };
}

// Mock disease database
const mockDiseases: DiagnosisResult[] = [
  {
    disease: "Ich (White Spot Disease)",
    arabicName: "مرض النقط البيضاء (Ich)",
    confidence: 92,
    symptoms: [
      "نقط بيضاء صغيرة على الجسم والزعانف",
      "احتكاك السمكة بالأسطح",
      "خمول وفقدان شهية",
      "تنفس سريع"
    ],
    causes: [
      "طفيلي Ichthyophthirius multifiliis",
      "انخفاض مفاجئ في الحرارة",
      "stress وضعف المناعة",
      "حوض جديد غير معالج"
    ],
    treatment: [
      "رفع الحرارة تدريجياً إلى 30°م",
      "علاج Ich المتخصص (مالاكيت أخضر)",
      "تغيير 25% من الماء يومياً",
      "إضافة ملح الحوض (1 ملعقة/10 لتر)",
      "استمر العلاج 7-10 أيام"
    ],
    prevention: [
      "عزل الأسماك الجديدة لمدة 14 يوم",
      "حافظ على حرارة ثابتة",
      "تغيير ماء منتظم",
      "تجنب الاكتظاظ"
    ],
    urgency: "high",
    waterParameters: {
      temperature: "30°م (أثناء العلاج)",
      ph: "7.0-7.5",
      ammonia: "0 ppm"
    }
  },
  {
    disease: "Fin Rot",
    arabicName: "تعفن الزعانف",
    confidence: 88,
    symptoms: [
      "تآكل أطراف الزعانف",
      "حواف بيضاء أو سوداء",
      "زعانف ممزقة أو مهترئة",
      "احمرار في قاعدة الزعانف"
    ],
    causes: [
      "بكتيريا Pseudomonas و Aeromonas",
      "جودة ماء سيئة",
      "إصابات فيزيائية",
      "اكتظاظ الحوض"
    ],
    treatment: [
      "تغيير 50% من الماء فوراً",
      "مضاد حيوي واسع الطيف",
      "ملح مائي (3 ملاعق/10 لتر)",
      "عزل السمكة المصابة",
      "نظف الفلتر وغيّر الكربون"
    ],
    prevention: [
      "تغيير ماء أسبوعي 25-30%",
      "تجنب الأسماك العدوانية",
      "لا تكتظ الحوض",
      "نظافة دورية"
    ],
    urgency: "medium",
    waterParameters: {
      temperature: "24-26°م",
      ph: "6.5-7.5",
      ammonia: "0 ppm"
    }
  },
  {
    disease: "Dropsy",
    arabicName: "الاستسقاء (Dropsy)",
    confidence: 85,
    symptoms: [
      "انتفاخ البطن بشكل كبير",
      "قشور منتفخة (مثل الصنوبر)",
      "عيون منتفخة",
      "خمول شديد وعدم توازن"
    ],
    causes: [
      "فشل كلوي أو عضوي",
      "عدوى بكتيرية داخلية",
      "ماء ملوث",
      "غذاء فاسد"
    ],
    treatment: [
      "⚠️ معدل نجاح منخفض",
      "عزل فوري",
      "مضاد حيوي قوي (Kanamycin)",
      "حمام ملح (1 ملعقة صغيرة/لتر) لمدة 30 دقيقة",
      "لا تطعمه يومين",
      "استشر طبيب بيطري"
    ],
    prevention: [
      "جودة ماء ممتازة",
      "غذاء طازج وعالي الجودة",
      "لا تفرط في التغذية",
      "عزل الأسماك الجديدة"
    ],
    urgency: "critical",
    waterParameters: {
      temperature: "25-27°م",
      ph: "7.0",
      ammonia: "0 ppm"
    }
  },
  {
    disease: "Velvet Disease",
    arabicName: "مرض القطيفة الذهبية",
    confidence: 90,
    symptoms: [
      "طبقة ذهبية/بنية على الجسم",
      "احتكاك بالأسطح",
      "فقدان لون",
      "تنفس سريع"
    ],
    causes: [
      "طفيلي Oodinium",
      "إضاءة قوية مع حرارة منخفضة",
      "stress"
    ],
    treatment: [
      "أطفئ الإضاءة تماماً",
      "علاج Copper-based",
      "رفع الحرارة إلى 28°م",
      "تغيير ماء 50%"
    ],
    prevention: [
      "إضاءة معتدلة",
      "عزل جديد",
      "تغيير ماء منتظم"
    ],
    urgency: "high"
  }
];

export default function FishHealthDiagnosis() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setDiagnosis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFish = () => {
    if (!image) return;

    setIsAnalyzing(true);

    // Simulate API call
    setTimeout(() => {
      const randomDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
      setDiagnosis(randomDisease);
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetAnalysis = () => {
    setImage(null);
    setDiagnosis(null);
  };

  const urgencyConfig = {
    low: { color: 'bg-green-500', text: 'منخفضة', icon: CheckCircle },
    medium: { color: 'bg-yellow-500', text: 'متوسطة', icon: Info },
    high: { color: 'bg-orange-500', text: 'عالية', icon: AlertCircle },
    critical: { color: 'bg-red-500', text: 'حرجة!', icon: AlertCircle }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-950 px-6 py-2 rounded-full mb-4">
            <Stethoscope className="h-5 w-5 text-red-600" />
            <span className="font-bold text-red-700 dark:text-red-400">تشخيص ذكي بالـ AI</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            تشخيص أمراض الأسماك
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            التقط صورة لسمكتك واحصل على تشخيص فوري مع خطة علاج مفصلة
          </p>

          <Alert className="mt-6 max-w-2xl mx-auto bg-blue-50 dark:bg-blue-950 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm">
              <strong>ملاحظة:</strong> هذا التشخيص تقديري يعتمد على الذكاء الاصطناعي. للحالات الحرجة، استشر طبيب بيطري متخصص.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                ارفع صورة السمكة
              </CardTitle>
              <CardDescription>
                صورة واضحة للسمكة من الجانب للحصول على أفضل تشخيص
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!image ? (
                <div className="space-y-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <span className="text-lg font-semibold mb-2">اختر صورة من جهازك</span>
                    <span className="text-sm text-muted-foreground">PNG, JPG حتى 5MB</span>
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-background px-2 text-muted-foreground">أو</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => cameraInputRef.current?.click()}
                    variant="outline"
                    className="w-full gap-2"
                    size="lg"
                  >
                    <Camera className="h-5 w-5" />
                    التقط صورة بالكاميرا
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <img
                    src={image}
                    alt="Uploaded fish"
                    className="w-full h-64 object-cover rounded-lg"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={resetAnalysis}
                      className="gap-2"
                    >
                      صورة أخرى
                    </Button>
                    <Button
                      onClick={analyzeFish}
                      disabled={isAnalyzing}
                      className="gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <Activity className="h-4 w-4 animate-spin" />
                          جاري التحليل...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          تشخيص الآن
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Diagnosis Result */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                نتيجة التشخيص
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!diagnosis ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground">
                  <Stethoscope className="h-16 w-16 mb-4 opacity-20" />
                  <p>ارفع صورة للحصول على التشخيص</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Disease Name */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold">{diagnosis.arabicName}</h3>
                      <Badge className={`${urgencyConfig[diagnosis.urgency].color} text-white`}>
                        {urgencyConfig[diagnosis.urgency].text}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{diagnosis.disease}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">الدقة:</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${diagnosis.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold">{diagnosis.confidence}%</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Symptoms */}
                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-red-500" />
                      الأعراض:
                    </h4>
                    <ul className="space-y-2">
                      {diagnosis.symptoms.map((symptom, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* Treatment */}
                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <Pill className="h-4 w-4 text-green-500" />
                      العلاج:
                    </h4>
                    <ol className="space-y-2">
                      {diagnosis.treatment.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Badge variant="outline" className="shrink-0">{i + 1}</Badge>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Water Parameters */}
                  {diagnosis.waterParameters && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          معايير المياه الموصى بها:
                        </h4>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
                            <Thermometer className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                            <div className="font-semibold text-xs mb-1">الحرارة</div>
                            <div className="font-bold text-blue-600">{diagnosis.waterParameters.temperature}</div>
                          </div>
                          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
                            <div className="font-semibold text-xs mb-1">pH</div>
                            <div className="font-bold text-purple-600">{diagnosis.waterParameters.ph}</div>
                          </div>
                          <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg text-center">
                            <div className="font-semibold text-xs mb-1">الأمونيا</div>
                            <div className="font-bold text-amber-600">{diagnosis.waterParameters.ammonia}</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Common Diseases Reference */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">الأمراض الشائعة</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockDiseases.map((disease, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{disease.arabicName}</CardTitle>
                    <Badge className={`${urgencyConfig[disease.urgency].color} text-white text-xs`}>
                      {urgencyConfig[disease.urgency].text}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{disease.disease}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold block mb-1">الأعراض الرئيسية:</span>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {disease.symptoms.slice(0, 2).map((s, j) => (
                          <li key={j} className="flex gap-1">
                            <span>•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
