import React from "react";
import { Send, MapPin, Phone, Clock, Mail, MessageCircle, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [emailValue, setEmailValue] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue.trim()) return;
    setSubscribed(true);
    setEmailValue("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer id="contact" className="bg-primary-brand text-white pt-24 pb-12 relative overflow-hidden border-t border-accent-brand/20">
      
      {/* FLOATING WHATSAPP CHAT BUTTON */}
      <a
        href="https://wa.me/918052777728"
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-btn"
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-2xl transition hover:scale-110 border-2 border-white cursor-pointer"
        title="Chat on WhatsApp with Kishori Restaurant"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
      </a>

      {/* FOOTER MATRIX */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Box 1: Brand description */}
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-accent-brand flex items-center justify-center shadow-md">
              <span className="text-primary-brand font-bold text-xl font-serif-lux">K</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-wider font-serif-lux block leading-none text-white">KISHORI</span>
              <span className="text-[10px] tracking-widest font-button-lux text-accent-brand uppercase block pt-0.5">Pure Vegetarian</span>
            </div>
          </div>

          <p className="text-xs text-white/70 leading-relaxed font-sans">
            Kishori Restaurant is Pratapgarh's premium destination for 100% Pure Vegetarian dining excellence. Serving authentic North Indian, South Indian, and tandoori recipes in a luxury family ambiance with compromised hygiene.
          </p>

          <div className="flex space-x-3.5 pt-2">
            {/* WhatsApp Contact badge */}
            <a
              href="https://wa.me/918052777728"
              className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs flex items-center space-x-2 transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="font-sans text-[11px]">WhatsApp Desk</span>
            </a>
          </div>
        </div>

        {/* Box 2: Quick navigation links */}
        <div className="md:col-span-2 space-y-6">
          <h4 className="text-xs uppercase font-button-lux tracking-widest text-accent-brand font-bold">Quick Navigation</h4>
          <ul className="space-y-3.5 text-xs text-white/85 font-semibold">
            {["home", "about", "menu", "gallery", "reservations", "testimonials"].map((link) => (
              <li key={link}>
                <button
                  onClick={() => onNavigate(link)}
                  className="hover:text-accent-brand uppercase tracking-wider text-[10px] transition cursor-pointer"
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Box 3: Open Hours & details */}
        <div className="md:col-span-3 space-y-6">
          <h4 className="text-xs uppercase font-button-lux tracking-widest text-accent-brand font-bold">Opening Hours</h4>
          <div className="space-y-4 text-xs font-sans text-white/80">
            <div className="flex items-start space-x-3">
              <Clock className="w-4 h-4 text-accent-brand shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Open Every Day</p>
                <p className="text-[11px] text-white/60">Monday to Sunday</p>
                <p className="text-[11px] text-white/65 mt-1 font-bold">11:00 AM - 11:00 PM</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-accent-brand shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Bela, Pratapgarh</p>
                <p className="text-[11px] text-white/60">Uttar Pradesh 230001</p>
              </div>
            </div>
          </div>
        </div>

        {/* Box 4: Interactive Newsletter system */}
        <div className="md:col-span-3 space-y-6">
          <h4 className="text-xs uppercase font-button-lux tracking-widest text-accent-brand font-bold">Royal Newsletter</h4>
          <p className="text-xs text-white/70 font-sans leading-relaxed">
            Subscribe to receive royal family combo codes, weekend festival discounts, and special dish releases.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-3">
            <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden px-2.5 py-1.5 focus-within:ring-1 focus-within:ring-accent-brand/40">
              <input
                type="email"
                required
                placeholder="Patron email address"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none placeholder-white/35 px-1 pb-1"
              />
              <button
                type="submit"
                className="p-2 bg-accent-brand hover:scale-105 rounded-lg text-primary-brand transition shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <AnimatePresence>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] text-emerald-400 font-sans font-semibold"
                >
                  ✓ Subscribed successfully! Thank you.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </div>

      </div>

      {/* EMBEDDED GOOGLE MAPS BLOCK */}
      <div id="google-maps-integration" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/5 h-64">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3591.8021468641477!2d81.93655187515152!3d25.90807890253459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399add620fd78181%3A0xe543597d39a3f2bb!2sKishori%20Restaurant!5e0!3m2!1sen!2sin!4v1717900000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="rounded-[24px] grayscale opacity-75 focus:outline-none"
        />
      </div>

      {/* COPYRIGHT NOTE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 text-center text-[10px] text-white/45 flex flex-col sm:flex-row justify-between gap-4 font-sans">
        <p>© 2026 Kishori Restaurant. All Rights Reserved. 100% Pure Vegetarian Excellence Served with Tradition.</p>
        <p className="flex items-center justify-center gap-1">
          <span>Crafted in Pratapgarh, UP with</span>
          <Heart className="w-3 h-3 fill-accent-brand text-accent-brand shrink-0" />
        </p>
      </div>

    </footer>
  );
}
