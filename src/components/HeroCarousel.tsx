import React from "react";
import { ChevronLeft, ChevronRight, Sparkles, ChefHat, Leaf, Users, ShieldCheck, Truck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeroCarouselProps {
  onExploreMenu: () => void;
  onReserveTable: () => void;
  onViewOffers: () => void;
}

const slides = [
  {
    title: "Authentic Pure Veg Delights Crafted With Love",
    description: "Experience a world of rich flavors, fresh ingredients, and traditional recipes prepared with the highest standards of purity and quality.",
    badge: "100% Pure Vegetarian",
    badgeIcon: Leaf,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1600&auto=format&fit=crop&q=80",
    btn1Label: "Explore Menu",
    btn2Label: "Reserve Table",
    btn1Action: "menu",
    btn2Action: "reserve"
  },
  {
    title: "Where Families Gather For Memorable Meals",
    description: "Enjoy warm hospitality and delicious vegetarian cuisine in a family-friendly atmosphere at Bela, Pratapgarh.",
    badge: "Family Restaurant",
    badgeIcon: Users,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80",
    btn1Label: "Book Your Table",
    btn2Label: "View Special Combos",
    btn1Action: "reserve",
    btn2Action: "offers"
  },
  {
    title: "Fresh Ingredients. Authentic Taste.",
    description: "Prepared using farm-fresh vegetables, premium hand-pounded spices and age-old traditional cooking methods.",
    badge: "Fresh Daily",
    badgeIcon: Sparkles,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=1600&auto=format&fit=crop&q=80",
    btn1Label: "Order Online",
    btn2Label: "View Menu",
    btn1Action: "menu",
    btn2Action: "menu"
  },
  {
    title: "Chef's Signature Vegetarian Collection",
    description: "Discover handcrafted vegetarian dishes like our famous Shahi Paneer, Hara Bhara kebab, and Golden Dosa designed to delight every palate.",
    badge: "Chef Recommended",
    badgeIcon: ChefHat,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=1600&auto=format&fit=crop&q=80",
    btn1Label: "Chef Specials",
    btn2Label: "Order Now",
    btn1Action: "menu",
    btn2Action: "menu"
  },
  {
    title: "Fast Delivery. Fresh Every Time.",
    description: "Restaurant-quality pure vegetarian food safely packaged and delivered steam-hot straight to your doorstep.",
    badge: "Quick Delivery",
    badgeIcon: Truck,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1600&auto=format&fit=crop&q=80",
    btn1Label: "Order Online",
    btn2Label: "Contact Us",
    btn1Action: "menu",
    btn2Action: "contact"
  }
];

export default function HeroCarousel({ onExploreMenu, onReserveTable, onViewOffers }: HeroCarouselProps) {
  const [current, setCurrent] = React.useState(0);
  const [direction, setDirection] = React.useState(0); // -1 for left, 1 for right

  React.useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const handleNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleBtnClick = (action: string) => {
    if (action === "menu") onExploreMenu();
    else if (action === "reserve") onReserveTable();
    else if (action === "offers") onViewOffers();
    else if (action === "contact") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Variants for Framer Motion sliding
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.1
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.6 },
        scale: { duration: 10, ease: "easeOut" } // subtle Ken Burns zoom
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    })
  };

  const activeSlide = slides[current];
  const BadgeIcon = activeSlide.badgeIcon;

  return (
    <div id="hero-carousel-container" className="relative w-full h-screen overflow-hidden bg-primary-brand select-none">
      {/* KEN BURNS ANIMATED BACKGROUND SLIDE */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Cover image */}
          <img
            src={activeSlide.image}
            alt={activeSlide.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Deep professional vignette and dark overlay for excellent text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-brand/90 via-primary-brand/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-brand via-transparent to-primary-brand/35"></div>
        </motion.div>
      </AnimatePresence>

      {/* COMPONENT CONTENT OVERLAY */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="max-w-3xl text-left">
            
            {/* Slide Badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${current}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center space-x-2 bg-accent-brand text-primary-brand font-button-lux font-semibold text-xs py-1.5 px-3.5 rounded-full shadow-lg border border-white/20 uppercase tracking-widest mb-6"
              >
                <BadgeIcon className="w-4 h-4 text-primary-brand animate-pulse" />
                <span>{activeSlide.badge}</span>
              </motion.div>
            </AnimatePresence>

            {/* Slide Title */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${current}`}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white font-serif-lux leading-tight sm:leading-none tracking-tight"
              >
                {activeSlide.title}
              </motion.h1>
            </AnimatePresence>

            {/* Slide Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-base sm:text-lg text-white/80 font-sans max-w-xl leading-relaxed"
              >
                {activeSlide.description}
              </motion.p>
            </AnimatePresence>

            {/* Action buttons */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`actions-${current}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-10 flex flex-wrap gap-4 items-center"
              >
                <button
                  id={`hero-btn-primary-${current}`}
                  onClick={() => handleBtnClick(activeSlide.btn1Action)}
                  className="px-8 py-4 rounded-xl gold-gradient text-primary-brand font-button-lux font-bold cursor-pointer text-sm shadow-xl hover:shadow-2xl transition hover:scale-105"
                >
                  {activeSlide.btn1Label}
                </button>
                <button
                  id={`hero-btn-secondary-${current}`}
                  onClick={() => handleBtnClick(activeSlide.btn2Action)}
                  className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 cursor-pointer text-white font-button-lux font-semibold text-sm shadow border border-white/20 transition backdrop-blur-sm"
                >
                  {activeSlide.btn2Label}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* RE-NAVIGATIONS (LEFT / RIGHT CONTROLS) */}
      <button
        id="hero-nav-prev"
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 h-12 w-12 rounded-full bg-black/25 hover:bg-black/40 border border-white/10 flex items-center justify-center text-white cursor-pointer transition hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        id="hero-nav-next"
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 h-12 w-12 rounded-full bg-black/25 hover:bg-black/40 border border-white/10 flex items-center justify-center text-white cursor-pointer transition hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* PROGRESS INDICATORS (DOT BUTTONS) */}
      <div id="hero-progress-indicators" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            id={`hero-indicator-${idx}`}
            onClick={() => {
              setDirection(idx > current ? 1 : -1);
              setCurrent(idx);
            }}
            className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
              idx === current ? "w-8 bg-accent-brand" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
