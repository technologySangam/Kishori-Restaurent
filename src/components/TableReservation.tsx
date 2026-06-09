import React from "react";
import { Calendar, Clock, Users, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TableReservationProps {
  onReserve: (booking: any) => Promise<any>;
}

export default function TableReservation({ onReserve }: TableReservationProps) {
  const [name, setName] = React.useState("Govind Maurya");
  const [email, setEmail] = React.useState("mauryagovindg5@gmail.com");
  const [phone, setPhone] = React.useState("08052777728");
  const [date, setDate] = React.useState("2026-06-10");
  const [time, setTime] = React.useState("19:30");
  const [guests, setGuests] = React.useState(4);
  const [notes, setNotes] = React.useState("Family dinner, prefer a premium Table near the window.");

  const [isLoading, setIsLoading] = React.useState(false);
  const [confirmedBooking, setConfirmedBooking] = React.useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !time) {
      alert("Please fill in Name, Phone, Date and Time.");
      return;
    }
    setIsLoading(true);
    setConfirmedBooking(null);

    try {
      const result = await onReserve({
        name,
        email,
        phone,
        date,
        time,
        guests,
        notes
      });
      setConfirmedBooking(result);
    } catch (err) {
      console.error(err);
      alert("Slight issue matching tables. Please check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="reservations" className="py-24 bg-bg-brand relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-lg mx-auto space-y-3 mb-16">
          <span className="text-xs font-button-lux tracking-[0.25em] text-accent-brand uppercase font-bold">Secure Your Feast</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-lux text-primary-brand">Reserve A Table</h2>
          <p className="text-xs text-text-secondary font-sans leading-relaxed">
            Reserve premium family seating slots instantly. Live alerts dispatched instantly to host desks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Reservation Card Details */}
          <div className="lg:col-span-5 bg-primary-brand text-white rounded-[32px] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-2xl pointer-events-none"></div>
            
            <div className="space-y-6">
              <span className="text-xs font-button-lux uppercase tracking-[0.2em] text-accent-brand font-bold block">
                Exclusive Fine Dining
              </span>
              <h3 className="text-2xl font-extrabold font-serif-lux leading-tight">
                Family Seating & Gatherings
              </h3>
              <p className="text-xs leading-relaxed text-white/80 font-sans">
                At **Kishori Restaurant**, we guarantee safe, clean, and segregated family seats. Celebrate anniversaries, festivals, birthdays, or weekend getaways with our signature vegetarian recipes.
              </p>

              <div className="space-y-4 pt-4 text-xs font-sans">
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-accent-brand">
                    ✓
                  </div>
                  <span>100% Pure Vegetarian Segregated Kitchens</span>
                </div>
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-accent-brand">
                    ✓
                  </div>
                  <span>Fully Air-Conditioned Royal Seating Halls</span>
                </div>
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-accent-brand">
                    ✓
                  </div>
                  <span>Instant SMS/WhatsApp Notification confirmation</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 mt-8 space-y-2 text-[10px] text-white/55">
              <p>📍 Location: Bela, Pratapgarh, Uttar Pradesh 230001</p>
              <p>📞 Phone: 08052777728 | Opening Hours: 11:00 AM - 11:00 PM</p>
            </div>
          </div>

          {/* Reservation Input Fields (Form) */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-8 md:p-10 shadow-lg border border-gray-100 flex flex-col justify-center">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-secondary font-button-lux">Your Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Govind Maurya"
                      className="w-full bg-bg-brand border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary font-sans focus:outline-none"
                    />
                    <Users className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-secondary font-button-lux">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. mauryagovindg5@gmail.com"
                      className="w-full bg-bg-brand border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary font-sans focus:outline-none"
                    />
                    <Users className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-secondary font-button-lux">Contact Number *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 08052777728"
                      className="w-full bg-bg-brand border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary font-sans focus:outline-none"
                    />
                    <Users className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-secondary font-button-lux">Seating Date *</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-bg-brand border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary font-sans focus:outline-none"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Time */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-secondary font-button-lux">Preferred Time *</label>
                  <div className="relative">
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-bg-brand border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary font-sans focus:outline-none"
                    />
                    <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Guest Capacity */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-secondary font-button-lux">Number of Guests *</label>
                  <div className="relative">
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-bg-brand border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary font-sans focus:outline-none appearance-none"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 Persons [Couple]</option>
                      <option value="3">3 Persons</option>
                      <option value="4">4 Persons [Family standard]</option>
                      <option value="5">5 Persons</option>
                      <option value="6">6 Persons [Large table]</option>
                      <option value="8">8+ Persons [Party request]</option>
                    </select>
                    <Users className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

              </div>

              {/* Special Notes / requests */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-secondary font-button-lux">Special Requests / Notes</label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe birthday setup requests, high chair for toddlers, window seating preference, etc."
                    className="w-full bg-bg-brand border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary font-sans focus:outline-none"
                  />
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-5" />
                </div>
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                id="reserve-submit-btn"
                disabled={isLoading}
                className="w-full py-4 gold-gradient text-primary-brand font-button-lux font-bold rounded-xl text-sm shadow-md hover:scale-[1.01] transition-all cursor-pointer text-center"
              >
                {isLoading ? "Securing Table Allocation..." : "Confirm Table Reservation"}
              </button>
            </form>

            <AnimatePresence>
              {confirmedBooking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-6 bg-emerald-50 text-emerald-800 p-5 rounded-2xl border border-emerald-100 space-y-2 relative"
                >
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <h4 className="text-xs font-extrabold font-serif-lux uppercase tracking-wide">Reservation Active!</h4>
                  </div>
                  
                  <div className="text-[11px] space-y-1 font-sans">
                    <p>Booking ID: <strong className="font-bold">{confirmedBooking.id}</strong> (Pending Admin Confirm)</p>
                    <p>Scheduled date: <strong className="font-bold">{confirmedBooking.date}</strong> at <strong className="font-bold">{confirmedBooking.time}</strong> for <strong className="font-bold">{confirmedBooking.guests} guests</strong></p>
                    <p className="text-[10px] text-emerald-700 italic">Instant alert has been notified to Kishore hospitality desks.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}
