import React from "react";
import { Camera, Eye, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const GALLERY_ITEMS = [
  {
    id: "g1",
    title: "Luxury Dining Seating Hall",
    category: "Interior",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "g2",
    title: "Slow Cooked Dal Makhani Oven",
    category: "Food",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "g3",
    title: "Our Celebrated Saffron Shahi Paneer",
    category: "Food",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "g4",
    title: "Private Family Banquets Info",
    category: "Celebrations",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "g5",
    title: "Clay Oven Tandoori Cooking process",
    category: "Food",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "g6",
    title: "Traditional Welcome & Cleanliness",
    category: "Interior",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop&q=80"
  }
];

export default function GallerySection() {
  const [activeTab, setActiveTab] = React.useState("All");
  const [lightboxImage, setLightboxImage] = React.useState<any | null>(null);

  const filteredItems = activeTab === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeTab);

  return (
    <section id="gallery" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title portion */}
        <div className="text-center max-w-lg mx-auto space-y-3 mb-12">
          <span className="text-xs font-button-lux tracking-[0.25em] text-accent-brand uppercase font-bold">Aesthetic Ambience</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-lux text-primary-brand">Gourmet Photo Gallery</h2>
          <p className="text-xs text-text-secondary font-sans leading-relaxed">
            Witness the pristine hygienic kitchen standards, luxury golden seated interiors, and premium thalis.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center space-x-3 mb-10 overflow-x-auto pb-2">
          {["All", "Interior", "Food", "Celebrations"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-5 rounded-full text-xs font-button-lux font-medium transition cursor-pointer ${
                activeTab === tab
                  ? "bg-primary-brand text-accent-brand shadow-sm"
                  : "bg-gray-100 text-text-primary hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                className="relative overflow-hidden rounded-[24px] h-72 shadow-sm border border-gray-100 group cursor-pointer"
                onClick={() => setLightboxImage(item)}
              >
                {/* Image */}
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                
                {/* Hover overlay details */}
                <div className="absolute inset-0 bg-primary-brand/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6">
                  <div className="flex justify-end">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
                      <ZoomIn className="w-4 h-4 text-accent-brand" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-button-lux uppercase tracking-widest text-accent-brand font-bold">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold font-serif-lux text-white mt-1">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center bg-gray-900"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <img src={lightboxImage.image} alt={lightboxImage.title} className="max-w-full max-h-[70vh] object-contain rounded-t-3xl" />
              
              <div className="p-6 bg-gray-900 text-center w-full">
                <span className="text-[10px] font-button-lux tracking-widest text-accent-brand uppercase font-bold">{lightboxImage.category}</span>
                <h4 className="text-base font-bold font-serif-lux text-white mt-1">{lightboxImage.title}</h4>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
