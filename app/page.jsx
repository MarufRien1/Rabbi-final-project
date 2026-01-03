'use client';

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SecurityIcon from "@mui/icons-material/Security";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function AgroMartHome() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [farmerName, setFarmerName] = useState(""); // Login হলে set হবে
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); // 'customer' or 'farmer'

  useEffect(() => {
    const checkLogin = () => {
      const farmer = localStorage.getItem("currentFarmer") || sessionStorage.getItem("currentFarmer");
      const customer = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
      const admin = localStorage.getItem("adminAuth") || sessionStorage.getItem("adminAuth");
      
      if (farmer) {
        setIsLoggedIn(true);
        setUserRole("farmer");
      } else if (customer) {
        setIsLoggedIn(true);
        setUserRole("customer");
      } else if (admin) {
        setIsLoggedIn(true);
        setUserRole("admin");
      } else {
        setIsLoggedIn(false);
        setUserRole("");
      }
    };
    
    checkLogin();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserRole("");
    setDropdownOpen(false);
    router.push("/");
  };
  const [farmerProducts, setFarmerProducts] = useState([]);
  const dropdownRef = useRef(null);

  // Default products for customers
  const defaultProducts = [
    { id: 1, title: "Vegetables", category: "vegetables", subItems: ["tomato", "potato", "carrot"], price: 2.5, img: "/Tomato.jpg" },
    { id: 2, title: "Fruits", category: "fruits", subItems: ["apple", "banana", "mango", "orange"], price: 3.2, img: "/Fruits.jpg" },
    { id: 3, title: "Rice/Paddy", category: "rice", subItems: ["basmati", "jasmine", "sela"], price: 12.9, img: "/Rice.jpg" },
    { id: 4, title: "Organic Honey (250g)", category: "honey", subItems: ["honey"], price: 6.5, img: "/honey1.jpg" },
  ];

  // Load farmer products from localStorage per farmer
  useEffect(() => {
    if (farmerName) {
      const savedProducts = JSON.parse(localStorage.getItem(`products_${farmerName}`));
      setFarmerProducts(savedProducts || []); 
    } else {
      setFarmerProducts([]); 
    }
  }, [farmerName]);

  // Click outside dropdown to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Decide which products to display
  const displayedProducts =
    farmerName && farmerProducts.length > 0
      ? farmerProducts
      : farmerName
      ? [] 
      : defaultProducts;

  // Search function
  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setSearchError(true);
      return;
    }
    const found = displayedProducts.find(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.subItems.some((item) => item.toLowerCase() === term)
    );
    if (found) {
      router.push(`/category/${found.category}`);
      setSearchTerm("");
      setSearchError(false);
    } else {
      setSearchError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-600/20">
              <LocalFloristIcon />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 leading-none">AgroMart</h1>
              <p className="text-xs text-green-600 font-medium">Fresh & Organic</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <a href="#" className="hover:text-green-600 transition-colors">Home</a>
            <a href="#products" className="hover:text-green-600 transition-colors">Products</a>
            <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-green-600 transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <PersonIcon fontSize="small" />
                    {userRole === 'farmer' ? 'Farmer Dashboard' : 'My Account'}
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
                      <div className="p-2">
                        <Link href={userRole === 'farmer' ? "/farmer-homepage" : userRole === 'admin' ? "/admin-dashboard" : "/customer-home"} className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 rounded-xl text-gray-700 hover:text-green-700 transition-colors">
                          <DashboardIcon fontSize="small" /> Dashboard
                        </Link>
                        {userRole === 'customer' && (
                          <Link href="/my-orders" className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 rounded-xl text-gray-700 hover:text-green-700 transition-colors">
                            <LocalShippingIcon fontSize="small" /> My Orders
                          </Link>
                        )}
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl text-red-600 hover:text-red-700 transition-colors text-left">
                          <LogoutIcon fontSize="small" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <LoginIcon fontSize="small" />
                    Login / Sign Up
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
                      <div className="p-2">
                        <Link href="/customer-login" className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 rounded-xl text-gray-700 hover:text-green-700 transition-colors">
                          <PersonIcon fontSize="small" /> Customer Login
                        </Link>
                        <Link href="/farmer-login" className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 rounded-xl text-gray-700 hover:text-green-700 transition-colors">
                          <LocalFloristIcon fontSize="small" /> Farmer Login
                        </Link>
                        <Link href="/admin-login" className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 rounded-xl text-gray-700 hover:text-green-700 transition-colors">
                          <AdminPanelSettingsIcon fontSize="small" /> Admin Login
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-white -z-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mask-image-gradient"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-6">
                #1 Marketplace for Farmers & Consumers
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                Fresh from <span className="text-green-600">Farm</span> <br/>
                to your <span className="text-green-600">Table</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                Connect directly with local farmers. Get fresh, organic produce delivered to your doorstep at fair prices.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <div className="relative w-full max-w-md">
                  <input 
                    type="text" 
                    placeholder="Search for vegetables, fruits..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className={`w-full pl-6 pr-14 py-4 rounded-full border-2 outline-none shadow-sm transition-all ${
                      searchError ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                    }`}
                  />
                  <button 
                    onClick={handleSearch}
                    className="absolute right-2 top-2 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                  >
                    <SearchIcon />
                  </button>
                </div>
              </div>
              {searchError && <p className="text-red-500 text-sm mt-2">Product not found. Try 'Vegetables' or 'Fruits'.</p>}
            </motion.div>
          </div>
          
          <div className="flex-1 relative">
            <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              src="/Vegetables.png" 
              alt="Fresh Vegetables" 
              className="w-full max-w-lg mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              onError={(e) => e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop"}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AgroMart?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We bridge the gap between farmers and consumers, ensuring fair prices and fresh quality.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <LocalShippingIcon fontSize="large" />, title: "Fast Delivery", desc: "Get your products delivered within 24 hours of harvest." },
              { icon: <SecurityIcon fontSize="large" />, title: "Secure Payment", desc: "100% secure payment gateways for hassle-free transactions." },
              { icon: <LocationOnIcon fontSize="large" />, title: "Live Tracking", desc: "Track your order from the farm to your doorstep in real-time." },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 bg-gray-50 rounded-3xl text-center hover:bg-green-50 transition-colors border border-gray-100"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm mx-auto mb-6 text-3xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Categories</h2>
              <p className="text-gray-500">Find what you need from our wide range of products.</p>
            </div>
            <Link href={isLoggedIn ? (userRole === 'farmer' ? "/farmer-homepage" : "/customer-home") : "/customer-login"} className="text-green-600 font-bold hover:underline">View All →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {defaultProducts.map((product) => (
              <Link href={`/category/${product.category}`} key={product.id}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={product.img} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => e.target.src = "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop"}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 capitalize">{product.subItems.slice(0, 2).join(", ")}...</p>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">
                        From ${product.price}
                      </span>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <ShoppingCartIcon fontSize="small" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white">
                  <LocalFloristIcon />
                </div>
                <span className="text-2xl font-bold">AgroMart</span>
              </div>
              <p className="text-gray-400 max-w-sm leading-relaxed">
                Empowering farmers and connecting them directly with consumers for a sustainable and fair agricultural ecosystem.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-green-500 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-green-500 transition-colors">About Us</a></li>
                <li><a href="#products" className="hover:text-green-500 transition-colors">Products</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center gap-3">
                  <LocationOnIcon className="text-green-600" /> Dhaka, Bangladesh
                </li>
                <li className="flex items-center gap-3">
                  <LocalShippingIcon className="text-green-600" /> support@agromart.com
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AgroMart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
