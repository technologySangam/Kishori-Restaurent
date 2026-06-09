import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, Order, Reservation, Review } from "./src/types.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database Store (resets on server restart, but persists across live client interactions)
let menuItems: MenuItem[] = [
  // North Indian
  {
    id: "m1",
    name: "Kishori Special Shahi Paneer",
    description: "Our signature dish. Soft cottage cheese cubes simmered in a luscious, rich, and creamy cashew-tomato gravy, accented with luxury saffron.",
    price: 320,
    category: "North Indian",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isPopular: true,
    isChefSpecial: true
  },
  {
    id: "m2",
    name: "Dal Makhani Kishori Haveli",
    description: "Slow-cooked black lentils and kidney beans cooked overnight on clay tandoor, finished with fresh cream, white butter, and home-churned spices.",
    price: 240,
    category: "North Indian",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isPopular: true,
    isChefSpecial: false
  },
  {
    id: "m3",
    name: "Malai Kofta Premium",
    description: "Deep fried paneer and potato dumplings stuffed with dry fruits, served in an exquisite golden onion and melon-seed gravy.",
    price: 280,
    category: "North Indian",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isPopular: false,
    isChefSpecial: true
  },
  // South Indian
  {
    id: "m4",
    name: "Kishori Special Gold-Paper Masala Dosa",
    description: "Extra-large crispy crepe from fermented rice batter, stuffed with tempered potato bhaji, brushed with ghee, served with our signature coconut chutney and spicy sambar.",
    price: 180,
    category: "South Indian",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isPopular: true,
    isChefSpecial: true
  },
  {
    id: "m5",
    name: "Rava Onion Paneer Uttapam",
    description: "Thick savory pancake topped with finely chopped red onions, green chillies, grated paneer, fresh coriander, and pure ghee.",
    price: 160,
    category: "South Indian",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isPopular: false,
    isChefSpecial: false
  },
  // Chinese
  {
    id: "m6",
    name: "Sizzling Veg Manchurian",
    description: "Deep-fried vegetable dumplings tossed in a highly flavorful, spicy and tangy garlic-coriander soy sauce, served on a sizzler plate.",
    price: 220,
    category: "Chinese",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isPopular: true,
    isChefSpecial: false
  },
  {
    id: "m7",
    name: "Premium Chilli Paneer Dry",
    description: "Chunky paneer cubes stir-fried with multi-colored bell peppers, red onions, spring greens, and a premium schezwan peppercorn glaze.",
    price: 260,
    category: "Chinese",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isPopular: true,
    isChefSpecial: false
  },
  // Tandoori Specialties
  {
    id: "m8",
    name: "Clay tandoor Paneer Tikka Multani",
    description: "Plump cubes of fresh paneer marinated in custom yellow-spice yogurt marinade, skewered with onions and capsicum, grilled to smoky perfection.",
    price: 290,
    category: "Tandoori",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isPopular: true,
    isChefSpecial: true
  },
  {
    id: "m9",
    name: "Crispy Hara Bhara Kebab",
    description: "Finely minced spinach, green peas, and potato patties stuffed with raisins and nuts, pan-seared to a melt-in-mouth crispness.",
    price: 210,
    category: "Tandoori",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isPopular: false,
    isChefSpecial: false
  },
  // Snacks
  {
    id: "m10",
    name: "Royal Samosa Chaat Platter",
    description: "Golden flaky samosas crushed and topped with warm spiced chickpeas, sweetened yogurt, dry-ginger sweet chutney, fresh mint chutney, and sev.",
    price: 130,
    category: "Snacks",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isPopular: true,
    isChefSpecial: false
  },
  {
    id: "m11",
    name: "Premium Chole Bhature Haveli-Style",
    description: "Large fluffy yogurt-infused fried breads served with a rich, dark-spiced chickpea curry, homemade pickles, and onion rings.",
    price: 170,
    category: "Snacks",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isPopular: true,
    isChefSpecial: true
  },
  // Desserts
  {
    id: "m12",
    name: "Kishori Golden Gulab Jamun (2 Pcs)",
    description: "Soft reduced-milk dumplings fried and steeped in hot green cardamom and luxury saffron sugar syrup, finished with pure silver foil.",
    price: 90,
    category: "Desserts",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isPopular: true,
    isChefSpecial: false
  },
  {
    id: "m13",
    name: "Royal Halwai Moong Dal Halwa",
    description: "Delectable rich dessert made of coarsed yellow lentils sautéed with premium cow ghee for hours, saturated in dry fruit flakes and saffron syrup.",
    price: 150,
    category: "Desserts",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isPopular: false,
    isChefSpecial: true
  },
  // Beverages
  {
    id: "m14",
    name: "Kishori Royal Shahi Lassi",
    description: "Creamy, heavy-churned yogurt beverage sweetened and flavored with robust rosewater, loaded with sliced almonds, pistachios, and saffron.",
    price: 110,
    category: "Beverages",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isPopular: true,
    isChefSpecial: false
  }
];

