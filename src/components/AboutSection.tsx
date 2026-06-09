import React from "react";
import { Leaf, Award, Heart, CheckCircle2, ShieldCheck, Flame, Users, Sparkles, Clock, Coins } from "lucide-react";
import { motion } from "motion/react";

export default function AboutSection() {
  const brandPillars = [
    {
      title: "100% Pure Regularity & Veg",
      desc: "Our kitchens operate strictly with zero non-vegetarian food, ensuring absolute mental comfort and compliance with your purity guidelines.",
      icon: Leaf,
      color: "text-emerald-600"
    },
    {
      title: "Luxury Family Hospitality",
      desc: "A warm, elite, and peaceful seated environment carefully curated to offer the perfect ambiance for beautiful family gatherings.",
      icon: Users,
      color: "text-primary-brand"
    },
    {
      title: "Hygienic Kitchen Mandate",
      desc: "We practice surgical-grade kitchen disinfection, organic sourcing, and fresh food preparation daily for your safety.",
      icon: ShieldCheck,
      color: "text-blue-600"
    }
  ];

  const whyChooseUs = [
    {
      title: "Authentic Indian Taste",
      desc: "True heirloom Awadhi, Punjabi, and Mughlai pure veg recipes crafted by master cooks.",
      icon: Flame
    },
    {
      title: "Fresh Farm Ingredients",
      desc: "We procure vegetables and grain fresh from local sustainable farms each morning.",
      icon: Sparkles
    },
    {
      title: "Supremely Fast Service",
      desc: "Enjoy hot and freshly cooked thalis served with incredible speed by our dedicated waiters.",
      icon: Clock
    },
    {
      title: "Affordable Luxury",
      desc: "Experience dynamic five-star dining standards and visual presentation at incredibly humble pricing.",
      icon: Coins
    }
  ];

  return (
    <section id="about" className="py-24 bg-bg-brand relative overflow-hidden">
      {/* Background elegant accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-brand/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent-brand/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* WELCOME SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-sm font-button-lux tracking-[0.25em] text-accent-brand uppercase font-bold block">
                Namaste & Welcome
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-serif-lux text-primary-brand tracking-tight">
                Welcome to Kishori Restaurant
              </h2>
              <div className="w-20 h-[3px] bg-accent-brand rounded-full mt-2"></div>
            </div>

            <p className="text-base text-text-secondary leading-relaxed font-sans">
              Founded on the pillars of purity, elegance, and warm hospitality, **Kishori Restaurant** stands as the crown jewel of 100% Pure Vegetarian dining in Pratapgarh, Uttar Pradesh. Our mission is to blend traditional Indian culinary heritage with luxury visual presentation, creating an unforgettable sensory journey for you and your family.
            </p>
            <p className="text-base text-text-secondary leading-relaxed font-sans">
              From our slow-simmered rich Shahi Paneer and aromatic clay-oven baked Naan to crispy gold-paper Southern crepes, every dish is prepared in an absolutely hygienic environment using premium-quality cow ghee, fresh hand-roasted spices, and healthy farm vegetables.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {brandPillars.map((pillar, idx) => {
                const IconComp = pillar.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="p-5 rounded-2xl bg-white shadow-md border border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-full bg-bg-brand flex items-center justify-center mb-4">
                      <IconComp className={`w-5 h-5 ${pillar.color}`} />
                    </div>
                    <h4 className="text-sm font-bold font-serif-lux text-text-primary mb-2">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-text-secondary font-sans leading-relaxed">
                      {pillar.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* BEAUTIFUL IMAGERY DISPLAY GRID */}
          <div className="lg:col-span-5 grid grid-cols-12 gap-4 relative">
            <div className="col-span-8 space-y-4">
              <div className="rounded-3xl overflow-hidden shadow-2xl h-80 relative group">
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80"
                  alt="Delicious Indian Feast"
                  className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-brand/60 to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold font-button-lux uppercase">Pure Vegetarian Gold</span>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-xl h-48 relative group">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80"
                  alt="Family Seating Spaces"
                  className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
                />
              </div>
            </div>
            
            <div className="col-span-4 flex flex-col justify-center">
              <div className="rounded-3xl overflow-hidden shadow-xl h-64 relative group border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80"
                  alt="Premium Tandoor Kitchen"
                  className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
                />
              </div>
            </div>

            {/* Centered Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-accent-brand text-primary-brand p-4 px-6 rounded-2xl shadow-xl flex items-center space-x-3 border border-white/50 animate-bounce">
              <Award className="w-8 h-8 text-primary-brand" />
              <div>
                <p className="text-xs font-bold font-button-lux tracking-wider uppercase leading-none">Best Pure-Veg</p>
                <p className="text-[10px] font-sans text-primary-brand/80 leading-none mt-1">Pratapgarh Awardee</p>
              </div>
            </div>
          </div>
        </div>

        {/* WHY CHOOSE US AREA */}
        <div className="mt-32">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-button-lux tracking-[0.2em] text-accent-brand uppercase font-bold">Uncompromising Values</span>
            <h3 className="text-2xl sm:text-4xl font-extrabold font-serif-lux text-primary-brand">Why Choose Kishori</h3>
            <p className="text-sm text-text-secondary font-sans leading-relaxed">
              We focus on absolute excellence from ingredients and service speed to luxury aesthetics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -8, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 flex flex-col items-center text-center transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-bg-brand group-hover:bg-primary-brand flex items-center justify-center mb-6 transition-all border border-gray-100 shadow-sm">
                    <IconComp className="w-7 h-7 text-primary-brand group-hover:text-accent-brand transition-all" />
                  </div>
                  <h4 className="text-base font-bold font-serif-lux text-text-primary mb-3">
                    {item.title}
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
