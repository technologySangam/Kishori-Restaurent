import React from "react";
import { DollarSign, ClipboardList, BookOpen, Star, Sparkles, TrendingUp, ShoppingBag, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { MenuItem, Order, Reservation, Review } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface AdminDashboardProps {
  orders: Order[];
  reservations: Reservation[];
  menuItems: MenuItem[];
  reviews: Review[];
  onUpdateOrderStatus: (id: string, status: any) => Promise<any>;
  onUpdateReservationStatus: (id: string, status: any) => Promise<any>;
  onAddMenuItem: (itemDetails: any) => Promise<any>;
  onEditMenuItem: (id: string, updatedDetails: any) => Promise<any>;
  onDeleteMenuItem: (id: string) => Promise<any>;
}

export default function AdminDashboard({
  orders,
  reservations,
  menuItems,
  reviews,
  onUpdateOrderStatus,
  onUpdateReservationStatus,
  onAddMenuItem,
  onEditMenuItem,
  onDeleteMenuItem,
}: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = React.useState<'orders' | 'reservations' | 'menu' | 'reports'>('orders');

  // Add Item Form State
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newItemName, setNewItemName] = React.useState("");
  const [newItemPrice, setNewItemPrice] = React.useState("");
  const [newItemCategory, setNewItemCategory] = React.useState<any>("North Indian");
  const [newItemDesc, setNewItemDesc] = React.useState("");
  const [newItemImage, setNewItemImage] = React.useState("");
  const [isPopular, setIsPopular] = React.useState(false);
  const [isChefSpecial, setIsChefSpecial] = React.useState(false);

  // Edit Pricing state
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = React.useState("");

  // Stats calculation
  const totalFinancials = orders.reduce((sum, o) => o.status === 'Delivered' ? sum + o.total : sum, 0);
  const totalPendingOrders = orders.filter(o => o.status === 'Pending').length;
  const activeTablesCount = reservations.filter(r => r.status === 'Confirmed').length;

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    try {
      await onAddMenuItem({
        name: newItemName,
        price: Number(newItemPrice),
        category: newItemCategory,
        description: newItemDesc,
        image: newItemImage || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600",
        isPopular,
        isChefSpecial
      });
      // reset
      setNewItemName("");
      setNewItemPrice("");
      setNewItemDesc("");
      setNewItemImage("");
      setIsPopular(false);
      setIsChefSpecial(false);
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert("Error adding menu item.");
    }
  };

  const handleSavePriceEdit = async (itemId: string) => {
    if (!editPriceVal || isNaN(Number(editPriceVal))) return;
    try {
      await onEditMenuItem(itemId, { price: Number(editPriceVal) });
      setEditingItemId(null);
      setEditPriceVal("");
    } catch (e) {
      console.error(e);
      alert("Failed to edit price.");
    }
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-[40px] border border-gray-100 max-w-5xl mx-auto space-y-8 shadow-sm">
      
      {/* Admin Executive Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-sm">
            🛡️
          </div>
          <div>
            <h3 className="text-xl font-extrabold font-serif-lux text-primary-brand leading-none">Administration Terminal</h3>
            <span className="text-[10px] text-text-secondary font-button-lux uppercase tracking-wider block pt-1.5">Kishori Control Desks</span>
          </div>
        </div>

        {/* Floating Quick Action Cards */}
        <div className="flex space-x-3 text-xs font-sans">
          {['orders', 'reservations', 'menu', 'reports'].map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubTab(sub as any)}
              className={`py-2 px-4 rounded-xl font-button-lux font-bold capitalize transition ${
                activeSubTab === sub
                  ? "bg-primary-brand text-accent-brand shadow-md"
                  : "bg-gray-100 hover:bg-gray-200 text-text-primary"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* METRIC CARDS ROW PANEL */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Earnings Card */}
        <div className="bg-gradient-to-br from-primary-brand to-primary-brand/90 text-white rounded-3xl p-6 shadow-sm border border-white/10 relative">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-button-lux tracking-wider text-accent-brand block">Total Earnings (Delivered)</span>
            <h4 className="text-3xl font-black font-serif-lux">₹{totalFinancials}</h4>
            <div className="flex items-center space-x-1 text-emerald-300 text-[10px]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Pratapgarh Leaderboard</span>
            </div>
          </div>
          <DollarSign className="w-10 h-10 absolute bottom-6 right-6 text-white/5" />
        </div>

        {/* Pending Orders Card */}
        <div className="bg-amber-50 rounded-3xl p-6 shadow-xs border border-amber-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-button-lux tracking-wider text-amber-800 block">Pending Orders Alert</span>
            <h4 className="text-3xl font-black font-serif-lux text-primary-brand">{totalPendingOrders}</h4>
            <span className="text-[10px] text-text-secondary block">Direct dispatch kitchen pipeline</span>
          </div>
          <ClipboardList className="w-10 h-10 text-amber-700/10" />
        </div>

        {/* Seated Tables Card */}
        <div className="bg-emerald-50 rounded-3xl p-6 shadow-xs border border-emerald-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-button-lux tracking-wider text-emerald-800 block">Active Reserved Tables</span>
            <h4 className="text-3xl font-black font-serif-lux text-primary-brand">{activeTablesCount}</h4>
            <span className="text-[10px] text-text-secondary block font-sans">Host VIP floor seating</span>
          </div>
          <BookOpen className="w-10 h-10 text-emerald-600/10" />
        </div>

      </div>

      {/* SELECTED TAB VIEWPORT OPERATIONS */}
      <div className="min-h-96">
        
        {/* TAB 1: ORDER LOG MANAGEMENT */}
        {activeSubTab === 'orders' && (
          <div className="space-y-4 font-sans text-xs text-text-primary">
            <h4 className="font-bold text-sm text-primary-brand font-serif-lux pb-2 border-b border-gray-150">
              Accept/Reject Incoming Live Orders
            </h4>

            {orders.map((ord) => (
              <div key={ord.id} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3.5">
                    <span className="font-bold text-primary-brand text-xs">#{ord.id}</span>
                    <span className="text-[10px] text-text-secondary">{ord.customerName} | {ord.customerPhone}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      ord.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.status}
                    </span>
                  </div>

                  <p className="font-bold text-text-primary text-xs">
                    {ord.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}
                  </p>
                  
                  <p className="text-[11px] text-text-secondary italic">📍 Deliver to: {ord.deliveryAddress}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 shrink-0 self-stretch md:self-auto justify-end">
                  {ord.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, 'Rejected')}
                        className="px-3.5 py-2 hover:bg-red-100 hover:text-red-700 text-gray-500 rounded-lg font-bold flex items-center space-x-1 border border-gray-200 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, 'Accepted')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center space-x-1.5 transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Order</span>
                      </button>
                    </>
                  )}

                  {ord.status === 'Accepted' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Preparing')}
                      className="px-4 py-2 bg-primary-brand text-white hover:bg-opacity-90 rounded-lg font-bold transition"
                    >
                      ✓ Start Preparing
                    </button>
                  )}

                  {ord.status === 'Preparing' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Out for Delivery')}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-opacity-90 font-bold transition"
                    >
                      🚚 Dispatch Rider
                    </button>
                  )}

                  {ord.status === 'Out for Delivery' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Delivered')}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-opacity-90 transition"
                    >
                      ✓ Hand Over (Delivered)
                    </button>
                  )}

                  {ord.status === 'Delivered' && (
                    <p className="text-[10px] text-emerald-700 font-semibold italic flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Earnings credited</span>
                    </p>
                  )}
                  {ord.status === 'Rejected' && <p className="text-[10px] text-red-500 italic">Cancelled</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: TABLE BOOKINGS DISPATCH */}
        {activeSubTab === 'reservations' && (
          <div className="space-y-4 font-sans text-xs text-text-primary">
            <h4 className="font-bold text-sm text-primary-brand font-serif-lux pb-2 border-b border-gray-150">
              Hostess Table Seating Booker (Pending Reservations)
            </h4>

            {reservations.map((res) => (
              <div key={res.id} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-primary-brand">Booking #{res.id}</span>
                    <span className="text-[10px] text-text-secondary">{res.phone}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold text-text-primary ${
                      res.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      res.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {res.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold font-serif-lux text-text-primary">
                    Patron {res.name} — {res.guests} seats on {res.date} at {res.time}
                  </p>
                  {res.notes && <p className="text-[11px] text-text-secondary italic">"Special: {res.notes}"</p>}
                </div>

                <div className="flex gap-2 self-stretch md:self-auto justify-end shrink-0">
                  {res.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => onUpdateReservationStatus(res.id, 'Cancelled')}
                        className="px-3.5 py-2 border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => onUpdateReservationStatus(res.id, 'Confirmed')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                      >
                        ✓ Confirm Allocation
                      </button>
                    </>
                  )}
                  {res.status === 'Confirmed' && (
                    <button
                      onClick={() => onUpdateReservationStatus(res.id, 'Completed')}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-text-primary rounded-lg transition"
                    >
                      Close Booking (Completed)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: PRODUCT MENU MANAGER */}
        {activeSubTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h4 className="font-bold text-sm text-primary-brand font-serif-lux">
                Manage Menu Offerings
              </h4>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-primary-brand text-accent-brand font-button-lux font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? "Close Form" : "Create New Dish"}</span>
              </button>
            </div>

            {/* Expandable Add Dish Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleCreateMenuItem}
                  className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-text-primary"
                >
                  <div className="space-y-1">
                    <label className="font-bold block text-text-secondary">Dish Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Kashmiri Dum Aloo"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-3.5 py-2 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold block text-text-secondary">Pricing (INR) *</label>
                    <input
                      required
                      type="number"
                      placeholder="e.g. 210"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-3.5 py-2 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold block text-text-secondary">Menu Category *</label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value as any)}
                      className="w-full bg-white border border-gray-200 px-3.5 py-2 rounded-xl focus:outline-none"
                    >
                      <option value="North Indian">North Indian</option>
                      <option value="South Indian">South Indian</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Tandoori">Tandoori</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold block text-text-secondary">Image Unsplash URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={newItemImage}
                      onChange={(e) => setNewItemImage(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-3.5 py-2 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold block text-text-secondary">Short Gastronomy Description</label>
                    <textarea
                      rows={2}
                      placeholder="Describe flavours, ingredients weight, spices, serving style details..."
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-3.5 py-2 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex gap-6 pt-2 font-bold">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPopular}
                        onChange={(e) => setIsPopular(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-0"
                      />
                      <span>Mark Best-Seller (Popular)</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChefSpecial}
                        onChange={(e) => setIsChefSpecial(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-0"
                      />
                      <span>Chef's Signature Collection</span>
                    </label>
                  </div>

                  <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-gray-150 rounded-xl hover:bg-gray-250 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-emerald-600 text-white font-button-lux font-bold rounded-xl hover:bg-emerald-700 transition"
                    >
                      Save Product
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Render Scrollable Products List with Fast Price Edit */}
            <div className="space-y-3 font-sans text-xs">
              {menuItems.map((item) => (
                <div key={item.id} className="p-3.5 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                    <div>
                      <h4 className="font-bold text-text-primary text-xs leading-none">{item.name}</h4>
                      <p className="text-[10px] text-text-secondary pt-1 font-semibold">{item.category} | Rating: ★{item.rating}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {editingItemId === item.id ? (
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="number"
                          value={editPriceVal}
                          onChange={(e) => setEditPriceVal(e.target.value)}
                          className="w-16 bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none"
                          placeholder="INR"
                        />
                        <button
                          onClick={() => handleSavePriceEdit(item.id)}
                          className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingItemId(null)}
                          className="p-1.5 border border-gray-200 text-gray-400 rounded hover:bg-gray-100"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-4 items-center font-bold">
                        <span className="text-primary-brand text-xs">₹{item.price}</span>
                        <button
                          onClick={() => {
                            setEditingItemId(item.id);
                            setEditPriceVal(String(item.price));
                          }}
                          className="p-1.5 bg-white text-gray-500 border border-gray-150 rounded-lg hover:bg-gray-50 text-xs shrink-0"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => onDeleteMenuItem(item.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: REVENUE ANALYTICS & REPORTS */}
        {activeSubTab === 'reports' && (
          <div className="space-y-6">
            <h4 className="font-bold text-sm text-primary-brand font-serif-lux pb-2 border-b border-gray-100">
              Kitchen Performance Reports
            </h4>

            {/* Custom Interactive SVG stats for highest-end visual fidelity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              
              {/* Box 1: Sales Splits */}
              <div className="bg-bg-brand/40 p-6 rounded-3xl border border-gray-100 text-xs font-sans">
                <span className="font-bold text-primary-brand">Sales Distribution By Cuisine</span>
                <p className="text-[10px] text-text-secondary mt-1">Real-time revenue percentages share</p>

                {/* Bar Metrics SVG representation */}
                <div className="space-y-4 mt-6">
                  <div>
                    <div className="flex justify-between font-bold text-[10px] mb-1">
                      <span>North Indian Specialties</span>
                      <span>55% Demand</span>
                    </div>
                    <div className="w-full bg-gray-150 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-primary-brand h-full rounded-full" style={{ width: "55%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-[10px] mb-1">
                      <span>South Indian temple-style Crepes</span>
                      <span>25% Demand</span>
                    </div>
                    <div className="w-full bg-gray-150 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: "25%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-[10px] mb-1">
                      <span>Sizzling Chinese Platters</span>
                      <span>15% Demand</span>
                    </div>
                    <div className="w-full bg-gray-150 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-accent-brand h-full rounded-full" style={{ width: "15%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-[10px] mb-1">
                      <span>Desserts & Royal Lassi Shakes</span>
                      <span>12% Demand</span>
                    </div>
                    <div className="w-full bg-gray-150 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: "12%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Review Analytics */}
              <div className="bg-bg-brand/40 p-6 rounded-3xl border border-gray-100 space-y-4">
                <div className="flex justify-between items-center text-xs font-sans">
                  <span className="font-bold text-primary-brand">Latest Reviews Auditing</span>
                  <p className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-1">
                    <span>★ 4.86 Average</span>
                  </p>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-3 bg-white rounded-xl border border-gray-100 text-[10px] space-y-1">
                      <div className="flex justify-between font-bold text-[10px]">
                        <span>{rev.author}</span>
                        <div className="flex text-accent-brand">
                          {Array.from({ length: rev.rating }).map((_, i) => <span key={i}>★</span>)}
                        </div>
                      </div>
                      <p className="text-text-secondary leading-relaxed font-sans line-clamp-2">"{rev.text}"</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