let reviews: Review[] = [
  {
    id: "r1",
    author: "Govind Maurya",
    rating: 5,
    text: "Absolutely the best pure vegetarian dining experience in Pratapgarh! The Shahi Paneer and Dal Makhani tasted celestial. Service was incredibly quick, and the ambiance was top-notch. Highly recommended for families!",
    date: "2026-06-05",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "r2",
    author: "Shreya Singh",
    rating: 5,
    text: "Clean, hygienic, and authentic delicious food! The Paper Masala Dosa was so huge and perfectly crisp. Extremely family friendly. I celebrated my sister's birthday here, and the staff made it feel so special.",
    date: "2026-06-01",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "r3",
    author: "Rajesh Sahu",
    rating: 4,
    text: "Wonderful food quality and pure vegetarian values. Finding standard luxury level sitting and dining space in Pratapgarh was difficult before, but Kishori Restaurant has executed this wonderfully. The staff is polite, and the lassi is amazing.",
    date: "2026-05-28",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60"
  }
];

let orders: Order[] = [
  {
    id: "ord-1001",
    items: [
      { itemId: "m1", name: "Kishori Special Shahi Paneer", price: 320, quantity: 2, category: "North Indian" },
      { itemId: "m8", name: "Clay tandoor Paneer Tikka Multani", price: 290, quantity: 1, category: "Tandoori" },
      { itemId: "m14", name: "Kishori Royal Shahi Lassi", price: 110, quantity: 3, category: "Beverages" }
    ],
    subtotal: 1260,
    tax: 63,
    deliveryCharge: 40,
    discount: 100,
    total: 1263,
    customerName: "Govind Maurya",
    customerEmail: "mauryagovindg5@gmail.com",
    customerPhone: "08052777728",
    deliveryAddress: "Civil Lines, Pratapgarh, Uttar Pradesh - 230001",
    status: "Delivered",
    createdAt: "2026-06-08T19:30:00Z",
    couponCode: "WELCOME100",
    paymentMethod: "UPI"
  },
  {
    id: "ord-1002",
    items: [
      { itemId: "m4", name: "Kishori Special Gold-Paper Masala Dosa", price: 180, quantity: 2, category: "South Indian" },
      { itemId: "m12", name: "Kishori Golden Gulab Jamun (2 Pcs)", price: 90, quantity: 2, category: "Desserts" }
    ],
    subtotal: 540,
    tax: 27,
    deliveryCharge: 30,
    discount: 0,
    total: 597,
    customerName: "Sneha Shukla",
    customerEmail: "snehashukla@gmail.com",
    customerPhone: "09988776655",
    deliveryAddress: "Bela Chowk, Pratapgarh, UP - 230001",
    status: "Preparing",
    createdAt: "2026-06-09T07:15:00Z",
    paymentMethod: "Cash on Delivery"
  }
];

let reservations: Reservation[] = [
  {
    id: "res-2001",
    name: "Govind Maurya",
    email: "mauryagovindg5@gmail.com",
    phone: "08052777728",
    date: "2026-06-10",
    time: "19:30",
    guests: 5,
    notes: "Celebrating family anniversary, please assign a premier quiet table next to the glass wall if possible.",
    status: "Confirmed",
    createdAt: "2026-06-08T14:10:00Z"
  }
];

