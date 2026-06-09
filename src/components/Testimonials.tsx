import React from "react";
import { Star, MessageSquareQuote, Quote, Plus } from "lucide-react";
import { Review } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface TestimonialsProps {
  reviews: Review[];
  onSubmitReview: (review: { author: string; rating: number; text: string }) => Promise<any>;
}

export default function Testimonials({ reviews, onSubmitReview }: TestimonialsProps) {
  const [author, setAuthor] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !text) {
      alert("Please provide both your beautiful name and review message!");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmitReview({ author, rating, text });
      setAuthor("");
      setText("");
      setRating(5);
      setShowForm(false);
    } catch (e) {
      console.error(e);
      alert("Failed to post review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-bg-brand/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Grid */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="space-y-2 text-center md:text-left max-w-lg">
            <span className="text-xs font-button-lux tracking-[0.25em] text-accent-brand uppercase font-bold block">Customer Affection</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-lux text-primary-brand">Family Testimonials</h2>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              Learn why multi-generational Pratapgarh family households choose Kishori for pure vegetarian purity, traditional flavor, and warm visual prestige.
            </p>
          </div>

          <button
            id="share-feedback-btn"
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3.5 bg-primary-brand text-accent-brand hover:scale-105 font-button-lux font-bold text-xs rounded-xl transition flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-accent-brand" />
            <span>Share Your Feedback</span>
          </button>
        </div>

        {/* Dynamic New Review Form Drawer */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-12"
            >
              <form onSubmit={handleSubmit} className="bg-white rounded-[24px] p-6 md:p-8 max-w-2xl mx-auto border border-gray-100 shadow-md space-y-5">
                <h4 className="text-base font-bold font-serif-lux text-primary-brand">Share Your Dining Experience</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-secondary">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Govind Maurya"
                      className="w-full bg-bg-brand border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-secondary">Star Rating (1-5)</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full bg-bg-brand border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ Excellent Cuisine (5/5)</option>
                      <option value="4">⭐⭐⭐⭐ Great Hospitality (4/5)</option>
                      <option value="3">⭐⭐⭐ Standard Taste (3/5)</option>
                      <option value="2">⭐⭐ Adequate Value (2/5)</option>
                      <option value="1">⭐ Unsatisfied (1/5)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Your Review Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Describe our kitchen hygiene, waiting staffs, specific paneer tastes, or combo delivery speed..."
                    className="w-full bg-bg-brand border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-text-secondary text-xs font-medium rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-button-lux font-bold rounded-xl transition"
                  >
                    {isSubmitting ? "Posting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testimonials List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <motion.div
              whileHover={{ y: -5 }}
              key={rev.id}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col justify-between relative group"
            >
              <div className="absolute top-6 right-8 text-gray-100 group-hover:text-accent-brand/10 transition duration-300">
                <Quote className="w-14 h-14" />
              </div>

              <div className="space-y-4 relative z-10">
                {/* Stars */}
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < rev.rating
                          ? "fill-accent-brand text-accent-brand"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Text content */}
                <p className="text-xs text-text-secondary italic leading-relaxed font-sans line-clamp-6">
                  "{rev.text}"
                </p>
              </div>

              {/* Author profile detail */}
              <div className="flex items-center space-x-3.5 pt-6 border-t border-gray-50 mt-6 shrink-0">
                <img
                  src={rev.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                  alt={rev.author}
                  className="w-10 h-10 rounded-full object-cover border-2 border-accent-brand/20"
                />
                <div>
                  <h4 className="text-xs font-bold font-serif-lux text-text-primary">{rev.author}</h4>
                  <span className="text-[10px] text-text-secondary font-sans">{rev.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
