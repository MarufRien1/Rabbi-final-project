'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SecurityIcon from "@mui/icons-material/Security";
import toast from "react-hot-toast";

export default function FarmerHomepage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [farmerName, setFarmerName] = useState("");

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
      // Store ID in state to trigger loadProducts
      setFarmerId(farmer.id);
    }
  }, [router]);

  const [farmerId, setFarmerId] = useState(null);

  useEffect(() => {
    if (farmerId) loadProducts();
  }, [farmerId, categoryFilter]);

  const loadProducts = async () => {
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
    }
  };

  const handleDelete = (prod) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium">Delete {prod.title}?</p>
        <div className="flex gap-2 justify-end">
          <button 
            className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button 
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            onClick={() => {
              toast.dismiss(t.id);
              performDelete(prod);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 5000, icon: '🗑️' });
  };

  const performDelete = async (prod) => {
    try {
      const res = await fetch(`/api/products/${prod.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success("Product deleted successfully");
        loadProducts(); // Reload list
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f2f7f5]">
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
          <LocalFloristIcon /> AgroMart Farmer
        </h1>
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push("/customer-home")}
            className="hover:text-green-600 font-semibold"
          >
            Customer View
          </button>
          <ShoppingCartIcon className="text-green-700 cursor-pointer" />
        </div>
      </nav>

      <div className="px-6 mt-8 flex flex-col md:flex-row gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-green-700 text-white py-8 px-6 rounded-2xl shadow-lg flex-1 cursor-pointer"
          onClick={() => router.push("/add-product")}
        >
          <h2 className="text-3xl font-bold">Add New Product 🌾</h2>
          <p className="mt-2 text-lg">Upload crops, vegetables, fruits and more.</p>
        </motion.div>

        <div className="bg-white p-6 rounded-xl shadow-md flex-1">
          <h3 className="text-xl font-semibold text-green-700 mb-2">
            Filter by Category
          </h3>
          <select
            className="border p-2 rounded w-full"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Rice">Rice</option>
            <option value="Honey">Honey</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-6 pb-10">
        {products.length > 0 ? (
          products.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow-md">
              <img src={p.img} alt={p.title} className="w-full h-40 object-cover rounded-lg" />
              <h3 className="text-lg font-bold mt-2">{p.title}</h3>
              <p className="text-green-600 font-bold">${p.price}</p>
              <p className="text-sm text-gray-500 capitalize">{p.category}</p>
              <button 
                onClick={() => handleDelete(p)}
                className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Delete Product
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-3 text-center">No products found. Start adding some!</p>
        )}
      </div>
    </div>
  );
}