// Initialize server-side Gemini AI client
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    console.log("Gemini AI integration loaded successfully for Kishori Restaurant.");
  } else {
    console.warn("GEMINI_API_KEY is placeholder or not configured. Recommendation assistant will use simulated smart backup responses.");
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI client:", e);
}

// REST APIs
// 1. Menu APIs
app.get("/api/menu", (req, res) => {
  res.json(menuItems);
});

app.post("/api/menu", (req, res) => {
  const { name, description, price, category, image, isPopular, isChefSpecial } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: "Missing required fields: name, price, and category" });
  }
  const newItem: MenuItem = {
    id: `m${Date.now()}`,
    name,
    description: description || "",
    price: Number(price),
    category,
    rating: 4.5,
    image: image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600",
    isPopular: !!isPopular,
    isChefSpecial: !!isChefSpecial
  };
  menuItems.push(newItem);
  res.status(201).json(newItem);
});

app.put("/api/menu/:id", (req, res) => {
  const { id } = req.params;
  const index = menuItems.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Menu item not found" });
  }
  const updatedItem = { ...menuItems[index], ...req.body, price: Number(req.body.price ?? menuItems[index].price) };
  menuItems[index] = updatedItem;
  res.json(updatedItem);
});

app.delete("/api/menu/:id", (req, res) => {
  const { id } = req.params;
  const lengthBefore = menuItems.length;
  menuItems = menuItems.filter(m => m.id !== id);
  if (menuItems.length === lengthBefore) {
    return res.status(404).json({ error: "Menu item not found" });
  }
  res.json({ success: true, message: "Menu item deleted successfully" });
});

// 2. Reviews APIs
app.get("/api/reviews", (req, res) => {
  res.json(reviews);
});

