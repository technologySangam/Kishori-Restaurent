import React from "react";
import Navbar from "./components/Navbar";
import HeroCarousel from "./components/HeroCarousel";
import AboutSection from "./components/AboutSection";
import MenuSection from "./components/MenuSection";
import TableReservation from "./components/TableReservation";
import GallerySection from "./components/GallerySection";
import Testimonials from "./components/Testimonials";
import CustomerDashboard from "./components/CustomerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AiAssistant from "./components/AiAssistant";
import Footer from "./components/Footer";
import { MenuItem, Order, Reservation, Review, UserProfile } from "./types";
import { Sparkles, Utensils, X, ClipboardList, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation & UI States
  const [activeSection, setActiveSection] = React.useState("home");
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = React.useState(false);
  
  // Personas View role ("customer" | "admin")
  const [userRole, setUserRole] = React.useState<"customer" | "admin">("customer");

  // REST Backend States
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [ordersHistory, setOrdersHistory] = React.useState<Order[]>([]);
  const [reservationsHistory, setReservationsHistory] = React.useState<Reservation[]>([]);
  
  // Selected Profile state
  const [profile, setProfile] = React.useState<UserProfile>({
    name: "Govind Maurya",
    email: "mauryagovindg5@gmail.com",
    phone: "08052777728",
    addresses: [
      "Bela Civil Lines, Pratapgarh, Uttar Pradesh 230001",
      "Sadar Bazaar Road, Pratapgarh, UP"
    ],
    loyaltyPoints: 1200, // starting gold points
  });

  // Current Cart active selection
  const [cartItems, setCartItems] = React.useState<any[]>([]);

  // Page tracking scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "menu", "gallery", "reservations", "testimonials", "contact"];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch initial information from back-end Express API routes on mount
  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const menuRes = await fetch("/api/menu");
      const menuData = await menuRes.json();
      setMenuItems(menuData);

      const reviewRes = await fetch("/api/reviews");
      const reviewData = await reviewRes.json();
      setReviews(reviewData);

      const ordsRes = await fetch("/api/orders");
      const ordsData = await ordsRes.json();
      setOrdersHistory(ordsData);

      const resRes = await fetch("/api/reservations");
      const resData = await resRes.json();
      setReservationsHistory(resData);
    } catch (e) {
      console.error("Backend offline. Loading local simulation states instead.", e);
    }
  };

  // 1. ADD TO CART HANDLER
  const handleAddToCart = (item: MenuItem, quantity = 1) => {
    setCartItems((prev) => {
      const exist = prev.find((c) => c.id === item.id);
      if (exist) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [...prev, { ...item, quantity }];
    });
    // Visual user feedback
    setIsCartOpen(true);
  };

  // 1.2 UPDATE QUANTITIES
  const handleUpdateCartQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((itm) => {
          if (itm.id === itemId) {
            const nextQty = itm.quantity + delta;
            return { ...itm, quantity: nextQty };
          }
          return itm;
        })
        .filter((itm) => itm.quantity > 0)
    );
  };

  // 1.3 DELETE ITEM
  const handleRemoveFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((itm) => itm.id !== itemId));
  };

  // 1.4 REST CARD STATE
  const handleClearCart = () => {
    setCartItems([]);
  };

  // 1.5 REPEAT ORDER HANDLER
  const handleRepeatOrder = (order: Order) => {
    setCartItems((prev) => {
      const updatedCart = [...prev];
      order.items.forEach((orderItem) => {
        // Match with database menu items
        const menuItem = menuItems.find((m) => m.id === orderItem.itemId);
        const resolvedItem = menuItem || {
          id: orderItem.itemId,
          name: orderItem.name,
          price: orderItem.price,
          category: orderItem.category || "North Indian",
          description: "Delicious pure veg dish of Kishori",
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=60",
          isPopular: false,
          isChefSpecial: false,
        };

        const existIndex = updatedCart.findIndex((c) => c.id === resolvedItem.id);
        if (existIndex > -1) {
          updatedCart[existIndex] = {
            ...updatedCart[existIndex],
            quantity: updatedCart[existIndex].quantity + orderItem.quantity,
          };
        } else {
          updatedCart.push({ ...resolvedItem, quantity: orderItem.quantity });
        }
      });
      return updatedCart;
    });

    // Close dashboard and show active cart drawer
    setIsDashboardOpen(false);
    setIsCartOpen(true);
  };

  // 2. PLACE ONLINE ORDER
  const handlePlaceOrder = async (orderDetails: any) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderDetails),
    });
    const result = await response.json();
    
    // Add gold loyalty points rewards (+10% points of subtotal)
    const pointsToAdd = Math.round(orderDetails.subtotal * 0.1);
    const newPoints = profile.loyaltyPoints + pointsToAdd;
    setProfile(prev => ({ ...prev, loyaltyPoints: newPoints }));

    // reload orders list
    fetchData();
    return result;
  };

  // 3. TABLE SEAT RESERVATION DISPATCH
  const handleReserveTable = async (bookingDetails: any) => {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingDetails),
    });
    const result = await response.json();
    fetchData();
    return result;
  };

  // 4. CHAT REVIEW WRITING SUBMIT
  const handlePostReview = async (reviewDetails: any) => {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewDetails),
    });
    const result = await response.json();
    fetchData();
    return result;
  };

  // 5. UPDATE BACKEND ORDER STATE (ADMIN CONTROL)
  const handleUpdateOrderStatus = async (orderId: string, status: any) => {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    fetchData();
    return result;
  };

  // 6. UPDATE RESERVATION STATUS (ADMIN CONTROL)
  const handleUpdateReservationStatus = async (resId: string, status: any) => {
    const response = await fetch(`/api/reservations/${resId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    fetchData();
    return result;
  };

  // 7. CREATE NEW MENU PRODUCT (ADMIN CONTROL)
  const handleAddMenuItem = async (itemDetails: any) => {
    const response = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemDetails),
    });
    const result = await response.json();
    fetchData();
    return result;
  };

  // 8. UPDATE DISH PRICE (ADMIN CONTROL)
  const handleEditMenuItem = async (id: string, updatedDetails: any) => {
    const response = await fetch(`/api/menu/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedDetails),
    });
    const result = await response.json();
    fetchData();
    return result;
  };

  // 9. TRASH DISH (ADMIN CONTROL)
  const handleDeleteMenuItem = async (id: string) => {
    const response = await fetch(`/api/menu/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    fetchData();
    return result;
  };

  // General Navbar scrolling links handler
  const handleNavigate = (sectionId: string) => {
    setIsDashboardOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      // scroll to top fallback if section is home
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-bg-brand text-text-primary selection:bg-accent-brand/40 selection:text-primary-brand relative">
      
      {/* GLOBAL HIGH-END NAVIGATION STICKY */}
      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        userRole={userRole}
        onToggleUserRole={() => setUserRole(prev => prev === "admin" ? "customer" : "admin")}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />

      {/* DASHBOARDS EXPEXPANDABLE SUBVIEW PANEL CONTAINER */}
      <AnimatePresence>
        {isDashboardOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-bg-brand/95 backdrop-blur-md pt-28 pb-12 overflow-y-auto"
          >
            <div className="max-w-5xl mx-auto px-4 relative">
              <button
                onClick={() => setIsDashboardOpen(false)}
                className="absolute top-4 right-4 p-3 bg-white hover:bg-gray-100 text-gray-500 rounded-full shadow border border-gray-150 transition z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <span className="text-xs font-button-lux tracking-[0.25em] text-accent-brand uppercase font-bold">Executive Office</span>
                <h2 className="text-3xl font-extrabold font-serif-lux text-primary-brand">Dashboard Portals</h2>
                <p className="text-xs text-text-secondary mt-1">
                  Manage orders, track active thalis, reservation slots, reviews auditing, of Kishori Restaurant.
                </p>
              </div>

              {userRole === "admin" ? (
                <AdminDashboard
                  orders={ordersHistory}
                  reservations={reservationsHistory}
                  menuItems={menuItems}
                  reviews={reviews}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onUpdateReservationStatus={handleUpdateReservationStatus}
                  onAddMenuItem={handleAddMenuItem}
                  onEditMenuItem={handleEditMenuItem}
                  onDeleteMenuItem={handleDeleteMenuItem}
                />
              ) : (
                <CustomerDashboard
                  orders={ordersHistory.filter(o => o.customerEmail.toLowerCase() === profile.email.toLowerCase())}
                  reservations={reservationsHistory.filter(r => r.email.toLowerCase() === profile.email.toLowerCase())}
                  profile={profile}
                  onUpdateProfile={handleUpdateProfile}
                  onRepeatOrder={handleRepeatOrder}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRIMARY GUEST VIEWPORT LAYOUT */}
      <div className={isDashboardOpen ? "opacity-30 blur-xs transition duration-300 pointer-events-none" : "transition duration-300"}>
        
        {/* SECTION 1: Carousel Heroes */}
        <section id="home">
          <HeroCarousel
            onExploreMenu={() => handleNavigate("menu")}
            onReserveTable={() => handleNavigate("reservations")}
            onViewOffers={() => handleNavigate("offers")}
          />
        </section>

        {/* SECTION 2: Our Story / Welcome */}
        <AboutSection />

        {/* SPECIAL COMBOS & OFFERS PROMO BANNER BAR */}
        <div id="offers" className="py-20 bg-primary-brand text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full filter blur-3xl pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 space-y-4">
              <span className="text-xs font-button-lux uppercase tracking-[0.25em] text-accent-brand font-bold block">Exclusive Curation</span>
              <h3 className="text-3xl font-bold font-serif-lux">Family Combo Deals</h3>
              <p className="text-xs text-white/80 leading-relaxed font-sans">
                Experience luxury vegetarian combos designed to celebrate beautiful family gatherings. Crafted using pure ingredients.
              </p>
            </div>

            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Card 1 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-accent-brand font-bold uppercase block mb-1">Weekend Fest</span>
                  <h4 className="text-sm font-bold font-serif-lux text-white">Classic Haveli Thali</h4>
                  <p className="text-[10px] text-white/70 mt-1">2 Shahi Paneer, 1 Dal makhani, 4 Naan, Sweet Gulab Jamun.</p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-2 border-t border-white/10">
                  <span className="text-sm font-bold text-white">₹590 (Save 20%)</span>
                  <button
                    onClick={() => {
                      // Add thali items together
                      const j1 = menuItems.find(m => m.id === "m1"); // Shahi Paneer
                      const j2 = menuItems.find(m => m.id === "m2"); // Dal Makhani
                      const j3 = menuItems.find(m => m.id === "m12"); // Gulab Jamun
                      if (j1) handleAddToCart(j1, 2);
                      if (j2) handleAddToCart(j2, 1);
                      if (j3) handleAddToCart(j3, 1);
                    }}
                    className="py-1.5 px-3 bg-accent-brand hover:scale-105 text-primary-brand text-[10px] font-bold rounded-lg transition"
                  >
                    Select Combo
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-accent-brand font-bold uppercase block mb-1">Best-Seller</span>
                  <h4 className="text-sm font-bold font-serif-lux text-white">South Indian Festival Combo</h4>
                  <p className="text-[10px] text-white/70 mt-1">2 Gold Paper Dosa, 1 Savory Uttapam, 2 Lassis.</p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-2 border-t border-white/10">
                  <span className="text-sm font-bold text-white">₹460 (Save 15%)</span>
                  <button
                    onClick={() => {
                      const d1 = menuItems.find(m => m.id === "m4"); // Dosa
                      const d2 = menuItems.find(m => m.id === "m5"); // Uttapam
                      const d3 = menuItems.find(m => m.id === "m14"); // Lassi
                      if (d1) handleAddToCart(d1, 2);
                      if (d2) handleAddToCart(d2, 1);
                      if (d3) handleAddToCart(d3, 2);
                    }}
                    className="py-1.5 px-3 bg-accent-brand hover:scale-105 text-primary-brand text-[10px] font-bold rounded-lg transition"
                  >
                    Select Combo
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-accent-brand font-bold uppercase block mb-1">Sweet Treat</span>
                  <h4 className="text-sm font-bold font-serif-lux text-white">Royal Saffron Dessert Platter</h4>
                  <p className="text-[10px] text-white/70 mt-1">2 Gulab Jamun, 1 Halwa, 2 Shahi Lassis.</p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-2 border-t border-white/10">
                  <span className="text-sm font-bold text-white">₹380 (Save 18%)</span>
                  <button
                    onClick={() => {
                      const s1 = menuItems.find(m => m.id === "m12"); // Gulab Jamun
                      const s2 = menuItems.find(m => m.id === "m13"); // Halwa
                      const s3 = menuItems.find(m => m.id === "m14"); // Lassi
                      if (s1) handleAddToCart(s1, 2);
                      if (s2) handleAddToCart(s2, 1);
                      if (s3) handleAddToCart(s3, 2);
                    }}
                    className="py-1.5 px-3 bg-accent-brand hover:scale-105 text-primary-brand text-[10px] font-bold rounded-lg transition"
                  >
                    Select Platter
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* SECTION 4: Master Food Ordering */}
        <MenuSection
          menuItems={menuItems}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUpdateCartQuantity={handleUpdateCartQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={handleClearCart}
          onPlaceOrder={handlePlaceOrder}
          isCartOpen={isCartOpen}
          onCloseCart={() => setIsCartOpen(false)}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* SECTION 5: Table Seating Bookings */}
        <TableReservation onReserve={handleReserveTable} />

        {/* SECTION 6: Photo gallery visuals */}
        <GallerySection />

        {/* SECTION 7: Review Testimonials list */}
        <Testimonials reviews={reviews} onSubmitReview={handlePostReview} />

        {/* SECTION 10: Footer contact branding */}
        <Footer onNavigate={handleNavigate} />

      </div>

      {/* FLOATING EXPERT CHATBOT ASSISTANT */}
      <AiAssistant
        menuItems={menuItems}
        onAddToCart={handleAddToCart}
        cartItems={cartItems}
      />

    </div>
  );
}
