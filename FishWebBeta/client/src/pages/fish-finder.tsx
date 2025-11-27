import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FishFinderWizard from "@/components/fish-finder/fish-finder-wizard";

export default function FishFinder() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground animate-in slide-in-from-bottom-4 duration-700">
            مكتشف الأسماك الذكي
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in slide-in-from-bottom-6 duration-700 delay-100">
            أجب على بضعة أسئلة وسنقوم بتصميم الحوض المثالي لك ولأسماكك باستخدام الذكاء الاصطناعي.
          </p>
        </div>

        <div className="animate-in fade-in zoom-in-95 duration-700 delay-200">
          <FishFinderWizard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
