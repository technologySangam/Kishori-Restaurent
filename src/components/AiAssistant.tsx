import React from "react";
import { MessageSquare, Sparkles, Send, X, ArrowUpRight, ChefHat, Leaf, Bot, ShoppingCart } from "lucide-react";
import { MenuItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface AiAssistantProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  cartItems: any[];
}

export default function AiAssistant({ menuItems, onAddToCart, cartItems }: AiAssistantProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  
  const [messages, setMessages] = React.useState<any[]>([
    {
      role: "assistant",
      content: `Greetings! Pranam! 🙏 I am **Kishori**, your premium AI Traditional Food Curator. 

How can I elevate your dining experience today? I can suggest:
*   👑 **Chef Signature Combos** for families
*   🌶️ **Paneer & Tandoori matchings** for dinner
*   🍨 **Sweet Saffron Desserts** or rich **Shahi Lassi** pairings

What flavors are you craving?`
    }
  ]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentQuery: textToSend,
          conversationHistory: messages,
          cartItems
        })
      });
      const data = await response.json();
      
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Indeed, my sensory servers are experiencing slight spice. Let me recommend our **Kishori Special Shahi Paneer (₹320)** which is made with luscious saffron and cashew tomato curry. It's the ultimate crowd pleaser! Would you like me to guide you to checkout?"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleQuickAdd = (itemName: string) => {
    const matchedItem = menuItems.find(m => m.name.toLowerCase().includes(itemName.toLowerCase()));
    if (matchedItem) {
      onAddToCart(matchedItem);
      // Post mock message
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `✓ I have successfully added **${matchedItem.name}** to your cart! You can review details or specify if you'd like premium tandoori bread to pair.` }
      ]);
    } else {
      alert(`Could not find matching dish for '${itemName}' in our active menu.`);
    }
  };

  return (
    <div id="ai-assistant-widget" className="fixed bottom-6 right-6 z-40 font-sans text-xs">
      
      {/* FLOATING SPARKLE TRIGGER SPHERE */}
      <motion.button
        id="ai-assistant-trigger"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary-brand text-accent-brand flex items-center justify-center shadow-2xl relative border-2 border-accent-brand cursor-pointer"
        title="Ask Kishori AI Food Assistant"
      >
        <Bot className="w-6 h-6 text-accent-brand" />
        <span className="absolute -top-1.5 -right-1.5 bg-accent-brand text-primary-brand text-[9px] font-bold py-0.5 px-1.5 rounded-full shadow border border-white">
          AI
        </span>
      </motion.button>

      {/* EXPANDED ASSISTANT CHAT DIALOG */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="absolute bottom-16 right-0 w-[340px] sm:w-[385px] h-[550px] bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-150 flex flex-col z-50 text-text-primary"
          >
            
            {/* Header branding */}
            <div className="bg-primary-brand text-white p-5 border-b border-accent-brand/20 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-accent-brand/12 flex items-center justify-center shrink-0 border border-accent-brand/20">
                  <ChefHat className="w-4.5 h-4.5 text-accent-brand" />
                </div>
                <div>
                  <h4 className="font-bold font-serif-lux text-sm text-white flex items-center space-x-1.5 leading-none">
                    <span>Kishori Curator</span>
                    <Sparkles className="w-3.5 h-3.5 text-accent-brand animate-pulse" />
                  </h4>
                  <span className="text-[9px] text-accent-brand uppercase tracking-widest font-bold">100% Veg Expert</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition text-white/70 hover:text-white"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Core Messages Panel Content scroll area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-bg-brand/15">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-4 rounded-[22px] max-w-[85%] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary-brand text-white rounded-br-none shadow-sm"
                        : "bg-white text-text-primary rounded-bl-none shadow-xs border border-gray-100"
                    }`}
                  >
                    {/* Render simple custom markdown elements manually for safe cleanliness */}
                    <div className="space-y-2 whitespace-pre-wrap">
                      {msg.content.split("\n").map((line: string, lIdx: number) => {
                        if (line.startsWith("*   ") || line.startsWith("-   ")) {
                          return (
                            <p key={lIdx} className="pl-4 relative text-[11px] font-medium leading-relaxed">
                              <span className="absolute left-0 text-accent-brand">•</span>
                              {line.substring(4)}
                            </p>
                          );
                        }
                        if (line.startsWith("### ") || line.startsWith("## ")) {
                          return (
                            <h5 key={lIdx} className="font-bold font-serif-lux text-xs text-primary-brand mt-2 pt-1">
                              {line.replace(/### |## /g, "")}
                            </h5>
                          );
                        }
                        return <p key={lIdx} className="text-[11px] leading-relaxed">{line}</p>;
                      })}
                    </div>

                    {/* Scan and render smart Quick-Add buttons for specific items recognized in message */}
                    {msg.role === "assistant" && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-gray-50">
                        {menuItems.map((itm) => {
                          if (msg.content.toLowerCase().includes(itm.name.toLowerCase()) || 
                              msg.content.toLowerCase().includes(itm.name.split(" ").slice(-2).join(" ").toLowerCase())) {
                            return (
                              <button
                                key={itm.id}
                                onClick={() => handleQuickAdd(itm.name)}
                                className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-100 flex items-center space-x-1 hover:bg-emerald-100 transition cursor-pointer"
                              >
                                <ShoppingCart className="w-3 h-3 text-emerald-700" />
                                <span>Add {itm.name.replace("Kishori Special ", "").replace("Kishori Royal ", "").split(" ").slice(0, 2).join(" ")}</span>
                              </button>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}

                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-text-primary p-4 rounded-[22px] rounded-bl-none shadow-xs border border-gray-150 flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-primary-brand rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-primary-brand rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary-brand rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <span className="text-[10px] italic text-text-secondary">Curating Pure Vegetarian Pleasures...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Shelf */}
            <div className="px-5 py-2.5 bg-white border-t border-gray-50 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => handleSuggestionClick("Suggest a family thali combo!")}
                className="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 text-[10px] whitespace-nowrap transition cursor-pointer font-medium"
              >
                👑 Family Thali
              </button>
              <button
                onClick={() => handleSuggestionClick("What Paneer specialities do you suggest?")}
                className="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 text-[10px] whitespace-nowrap transition cursor-pointer font-medium"
              >
                🧀 Paneer Specials
              </button>
              <button
                onClick={() => handleSuggestionClick("Is your kitchen 100% pure vegetarian?")}
                className="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 text-[10px] whitespace-nowrap transition cursor-pointer font-medium"
              >
                🌱 Pure Vegetarian?
              </button>
            </div>

            {/* Input field footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(query);
              }}
              className="p-4 border-t border-gray-100 bg-white flex gap-3 items-center shrink-0"
            >
              <input
                type="text"
                placeholder="Ask e.g. Suggest food for 4 people..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none text-xs"
              />
              <button
                type="submit"
                id="send-message-btn"
                className="p-3 bg-primary-brand text-accent-brand hover:scale-105 rounded-xl transition shrink-0 flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
