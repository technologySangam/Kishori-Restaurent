export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "North Indian" | "South Indian" | "Chinese" | "Tandoori" | "Snacks" | "Desserts" | "Beverages";
  rating: number;
  image: string;
  isPopular: boolean;
  isChefSpecial: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  status: 'Pending' | 'Accepted' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Rejected';
  createdAt: string;
  couponCode?: string;
  paymentMethod: 'Cash on Delivery' | 'Card Online' | 'UPI';
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  addresses: string[];
  loyaltyPoints: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  minOrderValue: number;
}
