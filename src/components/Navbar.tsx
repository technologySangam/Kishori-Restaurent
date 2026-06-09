import React from "react";
import { ShoppingBag, User, Settings, ShieldAlert, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  userRole: "customer" | "admin";
  onToggleUserRole: () => void;
  onOpenDashboard: () => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  activeSection,
  onNavigate,
  userRole,
  onToggleUserRole,
  onOpenDashboard,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "menu", label: "Menu" },
    { id: "offers", label: "Offers" },
    { id: "gallery", label: "Gallery" },
    { id: "reservations", label: "Reservations" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-primary-brand/95 backdrop-blur-md shadow-lg py-3 border-b border-accent-brand/20 text-white"
          : "bg-transparent py-5 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <div
            id="navbar-logo"
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <div className="relative w-10 h-10 rounded-full bg-accent-brand flex items-center justify-center shadow-md">
              <span className="text-primary-brand font-bold text-xl font-serif-lux">K</span>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-wider font-serif-lux block leading-none">
                KISHORI
              </span>
              <span className="text-[9px] tracking-[0.2em] font-button-lux text-accent-brand uppercase block pt-0.5">
                Pure Vegetarian
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <div className="hidden lg:flex items-center space-x-6 md:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-button-lux tracking-wide transition-colors relative pb-1 ${
                  activeSection === item.id
                    ? "text-accent-brand font-semibold"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-brand rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Role Toggle Switch & Dashboard shortcut */}
            <div className="flex items-center space-x-1.5 bg-black/20 rounded-full p-1 border border-white/10 text-xs">
              <button
                id="role-switch-btn"
                onClick={onToggleUserRole}
                className={`px-2.5 py-1 rounded-full font-button-lux font-medium transition-all flex items-center space-x-1 ${
                  userRole === "admin"
                    ? "bg-red-600 text-white shadow"
                    : "bg-emerald-600/90 text-white shadow"
                }`}
                title="Toggle User Persona View"
              >
                {userRole === "admin" ? (
                  <>
                    <Settings className="w-3.5 h-3.5 animate-spin" />
                    <span>Admin Mode</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5" />
                    <span>Customer View</span>
                  </>
                )}
              </button>
              <button
                id="open-dashboard-btn"
                onClick={onOpenDashboard}
                className="px-2 py-1 text-white/90 hover:text-white font-button-lux text-xs transition px-2 hover:bg-white/10 rounded-full"
              >
                Dashboard
              </button>
            </div>

            {/* Cart Button */}
            <button
              id="navbar-cart-trigger"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/15 transitional-all border border-white/15 flex items-center justify-center text-white cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-accent-brand" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-accent-brand text-primary-brand text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary-brand shadow-md"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
