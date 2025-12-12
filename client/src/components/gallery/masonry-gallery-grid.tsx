import Masonry from "react-masonry-css";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Heart, Info } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

// Aquarium styles gallery - showcasing different aquascaping approaches
const galleryItems = [
  {
    id: 1,
    image: "/aquarium-styles/dutch-style.png",
    style: "الطراز الهولندي",
    description: "حديقة مائية كثيفة بالنباتات",
    likes: 124,
    tooltip: "أقدم فنون تنسيق الأحواض، يركز على تنوع النباتات والتباين في الألوان والارتفاعات"
  },
  {
    id: 2,
    image: "/aquarium-styles/nature-style.png",
    style: "طراز الطبيعة",
    description: "تقليد المناظر الطبيعية البرية",
    likes: 156,
    tooltip: "ابتكره تاكاشي أمانو، يحاكي الغابات والوديان الطبيعية تحت الماء"
  },
  {
    id: 3,
    image: "/aquarium-styles/iwagumi-style.png",
    style: "الإيواغومي",
    description: "بساطة يابانية وتأمل",
    likes: 98,
    tooltip: "أسلوب ياباني يعتمد على ترتيب الصخور ونباتات السجاد، بتصميم بسيط ومتأمل"
  },
  {
    id: 4,
    image: "/aquarium-styles/biotope-style.png",
    style: "البيوتوب",
    description: "بيئة طبيعية أصلية",
    likes: 87,
    tooltip: "يعيد إنشاء موطن طبيعي محدد بدقة، مثل نهر الأمازون أو بحيرة أفريقية"
  },
  {
    id: 5,
    image: "/aquarium-styles/jungle-style.png",
    style: "طراز الغابة",
    description: "غابة استوائية كثيفة",
    likes: 142,
    tooltip: "يحاكي المظهر الكثيف للغابة الاستوائية بنباتات متشابكة ومظهر بري جميل"
  },
];

export function MasonryGalleryGrid() {
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto -ml-6"
      columnClassName="pl-6 bg-clip-padding"
    >
      {galleryItems.map((item, index) => (
        <div
          key={item.id}
          className="mb-6 group relative overflow-hidden rounded-2xl bg-muted shadow-md hover:shadow-xl transition-all duration-300 card-hover-lift gpu-accelerate fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <Dialog>
            <DialogTrigger asChild>
              <div
                className="cursor-pointer relative"
                role="button"
                aria-label={`عرض ${item.style} - ${item.description}`}
                tabIndex={0}
              >
                <OptimizedImage
                  src={item.image}
                  alt={`${item.style} - ${item.description}`}
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105 gpu-accelerate"
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  aspectRatio="4/3"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-2 mb-2 justify-end">
                    <p className="font-bold text-xl text-right">{item.style}</p>
                    <Info className="w-4 h-4 text-primary" aria-hidden="true" />
                  </div>
                  <p className="text-sm mb-3 text-right text-slate-200">{item.description}</p>
                  <div className="flex items-center justify-between text-sm border-t border-white/20 pt-2">
                    <span className="text-xs text-slate-300 line-clamp-1">{item.tooltip}</span>
                    <span className="flex items-center gap-1.5" aria-label={`${item.likes} إعجاب`}>
                      <Heart className="w-4 h-4 fill-red-500 text-red-500 animate-pulse" aria-hidden="true" />
                      {item.likes}
                    </span>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent
              className="max-w-5xl p-0 overflow-hidden bg-transparent border-none shadow-none"
              aria-label={`تفاصيل ${item.style}`}
            >
              <div className="relative">
                <OptimizedImage
                  src={item.image}
                  alt={`${item.style} - ${item.description}`}
                  className="w-full h-auto rounded-xl shadow-2xl"
                  priority={true}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 rounded-b-xl">
                  <h3 className="text-2xl font-bold text-white mb-2 text-right">{item.style}</h3>
                  <p className="text-slate-200 text-right mb-2">{item.description}</p>
                  <p className="text-sm text-slate-300 text-right leading-relaxed">{item.tooltip}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </Masonry>
  );
}

