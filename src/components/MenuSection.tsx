import React from "react";
import { Search, Star, MessageSquareCode, ShoppingCart, ShoppingBag, Eye, X, Plus, Minus, Tag, MapPin, Truck, AlertCircle, Sparkles, Check } from "lucide-react";
import { MenuItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface MenuSectionProps {
  menuItems: MenuItem[];
  cartItems: any[];
  onAddToCart: (item: MenuItem, quantity?: number) => void;
  onUpdateCartQuantity: (itemId: string, delta: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (orderDetails: any) => Promise<any>;
  isCartOpen: boolean;
  onCloseCart: () => void;
  onOpenCart: () => void;
}

const CATEGORIES = [
  "All",
  "North Indian",
  "South Indian",
  "Chinese",
  "Tandoori",
  "Snacks",
  "Desserts",
  "Beverages",
];

const AVAILABLE_COUPONS = [
  { code: "WELCOME100", discount: 100, isPercent: false, description: "Flat ₹100 Off on orders above ₹400", min: 400 },
  { code: "FAMILY15", discount: 15, isPercent: true, description: "15% Off on premium orders above ₹700", min: 700 }
];

function highlightText(text: string, query: string) {
  if (!query || !query.trim()) {
    return <>{text}</>;
  }

  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, idx) =>
        regex.test(part) ? (
          <mark
            key={idx}
            className="bg-accent-brand/40 text-primary-brand font-extrabold rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function MenuSection({
  menuItems,
  cartItems,
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onClearCart,
  onPlaceOrder,
  isCartOpen,
  onCloseCart,
  onOpenCart,
}: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Quick View Modal State
  const [quickViewItem, setQuickViewItem] = React.useState<MenuItem | null>(null);

  // Checkout form State
  const [isCheckouting, setIsCheckouting] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<any>(null);
  const [couponError, setCouponError] = React.useState("");
  const [couponSuccess, setCouponSuccess] = React.useState("");

  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");
  const [deliveryAddress, setDeliveryAddress] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<'Cash on Delivery' | 'Card Online' | 'UPI'>('Cash on Delivery');
  
  const [isPlacing, setIsPlacing] = React.useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = React.useState<any>(null);

  // Track live order status states (simulation values)
  const [activeTrackingOrder, setActiveTrackingOrder] = React.useState<any>(null);

  // Filters logic
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularDishes = menuItems.filter((m) => m.isPopular).slice(0, 4);
  const chefSpecials = menuItems.filter((m) => m.isChefSpecial).slice(0, 3);

  // Calculations
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const deliveryCharge = cartSubtotal > 500 ? 0 : 40; // Free delivery above 500
  const taxRate = 0.05; // 5% GST
  const estimatedTax = Math.round(cartSubtotal * taxRate);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.isPercent) {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discount) / 100);
    } else {
      discountAmount = appliedCoupon.discount;
    }
  }

  const grandTotal = Math.max(0, cartSubtotal + estimatedTax + deliveryCharge - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    
    const codeUpper = couponCode.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find(c => c.code === codeUpper);
    
    if (!coupon) {
      setCouponError("Invalid promo code. Please try WELCOME100 or FAMILY15.");
      setAppliedCoupon(null);
      return;
    }

    if (cartSubtotal < coupon.min) {
      setCouponError(`Min order value to apply ${coupon.code} is ₹${coupon.min}. Add more tasty items!`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponSuccess(`Successfully applied promo '${coupon.code}'!`);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !deliveryAddress) {
      alert("Please specify Name, Phone number, and accurate Delivery Address.");
      return;
    }
    
    setIsPlacing(true);
    try {
      const orderData = {
        items: cartItems.map(c => ({
          itemId: c.id,
          name: c.name,
          price: c.price,
          quantity: c.quantity,
          category: c.category
        })),
        subtotal: cartSubtotal,
        tax: estimatedTax,
        deliveryCharge,
        discount: discountAmount,
        total: grandTotal,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        couponCode: appliedCoupon?.code || "",
        paymentMethod
      };

      const result = await onPlaceOrder(orderData);
      setLastPlacedOrder(result);
      setActiveTrackingOrder(result);
      onClearCart();
      setIsCheckouting(false);
      setAppliedCoupon(null);
      setCouponCode("");
    } catch (err) {
      console.error(err);
      alert("Failed to submit order. Please check connection.");
    } finally {
      setIsPlacing(false);
    }
  };

  // Helper to trigger fast mock tracking pipeline
  const getTrackingProgressWidth = (status: string) => {
    switch (status) {
      case 'Pending': return '20%';
      case 'Accepted': return '40%';
      case 'Preparing': return '60%';
      case 'Out for Delivery': return '85%';
      case 'Delivered': return '100%';
      default: return '10%';
    }
  };

  return (
    <section id="menu" className="py-24 bg-white relative">
      
      {/* POPULAR DISHES CORNER */}
      <div id="popular" className="py-12 bg-bg-brand/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-lg mx-auto space-y-3 mb-12">
            <span className="text-xs font-button-lux tracking-[0.25em] text-accent-brand uppercase font-bold">Best Selling Favorites</span>
            <h3 className="text-2xl sm:text-4xl font-extrabold font-serif-lux text-primary-brand">Popular Dishes</h3>
            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              Highly requested pure-veg signatures loved by our local Pratapgarh families.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularDishes.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -6, boxShadow: "0 10px 25px -5px rgba(15,76,92,0.15)" }}
                className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 flex flex-col relative group"
              >
                {/* Image layout */}
                <div className="h-48 overflow-hidden relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute top-4 left-4 bg-emerald-600/90 text-white font-button-lux text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                    <span>Veg</span>
                  </div>
                  {item.isChefSpecial && (
                    <div className="absolute top-4 right-4 bg-accent-brand text-primary-brand font-button-lux text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Chef Spec
                    </div>
                  )}
                </div>

                {/* Info block */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent-brand">{item.category}</span>
                      <div className="flex items-center space-x-1 py-0.5 px-2 bg-amber-50 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-accent-brand text-accent-brand" />
                        <span className="text-xs text-text-primary font-bold">{item.rating}</span>
                      </div>
                    </div>
                    <h4 className="text-base font-bold font-serif-lux text-primary-brand mb-1 line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-text-secondary font-sans line-clamp-2 leading-relaxed mb-4">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-lg font-extrabold text-primary-brand">₹{item.price}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        id={`pop-qv-${item.id}`}
                        onClick={() => setQuickViewItem(item)}
                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition cursor-pointer"
                        title="Quick View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        id={`pop-add-${item.id}`}
                        onClick={() => onAddToCart(item)}
                        className="py-2 px-4 bg-primary-brand hover:bg-primary-brand/90 hover:scale-105 text-white font-button-lux text-xs font-bold rounded-xl flex items-center space-x-1 transition cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-accent-brand" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FULL ONLINE ORDERING SYSTEM */}
      <div id="order-online" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        
        {/* Title portion */}
        <div className="text-center max-w-lg mx-auto space-y-3 mb-12">
          <span className="text-xs font-button-lux tracking-[0.25em] text-accent-brand uppercase font-bold">Curated Masterpiece Menu</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-lux text-primary-brand">Kishori Fresh-Menu</h2>
          <p className="text-xs text-text-secondary font-sans leading-relaxed">
            Search foods, apply categories, customize cart, and order steam-hot veggie treats instantly.
          </p>
        </div>

        {/* Filters and Search Bar Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
          
          {/* Category Scroller */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 px-4 rounded-full text-xs font-button-lux font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary-brand text-accent-brand shadow-md"
                    : "bg-gray-100 hover:bg-gray-200 text-text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box item */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search dishes (e.g. Dosa, Naan, Paneer)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-primary-brand/35 text-text-primary"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* ACTIVE MENU GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex space-x-4 items-center hover:shadow-lg transition group relative"
              >
                {/* Thumb image */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative bg-gray-50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute top-1 left-1.5 w-3 h-3 bg-white border border-emerald-600 flex items-center justify-center rounded">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                  </div>
                </div>

                {/* Food content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between min-w-0 mb-1">
                    <h4 className="text-sm font-bold font-serif-lux text-text-primary truncate pr-2 group-hover:text-primary-brand transition">
                      {highlightText(item.name, searchQuery)}
                    </h4>
                    <span className="text-xs font-extrabold text-primary-brand whitespace-nowrap shrink-0">₹{item.price}</span>
                  </div>
                  
                  <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed mb-3 pr-2">
                    {highlightText(item.description, searchQuery)}
                  </p>

                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center space-x-1.5">
                      <Star className="w-3 h-3 fill-accent-brand text-accent-brand" />
                      <span className="text-[11px] font-bold text-gray-700">{item.rating}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setQuickViewItem(item)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onAddToCart(item)}
                        className="py-1 px-3.5 bg-primary-brand hover:bg-primary-brand/90 hover:scale-105 text-white font-button-lux text-[10px] rounded-lg transition font-semibold"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400">
              <AlertCircle className="w-8 h-8 mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-semibold font-serif-lux">No delicious vegetarian dishes match your search.</p>
              <p className="text-xs text-gray-400 mt-1">Try other search variations or click other categories above.</p>
            </div>
          )}
        </div>

        {/* CHEF SPECIALS GRID (LARGE DESIGN CARDS) */}
        <div id="chef-specials" className="mt-28 bg-primary-brand rounded-[40px] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full filter blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-4 space-y-6">
              <span className="text-xs font-button-lux tracking-widest text-accent-brand uppercase font-bold block">
                Handcrafted Masterpieces
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold font-serif-lux text-white leading-tight">
                Chef's Signature Vegetarian Collection
              </h3>
              <p className="text-xs leading-relaxed text-white/80 font-sans">
                Curated by our master culinary expert, these limited-special items employ secret home-roasted spice masalas and traditional clay-pot techniques. Perfect with rich lassi!
              </p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="px-6 py-3 bg-accent-brand hover:bg-accent-brand/95 text-primary-brand font-button-lux font-bold rounded-xl text-xs transition uppercase tracking-wider"
              >
                View Full Menu
              </button>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {chefSpecials.map((dish) => (
                <div key={dish.id} className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10 flex flex-col justify-between h-80">
                  <div className="space-y-4">
                    <img src={dish.image} alt={dish.name} className="w-full h-32 object-cover rounded-2xl" />
                    <div>
                      <h4 className="text-sm font-bold font-serif-lux text-accent-brand tracking-wide">{dish.name}</h4>
                      <p className="text-[10px] text-white/70 line-clamp-2 mt-1 leading-relaxed">{dish.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                    <span className="text-sm font-extrabold text-white">₹{dish.price}</span>
                    <button
                      onClick={() => onAddToCart(dish)}
                      className="p-2 bg-accent-brand hover:bg-accent-brand/90 hover:scale-110 rounded-xl text-primary-brand transition"
                    >
                      <Plus className="w-4 h-4 font-bold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* QUICK VIEW DETAILS MODAL */}
      <AnimatePresence>
        {quickViewItem && (
          <div className="fixed inset-0 bg-primary-brand/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setQuickViewItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 z-10 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-full min-h-64">
                  <img src={quickViewItem.image} alt={quickViewItem.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent-brand">{quickViewItem.category}</span>
                      <div className="flex items-center space-x-1 py-0.5 px-2 bg-amber-50 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-accent-brand text-accent-brand" />
                        <span className="text-xs text-text-primary font-bold">{quickViewItem.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold font-serif-lux text-primary-brand">{quickViewItem.name}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">{quickViewItem.description}</p>
                    
                    <div className="bg-bg-brand p-3.5 rounded-2xl space-y-1 border border-gray-100 text-[10px]">
                      <p className="font-semibold text-emerald-700">🌱 100% Pure Vegetarian Prep</p>
                      <p className="text-text-secondary">High sanitation, prepared under dairy-safe conditions with pure butter/ghee.</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] text-text-secondary uppercase tracking-wider">Premium Price</p>
                      <span className="text-2xl font-extrabold text-primary-brand">₹{quickViewItem.price}</span>
                    </div>
                    <button
                      onClick={() => {
                        onAddToCart(quickViewItem);
                        setQuickViewItem(null);
                      }}
                      className="px-6 py-3.5 bg-primary-brand hover:bg-primary-brand/90 text-white font-button-lux font-semibold text-xs rounded-xl flex items-center space-x-2 shadow-lg transition"
                    >
                      <ShoppingCart className="w-4 h-4 text-accent-brand" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ONLINE CART & CHECKOUT SIDEBAR DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            
            {/* Backdrop trigger */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onCloseCart}
              className="absolute inset-0 bg-primary-brand/40 backdrop-blur-xs"
            />

            {/* Main drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
            >
              
              {/* Header block */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary-brand text-white">
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-5 h-5 text-accent-brand" />
                  <div>
                    <h3 className="font-bold font-serif-lux text-base">Your Culinary Cart</h3>
                    <p className="text-[10px] text-white/70">{cartItems.length} items in selection</p>
                  </div>
                </div>
                <button
                  onClick={onCloseCart}
                  className="p-2 hover:bg-white/10 rounded-full transition text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body - Split based on Checkouting state */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Simulated Order Notification Banner if just checkout placed */}
                {activeTrackingOrder && (
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></div>
                      <p className="text-xs font-bold text-emerald-800">Tracking Active Order {activeTrackingOrder.id}</p>
                    </div>

                    <div className="text-[11px] space-y-1.5 font-sans">
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-500">Preparation Stage:</span>
                        <span className="text-primary-brand font-bold uppercase tracking-wider">{activeTrackingOrder.status}</span>
                      </div>
                      
                      {/* Visual progress line */}
                      <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full transition-all duration-1000"
                          style={{ width: getTrackingProgressWidth(activeTrackingOrder.status) }}
                        />
                      </div>

                      <div className="text-[10px] text-text-secondary">
                        Delivery address: {activeTrackingOrder.deliveryAddress}
                      </div>
                    </div>
                  </div>
                )}

                {!isCheckouting ? (
                  <>
                    {/* Cart Items list view */}
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                          <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold font-serif-lux text-text-primary truncate">{item.name}</h4>
                            <p className="text-[11px] text-text-secondary mt-0.5">₹{item.price}</p>
                          </div>

                          {/* Incrementor */}
                          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-100">
                            <button
                              onClick={() => onUpdateCartQuantity(item.id, -1)}
                              className="p-1 hover:bg-gray-100 rounded text-gray-400"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-text-primary px-1">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateCartQuantity(item.id, 1)}
                              className="p-1 hover:bg-gray-100 rounded text-gray-400"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() => onRemoveFromCart(item.id)}
                            className="p-1.5 text-gray-300 hover:text-red-500 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {cartItems.length === 0 && (
                        <div className="py-20 text-center text-gray-400 space-y-3">
                          <ShoppingBag className="w-12 h-12 mx-auto text-gray-200" />
                          <p className="text-sm font-semibold font-serif-lux">Your gourmet cart is empty.</p>
                          <p className="text-xs text-text-secondary">Explore the dishes list and tap Add to Cart!</p>
                        </div>
                      )}
                    </div>

                    {/* Coupons Promo Block */}
                    {cartItems.length > 0 && (
                      <div className="bg-bg-brand p-5 rounded-2xl border border-gray-100 space-y-3">
                        <div className="flex items-center space-x-2">
                          <Tag className="w-4 h-4 text-accent-brand" />
                          <h4 className="text-xs font-bold text-primary-brand font-serif-lux">Apply Coupon Code</h4>
                        </div>
                        
                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. WELCOME100"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none uppercase"
                          />
                          <button
                            type="submit"
                            className="bg-primary-brand text-accent-brand hover:bg-primary-brand/90 font-button-lux font-bold text-[10px] px-4 py-2 rounded-xl transition"
                          >
                            Apply
                          </button>
                        </form>

                        {couponError && <p className="text-[10px] text-red-600 font-sans">{couponError}</p>}
                        {couponSuccess && <p className="text-[10px] text-emerald-600 font-semibold font-sans">{couponSuccess}</p>}
                        
                        <div className="space-y-1">
                          <p className="text-[9px] text-text-secondary font-medium uppercase tracking-wider">Live Offers:</p>
                          <p className="text-[10px] text-gray-600 font-sans">🎉 **WELCOME100**: Save ₹100 on orders above ₹400</p>
                          <p className="text-[10px] text-gray-600 font-sans">👪 **FAMILY15**: Save 15% on orders above ₹700</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* CHECKOUT FORM VIEW */
                  <form onSubmit={handleCreateOrder} className="space-y-5 font-sans text-xs text-text-primary">
                    <h4 className="font-bold text-sm text-primary-brand font-serif-lux pb-2 border-b border-gray-100">
                      Safe Delivery Details
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block font-medium text-text-secondary mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Govind Maurya"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-brand/30"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-text-secondary mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="e.g. 08052777728"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-brand/30"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-text-secondary mb-1">Email (Optional)</label>
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="mauryagovindg5@gmail.com"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-text-secondary mb-1">Detailed Delivery Address *</label>
                        <textarea
                          required
                          rows={3}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Bela Near Chowk, Pratapgarh, Uttar Pradesh - 230001"
                          className="w-full bg-gray-50 border border-gray-200  rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-text-secondary mb-1">Payment Method</label>
                        <select
                          value={paymentMethod}
                          onChange={(e: any) => setPaymentMethod(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                        >
                          <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                          <option value="UPI">Pay via UPI (GPay/PhonePe)</option>
                          <option value="Card Online">Credit / Debit Card</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCheckouting(false)}
                        className="w-1/2 py-3 border border-gray-200 rounded-xl text-center text-text-secondary hover:bg-gray-50 font-button-lux font-semibold transition"
                      >
                        Back to Cart
                      </button>
                      <button
                        type="submit"
                        disabled={isPlacing}
                        className="w-1/2 py-3 bg-primary-brand text-accent-brand hover:bg-primary-brand/90 font-button-lux font-bold rounded-xl text-center transition"
                      >
                        {isPlacing ? "Placing Order..." : `Pay ₹${grandTotal}`}
                      </button>
                    </div>
                  </form>
                )}

              </div>

              {/* Drawer Footer Calculations (Always present if items exist and in cart screen) */}
              {cartItems.length > 0 && !isCheckouting && (
                <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                  <div className="space-y-1.5 text-xs text-text-secondary font-sans font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="text-text-primary font-bold">₹{cartSubtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST Tax (5%):</span>
                      <span className="text-text-primary font-bold">₹{estimatedTax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge:</span>
                      <span className="text-text-primary font-extrabold text-emerald-700">
                        {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                      </span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Coupon Savings ({appliedCoupon.code}):</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-200 flex justify-between text-sm text-primary-brand font-black">
                      <span>Total Amount:</span>
                      <span className="text-lg text-primary-brand font-serif-lux">₹{grandTotal}</span>
                    </div>
                  </div>

                  <button
                    id="checkout-trigger-btn"
                    onClick={() => {
                      setCustomerName("Govind Maurya");
                      setCustomerPhone("08052777728");
                      setDeliveryAddress("Bela, Pratapgarh, Uttar Pradesh 230001");
                      setIsCheckouting(true);
                    }}
                    className="w-full py-4 gold-gradient text-primary-brand font-button-lux font-bold rounded-xl text-sm shadow-md hover:scale-[1.02] transition cursor-pointer text-center"
                  >
                    Proceed to Delivery
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
