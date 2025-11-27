import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CheckCircle2 } from "lucide-react";

export default function Journey() {
  const steps = [
    {
      title: "التخطيط",
      desc: "حدد حجم الحوض المناسب ومكانه ونوع الأسماك التي ترغب بتربيتها.",
      status: "completed"
    },
    {
      title: "المعدات",
      desc: "اختر الفلتر والسخان والإضاءة المناسبة لحجم حوضك.",
      status: "current"
    },
    {
      title: "الديكور",
      desc: "أضف الرمل والصخور والنباتات لإنشاء بيئة طبيعية.",
      status: "upcoming"
    },
    {
      title: "تدوير الحوض",
      desc: "انتظر اكتمال الدورة البايولوجية قبل إضافة الأسماك.",
      status: "upcoming"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl font-bold text-slate-900">رحلتك لإنشاء حوض مثالي</h1>
            <p className="text-xl text-slate-500">دليلك خطوة بخطوة من الحوض الفارغ إلى عالم تحت الماء مفعم بالحياة</p>
          </div>

          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {step.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : (
                    <span className={`font-bold ${step.status === "current" ? "text-primary" : "text-slate-400"}`}>{idx + 1}</span>
                  )}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
