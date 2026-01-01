'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SecurityIcon from "@mui/icons-material/Security";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import FilterListIcon from "@mui/icons-material/FilterList";
import toast from "react-hot-toast";

export default function FarmerHomepage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [farmerName, setFarmerName] = useState("");
  const [farmerId, setFarmerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loggedFarmerStr = localStorage.getItem("currentFarmer");
    if (!loggedFarmerStr) {
       const logged = localStorage.getItem("loggedFarmer");
       if (!logged) {
         router.push("/farmer-login");
         return;
       }
       toast.error("Please login again to refresh your session.");
       router.push("/farmer-login");
    } else {
      const farmer = JSON.parse(loggedFarmerStr);
      setFarmerName(farmer.name);
      setFarmerId(farmer.id);
    }
  }, [router]);

  useEffect(() => {
    if (farmerId) loadProducts();
  }, [farmerId, categoryFilter]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      let url = `/api/products?farmerId=${farmerId}`;
      if (categoryFilter) {
        url += `&category=${categoryFilter}`;
      }
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (prod) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[200px]">
        <p className="font-medium text-gray-800">Delete "{prod.title}"?</p>
        <div className="flex gap-2 justify-end">
          <button 
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button 
            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
            onClick={() => {
              toast.dismiss(t.id);
              performDelete(prod);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 5000, icon: '🗑️', style: { borderRadius: '1rem', padding: '1rem' } });
  };

  const performDelete = async (prod) => {
    try {
      const res = await fetch(`/api/products/${prod.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success("Product deleted successfully");
        loadProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-600/20">
              <LocalFloristIcon />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 leading-none">AgroMart</h1>
              <p className="text-xs text-green-600 font-medium">Farmer Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm font-medium text-gray-600">
              Welcome, <span className="text-green-700 font-bold">{farmerName}</span>
            </span>
            <button 
              onClick={() => {
                localStorage.removeItem("currentFarmer");
                router.push("/farmer-login");
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-full transition-colors font-medium text-sm"
            >
              <LogoutIcon fontSize="small" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Products</h2>
            <p className="text-gray-500 mt-1">Manage your inventory and listings</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-700 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 shadow-sm cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="rice">Rice</option>
                <option value="honey">Honey</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <FilterListIcon fontSize="small" />
              </div>
            </div>
            
            <button
              onClick={() => router.push("/add-product")}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <AddIcon fontSize="small" /> Add New Product
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100 shadow-sm"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                <div className="h-48 overflow-hidden relative bg-gray-100">
                  <img
                    src={product.img || "/placeholder.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop"}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm">
                    {product.category}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                  <p className="text-green-600 font-bold text-lg mb-4">${product.price}</p>
                  
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => router.push(`/edit-product/${product.id}`)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <EditIcon fontSize="small" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      <DeleteIcon fontSize="small" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <LocalFloristIcon fontSize="large" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Start selling your fresh produce by adding your first product to the marketplace.
            </p>
            <button
              onClick={() => router.push("/add-product")}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md"
            >
              <AddIcon /> Add Your First Product
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
