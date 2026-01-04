'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const handleRemove = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
    toast.success("Item removed");
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const userStr = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (!userStr) {
      toast.error("Please login to checkout");
      router.push("/customer-login");
      return;
    }
    router.push('/payment');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/customer-home')}>
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-600/20">
              <LocalFloristIcon />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 leading-none">AgroMart</h1>
              <p className="text-xs text-green-600 font-medium">Checkout</p>
            </div>
          </div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium"
          >
            <ArrowBackIcon fontSize="small" /> Continue Shopping
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300"
          >
            <div className="bg-green-50 p-6 rounded-full mb-6">
              <ShoppingCartIcon style={{ fontSize: 60, color: '#16a34a' }} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
            <button 
              onClick={() => router.push('/customer-home')}
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              <AnimatePresence>
                {cartItems.map((item, idx) => (
                  <motion.div 
                    key={`${item.id}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    layout
                    className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-24 h-24 object-cover rounded-xl bg-gray-100"
                      onError={(e) => e.target.src = "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop"}
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900">{item.title}</h4>
                      <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                      <p className="text-green-600 font-bold text-lg mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => handleRemove(idx)} 
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Remove item"
                    >
                      <DeleteOutlineIcon />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:w-96">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mb-8">
                  <div className="flex justify-between items-center font-bold text-2xl text-gray-900">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-green-600/30 active:scale-[0.99]"
                >
                  Proceed to Payment
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  Secure checkout powered by AgroMart
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}