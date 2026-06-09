import React from "react";
import { User, MapPin, Award, History, Ticket, Download, X, Printer, CheckCircle, Clock, FileText, RotateCcw } from "lucide-react";
import { Order, Reservation, UserProfile } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { downloadInvoicePDF } from "../utils/pdfGenerator";

interface CustomerDashboardProps {
  orders: Order[];
  reservations: Reservation[];
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onRepeatOrder: (order: Order) => void;
}

export default function CustomerDashboard({
  orders,
  reservations,
  profile,
  onUpdateProfile,
  onRepeatOrder,
}: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = React.useState<'orders' | 'reservations' | 'profile'>('orders');
  
  // Invoice details state
  const [selectedInvoice, setSelectedInvoice] = React.useState<Order | null>(null);

  // Status Filter State for Order History
  const [statusFilter, setStatusFilter] = React.useState<string>("All");

  const filteredOrders = React.useMemo(() => {
    if (statusFilter === "All") {
      return orders;
    }
    return orders.filter(ord => ord.status === statusFilter);
  }, [orders, statusFilter]);

  // Profile Edit State
  const [isEditingAddress, setIsEditingAddress] = React.useState(false);
  const [newAddress, setNewAddress] = React.useState("");

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    onUpdateProfile({
      ...profile,
      addresses: [...profile.addresses, newAddress.trim()]
    });
    setNewAddress("");
    setIsEditingAddress(false);
  };

  const printReceipt = (ord: Order) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    const itemsHtml = ord.items.map(itm => `
      <tr style="border-bottom: 1px dashed #eee;">
        <td style="padding: 8px 0; font-size: 12px; font-family: sans-serif;">${itm.name}</td>
        <td style="padding: 8px 0; font-size: 12px; font-family: sans-serif; text-align: center;">${itm.quantity}</td>
        <td style="padding: 8px 0; font-size: 12px; font-family: sans-serif; text-align: right; font-weight: bold;">₹${itm.price * itm.quantity}</td>
      </tr>
    `).join("");

    const discountRow = ord.discount > 0 ? `
      <tr>
        <td colspan="2" style="padding: 4px 0; font-size: 11px; color: #16a34a; font-family: sans-serif;">Promo Discount (${ord.couponCode || 'PROMO'}):</td>
        <td style="padding: 4px 0; font-size: 11px; color: #16a34a; font-family: sans-serif; text-align: right; font-weight: bold;">-₹${ord.discount}</td>
      </tr>
    ` : '';

    const htmlContent = `
      <html>
        <head>
          <title>Receipt_Order_${ord.id}</title>
          <style>
            @media print {
              body { margin: 0; padding: 10px; color: #000; background-color: #fff; }
              @page { size: auto; margin: 0mm; }
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
              max-width: 320px;
              margin-left: auto;
              margin-right: auto;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 15px;
              margin-bottom: 15px;
            }
            .title {
              font-size: 18px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin: 0;
              color: #111;
            }
            .subtitle {
              font-size: 10px;
              color: #666;
              margin: 4px 0 0 0;
            }
            .meta-table {
              width: 100%;
              margin-bottom: 15px;
              font-size: 11px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            .meta-table td {
              padding: 3px 0;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            .items-table th {
              border-bottom: 1px solid #111;
              padding: 6px 0;
              font-size: 11px;
              text-transform: uppercase;
              text-align: left;
            }
            .totals-table {
              width: 100%;
              border-top: 1px solid #111;
              padding-top: 10px;
              margin-bottom: 20px;
              font-size: 11px;
            }
            .totals-table td {
              padding: 4px 0;
            }
            .grand-total {
              font-size: 14px;
              font-weight: bold;
              border-top: 1px dashed #000;
              padding-top: 6px;
              margin-top: 6px;
            }
            .footer {
              text-align: center;
              font-size: 10px;
              color: #555;
              border-top: 2px dashed #000;
              padding-top: 15px;
              margin-top: 15px;
            }
            .cert {
              color: #15803d;
              font-weight: bold;
              margin-bottom: 4px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <p class="title">Kishori Restaurant</p>
            <p class="subtitle">100% Pure Vegetarian Family Restaurant</p>
            <p class="subtitle">Bela, Pratapgarh, Uttar Pradesh 230001</p>
            <p class="subtitle" style="font-weight: bold; margin-top: 6px; letter-spacing: 0.5px;">INVOICE OFFICIAL RECEIPT</p>
          </div>

          <table class="meta-table">
            <tr>
              <td><strong>Order ID:</strong> #${ord.id}</td>
              <td style="text-align: right;"><strong>Customer:</strong> ${ord.customerName}</td>
            </tr>
            <tr>
              <td><strong>Date:</strong> ${new Date(ord.createdAt).toLocaleString()}</td>
              <td style="text-align: right;"><strong>Phone:</strong> ${ord.customerPhone}</td>
            </tr>
            <tr>
              <td><strong>Payment:</strong> ${ord.paymentMethod}</td>
              <td style="text-align: right;"><strong>Status:</strong> ${ord.status}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding-top: 4px;"><strong>Address:</strong> ${ord.deliveryAddress}</td>
            </tr>
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 60%;">Menu Item</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 25%; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td colspan="2">Subtotal:</td>
              <td style="text-align: right;">₹${ord.subtotal}</td>
            </tr>
            <tr>
              <td colspan="2">GST Tax (5%):</td>
              <td style="text-align: right;">₹${ord.tax}</td>
            </tr>
            <tr>
              <td colspan="2">Delivery Charges:</td>
              <td style="text-align: right;">${ord.deliveryCharge === 0 ? "FREE" : `₹${ord.deliveryCharge}`}</td>
            </tr>
            ${discountRow}
            <tr class="grand-total">
              <td colspan="2" style="font-weight: bold;">Grand Total:</td>
              <td style="text-align: right; font-weight: bold;">₹${ord.total}</td>
            </tr>
          </table>

          <div class="footer">
            <p class="cert">✓ Certified 100% Pure Vegetarian Culinary Experience</p>
            <p>For support or feedback, please contact us at 08052777728.</p>
            <p style="margin-top: 8px; font-weight: bold;">Thank you for dining with Kishori!</p>
          </div>

          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.parent.document.body.removeChild(window.frameElement);
              }, 1000);
            };
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
  };

  const handlePrint = () => {
    if (selectedInvoice) {
      printReceipt(selectedInvoice);
    } else {
      window.print();
    }
  };

  return (
    <div className="bg-bg-brand/10 p-4 sm:p-8 rounded-[40px] border border-gray-100 max-w-5xl mx-auto space-y-8 shadow-sm">
      
      {/* Dynamic welcome header with loyal points display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-primary-brand text-white p-8 rounded-[32px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full filter blur-3xl pointer-events-none"></div>
        
        {/* Profile Card */}
        <div className="md:col-span-8 space-y-4 flex items-center space-x-6">
          <div className="w-16 h-16 rounded-full bg-accent-brand text-primary-brand flex items-center justify-center text-2xl font-serif-lux font-bold shrink-0">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <span className="text-xs font-button-lux tracking-widest text-accent-brand uppercase font-semibold">Gourmet Patron Portal</span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-serif-lux">{profile.name}</h3>
            <p className="text-xs text-white/70 font-sans">{profile.email} | {profile.phone}</p>
          </div>
        </div>

        {/* Loyalty Points display */}
        <div className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-accent-brand uppercase tracking-wider font-bold">Kishori loyalty Points</p>
            <h4 className="text-3xl font-extrabold text-white font-serif-lux">{profile.loyaltyPoints}</h4>
            <p className="text-[9px] text-white/60 font-sans">1 point = ₹0.50 cash savings</p>
          </div>
          <Award className="w-10 h-10 text-accent-brand" />
        </div>
      </div>

      {/* Controller tabs */}
      <div className="flex border-b border-gray-200 gap-6 pb-2">
        {(['orders', 'reservations', 'profile'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 text-sm font-button-lux font-bold capitalize transition relative ${
              activeTab === tab ? "text-primary-brand font-black" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab === "orders" ? "My Orders" : tab === "reservations" ? "My Tables" : "My Profile Settings"}
            {activeTab === tab && (
              <motion.div
                layoutId="dashTabLine"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-brand rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Selected screen panels */}
      <div className="min-h-96">
        
        {/* ORDERS TABS CONTAINER */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <History className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-semibold font-serif-lux">Place your first order today!</p>
                <p className="text-xs">Browse the online menu to order tasty pure veg treats.</p>
              </div>
            ) : (
              <>
                {/* Status Filter Header Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">Order History</h3>
                    <p className="text-[11px] text-text-secondary">Keep track of your pure veg culinary treats</p>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <label htmlFor="status-filter" className="text-xs font-semibold text-text-secondary whitespace-nowrap">Status:</label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-brand/30 focus:border-primary-brand text-text-primary font-medium cursor-pointer transition w-full sm:w-40"
                    >
                      <option value="All">All ({orders.length})</option>
                      <option value="Pending">Pending ({orders.filter(o => o.status === 'Pending').length})</option>
                      <option value="Accepted">Accepted ({orders.filter(o => o.status === 'Accepted').length})</option>
                      <option value="Preparing">Preparing ({orders.filter(o => o.status === 'Preparing').length})</option>
                      <option value="Out for Delivery">Out for Delivery ({orders.filter(o => o.status === 'Out for Delivery').length})</option>
                      <option value="Delivered">Delivered ({orders.filter(o => o.status === 'Delivered').length})</option>
                      <option value="Rejected">Rejected ({orders.filter(o => o.status === 'Rejected').length})</option>
                    </select>
                  </div>
                </div>

                <AnimatePresence mode="popLayout">
                  {filteredOrders.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center bg-gray-50/25 rounded-2xl border border-dashed border-gray-100 text-gray-400"
                    >
                      <History className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                      <p className="text-xs font-semibold">No orders found with status "{statusFilter}".</p>
                      <p className="text-[10px] mt-1">Try changing the status filter or browse the menu to order.</p>
                    </motion.div>
                  ) : (
                    filteredOrders.map((ord) => (
                      <motion.div
                        key={ord.id}
                        layoutId={`order-card-${ord.id}`}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-bold text-primary-brand">#{ord.id}</span>
                            <span className="text-[10px] text-text-secondary">
                              {new Date(ord.createdAt).toLocaleString()}
                            </span>
                          </div>
                          
                          {/* Items label strings */}
                          <p className="text-xs text-text-primary font-bold">
                            {ord.items.map(itm => `${itm.name} (x${itm.quantity})`).join(", ")}
                          </p>

                          <div className="flex items-center space-x-3 text-[10px]">
                            <span className="text-text-secondary">Payment: <strong className="text-gray-700 font-medium">{ord.paymentMethod}</strong></span>
                            <span className="text-gray-300">|</span>
                            <span className="text-text-secondary">Total: <strong className="text-primary-brand font-semibold">₹{ord.total}</strong></span>
                          </div>
                        </div>

                        {/* Status update display badge & actions */}
                        <div className="flex items-center space-x-3 self-stretch md:self-auto justify-between border-t border-gray-50 pt-3 md:pt-0 md:border-none">
                          <motion.span 
                            layoutId={`order-status-${ord.id}`}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${
                              ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              ord.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                              'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}
                          >
                            {ord.status}
                          </motion.span>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onRepeatOrder(ord)}
                              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                              title="Add all items from this order to back into active cart"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Repeat Order</span>
                            </button>
                            <button
                              onClick={() => setSelectedInvoice(ord)}
                              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-text-primary rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                              title="View receipt ticket popup"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Receipt</span>
                            </button>
                            <button
                              onClick={() => downloadInvoicePDF(ord)}
                              className="px-3 py-2 bg-primary-brand hover:bg-primary-brand/90 text-accent-brand rounded-lg text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                              title="Download professional PDF tax invoice"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </button>
                            <button
                              onClick={() => printReceipt(ord)}
                              className="px-3 py-2 bg-accent-brand hover:bg-accent-brand/90 text-primary-brand rounded-lg text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                              title="Print clean receipt summary"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Print Receipt</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        )}

        {/* RESERVATIONS TAB CONTAINER */}
        {activeTab === 'reservations' && (
          <div className="space-y-4">
            {reservations.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Ticket className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-semibold font-serif-lux">No active table reservations.</p>
                <p className="text-xs">Schedule a secure premium dining table for your family thali feast.</p>
              </div>
            ) : (
              reservations.map((res) => (
                <div key={res.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold text-primary-brand">Booking ID #{res.id}</span>
                      <span className="text-[10px] text-text-secondary">
                        Submitted: {new Date(res.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-bold font-serif-lux text-text-primary">
                      {res.guests} Guests on {res.date} at {res.time}
                    </h4>
                    {res.notes && <p className="text-xs text-text-secondary font-sans italic">"{res.notes}"</p>}
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    res.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    res.status === 'Cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                    'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {res.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* PROFILE SETTINGS TAB */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-6">
              <h4 className="text-base font-bold font-serif-lux text-primary-brand border-b border-gray-50 pb-2">Patron Details</h4>
              <div className="space-y-3 text-xs font-sans text-text-primary">
                <div>
                  <label className="block text-text-secondary font-bold mb-1">Patron Unique Name</label>
                  <p className="bg-bg-brand p-2.5 rounded-xl border border-gray-100">{profile.name}</p>
                </div>
                <div>
                  <label className="block text-text-secondary font-bold mb-1">Email Coordinates</label>
                  <p className="bg-bg-brand p-2.5 rounded-xl border border-gray-100">{profile.email}</p>
                </div>
                <div>
                  <label className="block text-text-secondary font-bold mb-1">Verified Contact Number</label>
                  <p className="bg-bg-brand p-2.5 rounded-xl border border-gray-100">{profile.phone}</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <h4 className="text-base font-bold font-serif-lux text-primary-brand">Saved Addresses</h4>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-xs text-accent-brand hover:text-accent-brand/90 font-bold"
                >
                  + Add Address
                </button>
              </div>

              {/* Add Address Mini Form */}
              <AnimatePresence>
                {isEditingAddress && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddAddress}
                    className="space-y-3 overflow-hidden bg-bg-brand p-4 rounded-xl border border-gray-100"
                  >
                    <input
                      type="text"
                      required
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="e.g. Civil Lines Near LIC, Pratapgarh, UP - 230001"
                      className="w-full bg-white border border-gray-100 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                    <div className="flex justify-end gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="px-3 bg-gray-100 hover:bg-gray-200 py-1.5 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 bg-primary-brand text-accent-brand font-bold py-1.5 rounded-md"
                      >
                        Save
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Render address listings */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {profile.addresses.map((addr, idx) => (
                  <div key={idx} className="flex gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs">
                    <MapPin className="w-4 h-4 text-accent-brand shrink-0 mt-0.5" />
                    <span className="font-sans text-text-primary leading-relaxed">{addr}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* INVOICE TICKET MODAL */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 bg-primary-brand/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[28px] overflow-hidden shadow-2xl p-6 md:p-8 text-text-primary relative font-sans"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedInvoice(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {/* Invoice Printable Sheet */}
              <div id="invoice-sheet" className="space-y-6">
                
                {/* Brand Header */}
                <div className="text-center pb-6 border-b border-dashed border-gray-200">
                  <h3 className="text-xl font-bold font-serif-lux text-primary-brand uppercase tracking-wider">Kishori Restaurant</h3>
                  <p className="text-[10px] text-text-secondary mt-0.5">100% Pure Vegetarian Family Restaurant</p>
                  <p className="text-[9px] text-text-secondary">Bela, Pratapgarh, Uttar Pradesh 230001</p>
                  <p className="text-[9px] text-accent-brand font-semibold uppercase tracking-wider mt-1">Invoice Receipt Ticket</p>
                </div>

                {/* Ticket Metadata */}
                <div className="grid grid-cols-2 gap-4 text-[10px] text-text-secondary pb-4 border-b border-gray-100">
                  <div className="space-y-1">
                    <p>Order ID: <strong className="text-text-primary">#{selectedInvoice.id}</strong></p>
                    <p>Date: <strong className="text-text-primary">{new Date(selectedInvoice.createdAt).toLocaleString()}</strong></p>
                    <p>Payment: <strong className="text-text-primary">{selectedInvoice.paymentMethod}</strong></p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p>Customer: <strong className="text-text-primary">{selectedInvoice.customerName}</strong></p>
                    <p>Phone: <strong className="text-text-primary">{selectedInvoice.customerPhone}</strong></p>
                    <p>Status: <strong className="text-emerald-700 uppercase">{selectedInvoice.status}</strong></p>
                  </div>
                </div>

                {/* Items Block Table */}
                <div className="space-y-2 pb-4 border-b border-gray-100">
                  <div className="flex justify-between text-[10px] text-text-secondary uppercase tracking-wider font-bold">
                    <span>Menu Item</span>
                    <div className="flex gap-10">
                      <span>Qty</span>
                      <span className="w-12 text-right">Price</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
                    {selectedInvoice.items.map((itm, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="font-medium text-text-primary">{itm.name}</span>
                        <div className="flex gap-14 shrink-0">
                          <span className="text-text-secondary">{itm.quantity}</span>
                          <span className="w-12 text-right font-semibold">₹{itm.price * itm.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals Table details */}
                <div className="space-y-1.5 text-xs text-text-secondary font-medium font-sans pb-4 border-b border-dashed border-gray-200">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-text-primary">₹{selectedInvoice.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST Tax (5%):</span>
                    <span className="text-text-primary">₹{selectedInvoice.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges:</span>
                    <span className="text-text-primary">{selectedInvoice.deliveryCharge === 0 ? "FREE" : `₹${selectedInvoice.deliveryCharge}`}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Coupon Discount ({selectedInvoice.couponCode || 'GIFT'}):</span>
                      <span>-₹{selectedInvoice.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-primary-brand pt-2">
                    <span>Grand Total:</span>
                    <span className="font-serif-lux font-black">₹{selectedInvoice.total}</span>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="text-center text-[9px] text-text-secondary space-y-1 pt-2">
                  <p className="font-semibold text-emerald-700">✓ Certified 100% Pure Vegetarian Culinary Experience</p>
                  <p>Incase of query, please dial 08052777728. Thank you for choosing Kishori!</p>
                </div>

              </div>

              {/* Action buttons print */}
              <div className="flex gap-3 justify-end pt-6 border-t border-gray-100 mt-6 text-xs">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                >
                  Close Receipt
                </button>
                <button
                  onClick={() => downloadInvoicePDF(selectedInvoice)}
                  className="px-5 py-2 bg-white border border-primary-brand text-primary-brand hover:bg-primary-brand/10 rounded-lg transition flex items-center space-x-1.5 font-bold cursor-pointer"
                  title="Download clean PDF file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-5 py-2 bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg transition flex items-center space-x-1.5 font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-accent-brand" />
                  <span>Print Receipt</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
