'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (!userStr) {
      router.push("/customer-login");
      return;
    }
    const user = JSON.parse(userStr);

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/user/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

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
              <p className="text-xs text-green-600 font-medium">My Orders</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/customer-home')}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium"
          >
            <ArrowBackIcon fontSize="small" /> Back to Home
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Order History</h2>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white h-40 rounded-3xl animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-gray-50/50">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Order #{order.id}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status === 'Delivered' ? <CheckCircleIcon fontSize="small" /> : <LocalShippingIcon fontSize="small" />}
                      {order.status}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img 
                          src={item.product.img || "/placeholder.jpg"} 
                          alt={item.product.title} 
                          className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{item.product.title}</h4>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                        </div>
                        <p className="font-bold text-gray-900">${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500 font-medium mb-1">Delivery Address:</p>
                    <p className="text-gray-700">{order.address}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <LocalShippingIcon fontSize="large" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              You haven't placed any orders yet. Start shopping to see your history here.
            </p>
            <button
              onClick={() => router.push("/customer-home")}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md"
            >
              Start Shopping
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
