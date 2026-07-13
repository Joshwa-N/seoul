// This file re-exports from the shared store so admin changes reflect in the frontend
import { getProducts } from '@/lib/store';
import type { Collection, FAQ } from '@/types';

// Products now come from localStorage store (shared with admin panel)
export const products = getProducts();

export const collections: Collection[] = [
  { id: "beauty", name: "K-Beauty", description: "Discover the secrets of Korean skincare with our curated collection of serums, masks, and makeup.", image: "/images/collection-beauty.jpg", productCount: 8, color: "#F8C8DC" },
  { id: "fashion", name: "Seoul Fashion", description: "Minimalist designs meets effortless elegance. Linen, silk, and sustainable fabrics for the modern wardrobe.", image: "/images/collection-fashion.jpg", productCount: 7, color: "#A8DADC" },
  { id: "home", name: "Home Living", description: "Curated home essentials that bring calm and beauty to your everyday spaces.", image: "/images/collection-home.jpg", productCount: 3, color: "#E9D5FF" },
  { id: "food", name: "Spice Pantry", description: "Authentic Korean flavors and spices to elevate your culinary adventures.", image: "/images/collection-food.jpg", productCount: 2, color: "#F4A261" },
];

export const faqs: FAQ[] = [
  { id: 1, question: "What is your shipping policy?", answer: "We offer free shipping on orders over $50. Standard shipping takes 5-7 business days, and express shipping (2-3 business days) is available for $15." },
  { id: 2, question: "How do I track my order?", answer: "Once your order ships, you'll receive an email with a tracking number. You can also track your order in your account dashboard." },
  { id: 3, question: "What is your return policy?", answer: "We accept returns within 30 days of purchase. Items must be unused and in original packaging. Beauty products must be unopened for hygiene reasons." },
  { id: 4, question: "Are your products cruelty-free?", answer: "Yes! All our beauty products are cruelty-free and many are vegan. Look for the vegan badge on product pages." },
  { id: 5, question: "Do you ship internationally?", answer: "Yes, we ship to over 50 countries. International shipping rates vary by location and are calculated at checkout." },
  { id: 6, question: "How can I contact customer service?", answer: "You can reach us via email at hello@seoulspice.com, through our contact form, or by phone at +1 (555) 123-4567 during business hours (9am-6pm EST)." },
];

export const getProductsByCategory = (category: string) => products.filter(p => p.category.toLowerCase() === category.toLowerCase());
export const getProductById = (id: number) => products.find(p => p.id === id);
export const getNewArrivals = () => products.filter(p => p.isNew).slice(0, 4);
export const getBestsellers = () => products.filter(p => p.isBestseller).slice(0, 4);
export const getTrendingProducts = () => products.slice(0, 8);
