'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import SecurityIcon from "@mui/icons-material/Security";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

export default function CustomerHomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((p) =>
        p.title.toLowerCase().includes(term) || 
        p.category.toLowerCase().includes(term)
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleBuy = (product) => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-600/20">
              <LocalFloristIcon />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 leading-none">AgroMart</h1>
              <p className="text-xs text-green-600 font-medium">Customer Portal</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <Link href="/customer-home" className="text-green-600 font-semibold">Home</Link>
            <Link href="/my-orders" className="hover:text-green-600 transition-colors">My Orders</Link>
            <Link href="/locations" className="hover:text-green-600 transition-colors">Division</Link>
            <Link href="/cart" className="hover:text-green-600 transition-colors flex items-center gap-1">
              <ShoppingCartIcon fontSize="small" /> Cart
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-full transition-colors font-medium text-sm"
            >
              <LogoutIcon fontSize="small" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero / Search Section */}
      <section className="bg-green-600 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Welcome Back!
          </motion.h1>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Find fresh, organic produce directly from farmers near you.
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for vegetables, fruits, rice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-6 pr-14 py-4 rounded-full text-gray-900 outline-none shadow-lg focus:ring-4 focus:ring-green-500/30 transition-all"
            />
            <button className="absolute right-2 top-2 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
              <SearchIcon />
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Available Products</h2>
          <span className="text-gray-500 text-sm">{filteredProducts.length} items found</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-80 animate-pulse shadow-sm border border-gray-100"></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={product.img || "/placeholder.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop"}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm">
                    {product.category}
                  </div>
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{product.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.details || "Fresh from the farm"}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-xs text-gray-400">Price</p>
                      <p className="text-green-600 font-bold text-lg">${product.price}</p>
                    </div>
                    <div className="text-right mr-4">
                       <p className="text-xs text-gray-400">Stock</p>
                       <p className={`font-bold text-sm ${product.stock > 0 ? 'text-gray-700' : 'text-red-500'}`}>
                         {product.stock > 0 ? product.stock : '0'}
                       </p>
                    </div>
                    <button
                      onClick={() => handleBuy(product)}
                      disabled={product.stock <= 0}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors shadow-md ${
                        product.stock > 0 
                        ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {product.stock > 0 ? "View Details" : "Sold Out"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <SearchIcon fontSize="large" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
          </div>
        )}
      </section>
    </div>
  );
}
