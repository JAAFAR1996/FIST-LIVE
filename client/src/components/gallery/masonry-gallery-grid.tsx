import Masonry from "react-masonry-css";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Heart, Expand, User } from "lucide-react";

// Mock gallery data
const galleryItems = [
  { id: 1, image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&q=80", user: "أحمد محمد", tank: "120L Planted", likes: 24 },
  { id: 2, image: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80", user: "سارة علي", tank: "60L Nano", likes: 45 },
  { id: 3, image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&q=80", user: "عمر خالد", tank: "300L Reef", likes: 12 },
  { id: 4, image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800&q=80", user: "نور حسن", tank: "Discus Tank", likes: 67 },
  { id: 5, image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=800&q=80", user: "كريم سامي", tank: "Aquascape", likes: 89 },
  { id: 6, image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80", user: "ليلى محمود", tank: "Goldfish Pond", likes: 34 },
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
      className="flex w-auto -ml-4"
      columnClassName="pl-4 bg-clip-padding"
    >
      {galleryItems.map((item) => (
        <div key={item.id} className="mb-4 group relative overflow-hidden rounded-xl bg-muted">
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-pointer">
                <img 
                  src={item.image} 
                  alt={item.tank} 
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <p className="font-bold">{item.tank}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="flex items-center text-xs"><User className="w-3 h-3 mr-1"/> {item.user}</span>
                    <span className="flex items-center text-xs"><Heart className="w-3 h-3 mr-1"/> {item.likes}</span>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
              <img src={item.image} alt={item.tank} className="w-full h-auto rounded-lg shadow-2xl" />
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </Masonry>
  );
}
