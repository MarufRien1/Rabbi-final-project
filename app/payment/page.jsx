'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LockIcon from "@mui/icons-material/Lock";
import { motion } from "framer-motion";

export default function PaymentPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      router.push("/cart");
      return;
    }
    setCartItems(cart);
  }, [router]);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }
    // Fake payment: accept any card info
    if (!cardNumber || !expiry || !cvv) {
      toast.error("Please enter card details");
      return;
    }

    const userStr = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (!userStr) {
      toast.error("Please login to checkout");
      router.push("/customer-login");
      return;
    }
    const user = JSON.parse(userStr);

    setIsSubmitting(true);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: cartItems,
          total: totalPrice,
          address
        }),
      });

      if (res.ok) {
        toast.success("Payment Successful! Order Placed.");
        localStorage.removeItem("cart");
        router.push("/my-orders");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to place order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format card number with spaces
  const handleCardInput = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(val.substring(0, 19));
  };

  // Format expiry date
  const handleExpiryInput = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setExpiry(val.substring(0, 5));
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
              <p className="text-xs text-green-600 font-medium">Secure Payment</p>
            </div>
          </div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium"
          >
            <ArrowBackIcon fontSize="small" /> Back to Cart
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="bg-gray-900 p-8 text-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">Payment Details</h2>
              <p className="text-gray-400 text-sm">Complete your purchase securely</p>
            </div>
            <LockIcon fontSize="large" className="text-green-500" />
          </div>

          <div className="p-8">
            <div className="mb-8 p-4 bg-green-50 rounded-xl border border-green-100 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Amount to Pay</p>
                <p className="text-2xl font-bold text-green-700">${totalPrice.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Items</p>
                <p className="font-bold text-gray-900">{cartItems.length}</p>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              {/* Address Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">1. Delivery Address</h3>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full delivery address..."
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all bg-gray-50 resize-none"
                  required
                ></textarea>
              </div>

              {/* Card Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">2. Card Information</h3>
                <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardInput}
                        placeholder="0000 0000 0000 0000"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none bg-white font-mono"
                        maxLength="19"
                      />
                      <CreditCardIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={handleExpiryInput}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none bg-white font-mono"
                        maxLength="5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVV</label>
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                        placeholder="123"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none bg-white font-mono"
                        maxLength="3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-green-600/30 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  `Pay $${totalPrice.toFixed(2)}`
                )}
              </button>
              
              <p className="text-center text-xs text-gray-400">
                This is a secure 256-bit SSL encrypted payment.
              </p>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
