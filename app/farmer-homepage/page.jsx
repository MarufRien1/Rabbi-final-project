'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SecurityIcon from "@mui/icons-material/Security";

export default function FarmerHomepage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [farmerName, setFarmerName] = useState("");

  useEffect(() => {
    const logged = localStorage.getItem("loggedFarmer");
    if (!logged) {
      router.push("/farmer-login");
    } else {
      setFarmerName(logged);
    }
  }, [router]);

  useEffect(() => {
    if (farmerName) loadProducts();
  }, [farmerName, categoryFilter]);

  const loadProducts = () => {
    // Note: In AddNewProductPage, we need to see how products are saved.
    // Assuming they are saved with keys like `products_${farmerName}` or `products_${farmerName}_${category}`.
    // The original code used `products_${farmerName}_${cat}`.
    // But CustomerHomePage used `products_` prefix.
    // Let's stick to the original logic here for now.
    
    const categories = ["vegetables", "fruits", "rice", "honey"];
    let allProducts = [];

    // Also check for generic `products_${farmerName}` key if used elsewhere
    const genericKey = `products_${farmerName}`;
    const genericProducts = JSON.parse(localStorage.getItem(genericKey)) || [];
    allProducts = [...genericProducts];

    categories.forEach((cat) => {
      const key = `products_${farmerName}_${cat}`;
      const savedProducts = JSON.parse(localStorage.getItem(key)) || [];
      allProducts = [...allProducts, ...savedProducts];
    });

    // Remove duplicates by ID
    allProducts = Array.from(new Map(allProducts.map(item => [item.id, item])).values());

    const filtered = categoryFilter
      ? allProducts.filter(
          (p) => p.category.toLowerCase() === categoryFilter.toLowerCase()
        )
      : allProducts;

    setProducts(filtered);
  };

  const handleDelete = (prod) => {
    // Try to delete from specific category key first
    const catKey = `products_${farmerName}_${prod.category.toLowerCase()}`;
    let savedProducts = JSON.parse(localStorage.getItem(catKey)) || [];
    let updated = savedProducts.filter((p) => p.id !== prod.id);
    
    if (savedProducts.length !== updated.length) {
        localStorage.setItem(catKey, JSON.stringify(updated));
    } else {
        // Try generic key
        const genericKey = `products_${farmerName}`;
        savedProducts = JSON.parse(localStorage.getItem(genericKey)) || [];
        updated = savedProducts.filter((p) => p.id !== prod.id);
        localStorage.setItem(genericKey, JSON.stringify(updated));
    }
    
    loadProducts();
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