app.post("/api/reviews", (req, res) => {
  const { author, rating, text } = req.body;
  if (!author || !rating || !text) {
    return res.status(400).json({ error: "Missing review fields" });
  }
  const newReview: Review = {
    id: `r${Date.now()}`,
    author,
    rating: Number(rating),
    text,
    date: new Date().toISOString().split('T')[0],
    avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?w=100&auto=format&fit=crop&q=60`
  };
  reviews.unshift(newReview);
  res.status(201).json(newReview);
});

// 3. Orders APIs
app.get("/api/orders", (req, res) => {
  const { email } = req.query;
  if (email) {
    const filtered = orders.filter(o => o.customerEmail.toLowerCase() === String(email).toLowerCase());
    return res.json(filtered);
  }
  res.json(orders);
});

app.post("/api/orders", (req, res) => {
  const { items, customerName, customerEmail, customerPhone, deliveryAddress, discount, paymentMethod, subtotal, tax, deliveryCharge, total, couponCode } = req.body;
  if (!items || !items.length || !customerName || !customerPhone) {
    return res.status(400).json({ error: "Incomplete order details" });
  }

  const newOrder: Order = {
    id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
    items,
    subtotal: Number(subtotal),
    tax: Number(tax),
    deliveryCharge: Number(deliveryCharge),
    discount: Number(discount || 0),
    total: Number(total),
    customerName,
    customerEmail: customerEmail || "guest@kishori.com",
    customerPhone,
    deliveryAddress: deliveryAddress || "Dine-In/Takeaway",
    status: 'Pending',
    createdAt: new Date().toISOString(),
    couponCode,
    paymentMethod: paymentMethod || 'Cash on Delivery'
  };

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }
  orders[index].status = status;
  res.json(orders[index]);
});

// 4. Table Reservation APIs
app.get("/api/reservations", (req, res) => {
  const { email } = req.query;
  if (email) {
    const filtered = reservations.filter(r => r.email.toLowerCase() === String(email).toLowerCase());
    return res.json(filtered);
  }
  res.json(reservations);
});

app.post("/api/reservations", (req, res) => {
  const { name, email, phone, date, time, guests, notes } = req.body;
  if (!name || !phone || !date || !time || !guests) {
    return res.status(400).json({ error: "Missing required reservation fields" });
  }

  const newReservation: Reservation = {
    id: `res-${Math.floor(2000 + Math.random() * 8000)}`,
    name,
    email: email || "",
    phone,
    date,
    time,
    guests: Number(guests),
    notes: notes || "",
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  reservations.unshift(newReservation);
  console.log(`[RESERVATION ALERT] Instantly notifying admin for booking ID: ${newReservation.id}. Details: ${guests} guests on ${date} at ${time}`);
  res.status(201).json(newReservation);
});

app.put("/api/reservations/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const index = reservations.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Reservation not found" });
  }
  reservations[index].status = status;
  res.json(reservations[index]);
});

// 5. Reports / Dashboard Stats
app.get("/api/reports/stats", (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => o.status === 'Delivered' ? sum + o.total : sum, 0);
  const activeOrders = orders.filter(o => !['Delivered', 'Rejected'].includes(o.status)).length;
  const totalReservations = reservations.length;
  
  // Calculate best dish
  const dishCounts: { [name: string]: number } = {};
  orders.forEach(o => {
    o.items.forEach(itm => {
      dishCounts[itm.name] = (dishCounts[itm.name] || 0) + itm.quantity;
    });
  });
  
  const popularDishes = Object.keys(dishCounts).map(name => ({
    name,
    count: dishCounts[name]
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  const salesByCategory: { [cat: string]: number } = {};
  orders.forEach(o => {
    o.items.forEach(itm => {
      salesByCategory[itm.category] = (salesByCategory[itm.category] || 0) + (itm.price * itm.quantity);
    });
  });

  res.json({
    totalRevenue,
    activeOrders,
    totalReservations,
    popularDishes,
    salesByCategory
  });
});

// 6. AI recommendation Assistant (Gemini API integration)
app.post("/api/ai/recommend", async (req, res) => {
  const { currentQuery, conversationHistory, cartItems } = req.body;
  if (!currentQuery) {
    return res.status(400).json({ error: "Query is required" });
  }

  // Create formatted menu context for the prompt
  const menuContext = menuItems.map(m => 
    `- ID: ${m.id}, Name: ${m.name}, Price: Rs. ${m.price}, Description: ${m.description}, Category: ${m.category}, Rating: ${m.rating}${m.isChefSpecial ? ' [CHEF SIGNATURE]' : ''}${m.isPopular ? ' [POPULAR/BEST SELLER]' : ''}`
  ).join("\n");

  const cartContext = cartItems && cartItems.length 
    ? `The customer currently has these in their cart: ${cartItems.map((c: any) => `${c.name} x${c.quantity}`).join(", ")}`
    : `The customer's cart is currently empty.`;

  const systemPrompt = `You are "Kishori", the high-end premium AI Food Curator and Recommendation Assistant for Kishori Restaurant in Pratapgarh, Uttar Pradesh.
You represent a highly loyal, warm, traditional yet luxurious, 100% Pure Vegetarian family restaurant.
Our values: absolute vegetarian purity, premium farm-fresh ingredients, hygienic kitchen, welcoming family environments, and rich royal tastes with traditional hospitality.

Use the following real-time, curated menus of Kishori Restaurant to answer and upsell:
${menuContext}

${cartContext}

Instructions:
1. Recommend specific items from our dishes listed. Address the user's specific culinary mood, query, or budget. 
2. Offer intelligent suggestions: if they ask for North Indian, pair paneer with dal makhani and butter naan, or suggest refreshing Rose Saffron Shahi Lassi.
3. Keep the tone sophisticated, warmly traditional, elegant, and professional. Ensure spelling of local names match our catalog EXACTLY.
4. Highlight that everything is 100% pure vegetarian, freshly prepared, and absolutely hygienic.
5. Answer concisely, structured with highlights. Present recommendations beautifully using rich markdown.
6. Crucial: ALWAYS suggest adding one of our best-selling drinks (e.g., Royal Shahi Lassi) or desserts (e.g. Golden Gulab Jamun, Moong Dal Halwa) to end the meal with pure joy!

Response Schema:
You should speak directly to the customer in gorgeous prose while maintaining high luxurious standards. Give your text in markdown format. Just return the response text directly.`;

  // Fallback assistant logic if API Key is not available or call fails
  const backupResponse = () => {
    const LowerCaseQuery = currentQuery.toLowerCase();
    if (LowerCaseQuery.includes("paneer") || LowerCaseQuery.includes("north") || LowerCaseQuery.includes("special")) {
      return `Welcome to **Kishori Restaurant**, where vegetarian dining is elevated to royal feast standards! 

Based on your preference, I highly recommend our crowning jewel:
*   **Kishori Special Shahi Paneer (Rs. 320)**: Simmered in a luxurious, creamy cashew-tomato gravy accented with real saffron.
*   **Dal Makhani Kishori Haveli (Rs. 240)**: Cooked overnight on slow clay tandoor embers and finished with pure butter.

**Perfect Pairings:**
We recommend pairing this with raw butter/garlic naan fresh from the tandoor.

🍹 **To Enhance Your Experience:**
You must complement this with our rich, heavy-churned **Kishori Royal Shahi Lassi (Rs. 110)**, loaded with almonds, pistachios, and saffron. Our kitchen holds 100% pure vegetarian standards for you and your family!
Would you like me to add these directly to your cart?`;
    } else if (LowerCaseQuery.includes("dosa") || LowerCaseQuery.includes("south")) {
      return `Pranam! Our South Indian selection brings authentic coastal and temple-style purity right to Pratapgarh:

*   **Kishori Special Gold-Paper Masala Dosa (Rs. 180)**: An incredibly long, ultra-crispy golden crepe brushed with pure ghee, served with authentic coriander-coconut chutney & zesty hot sambar.
*   **Rava Onion Paneer Uttapam (Rs. 160)**: A thick fluffy griddle cake loaded with chopped sweet red onions, green chillies, and grated cottage cheese.

✨ **Sweet Addition:**
After a thin crispy dosa, treat yourself to our hot cardamom-infused **Kishori Golden Gulab Jamun (Rs. 90 for 2 Pcs)** topped with genuine silver foil. 

Shall I assist you in adding these pure vegetarian delights to your order?`;
    } else if (LowerCaseQuery.includes("budget") || LowerCaseQuery.includes("cheap") || LowerCaseQuery.includes("affordable")) {
      return `Namaste! At **Kishori**, we believe in delivering authentic vegetarian luxury at a delightful value. Here is an optimized, highly satisfying meal curation under Rs. 300:

1.  **Royal Samosa Chaat Platter (Rs. 130)**: A flaky golden pastry shattered and saturated with spiced chickpeas, sweet yogurt, tangy tamarind, and fresh mint.
2.  **Kishori Royal Shahi Lassi (Rs. 110)**: Our full-bodied, heavy-churned yogurt nectar, acting as a rich dessert and refreshing beverage in one!

Total: **Rs. 240** of absolute flavor and hygienic pure satisfaction. 

Would you like me to build this pocket-friendly package for your cart?`;
    } else {
      return `Greetings from **Kishori Restaurant**, Pratapgarh's premier 100% pure vegetarian dining destination!

How may I curate your meal today? Here are our highly celebrated Chef Specials:
*   **Kishori Special Shahi Paneer (Rs. 320)**: Rich cottage cheese cubes in delicate cashew-saffron gravy.
*   **Kishori Special Gold-Paper Masala Dosa (Rs. 180)**: Extra large crispy ghee crepe.
*   **Clay Tandoor Paneer Tikka Multani (Rs. 290)**: Grilled to smoky perfection.

To complete your dining affair, our signature **Kishori Royal Shahi Lassi (Rs. 110)** topped with chopped nuts and saffron provides a magnificent finish. 

Tell me if you have any sweet-cravings, spice preferences, or are ordering for a family gathering!`;
    }
  };

  if (!ai) {
    // Return mock generator immediately if client isn't loaded
    return res.json({ text: backupResponse() });
  }

  try {
    // Prepare conversation messages history
    const contents: any[] = [];
    if (conversationHistory && conversationHistory.length) {
      conversationHistory.forEach((msg: any) => {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      });
    }
    
    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: currentQuery }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    if (response && response.text) {
      res.json({ text: response.text });
    } else {
      res.json({ text: backupResponse() });
    }
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    res.json({ text: backupResponse() });
  }
});


// Combine Vite setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kishori Restaurant Server running on http://localhost:${PORT}`);
  });
}

startServer();
