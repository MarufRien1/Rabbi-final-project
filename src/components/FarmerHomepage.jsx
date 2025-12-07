import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SecurityIcon from "@mui/icons-material/Security";

export default function FarmerHomepage() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [farmerName, setFarmerName] = useState("");

  useEffect(() => {
    const logged = localStorage.getItem("loggedFarmer");
    if (!logged) {
      navigate("/farmer-login");
    } else {
      setFarmerName(logged);
    }
  }, [navigate]);

  useEffect(() => {
    if (farmerName) loadProducts();
  }, [farmerName, categoryFilter]);

  const loadProducts = () => {
    const categories = ["vegetables", "fruits", "rice", "honey"];
    let allProducts = [];

    categories.forEach((cat) => {
      const key = `products_${farmerName}_${cat}`;
      const savedProducts = JSON.parse(localStorage.getItem(key)) || [];
      allProducts = [...allProducts, ...savedProducts];
    });

    const filtered = categoryFilter
      ? allProducts.filter(
          (p) => p.category.toLowerCase() === categoryFilter.toLowerCase()
        )
      : allProducts;

    setProducts(filtered);
  };

  const handleDelete = (prod) => {
    const key = `products_${farmerName}_${prod.category.toLowerCase()}`;
    const savedProducts = JSON.parse(localStorage.getItem(key)) || [];
    const updated = savedProducts.filter((p) => p.id !== prod.id);
    localStorage.setItem(key, JSON.stringify(updated));
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
            onClick={() => navigate("/customer-home")}
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
          onClick={() => navigate("/add-product")}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-6">
        {products.length > 0 ? (
          products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white p-4 rounded-xl shadow-md relative"
            >
              {prod.img && (
                <img
                  src={prod.img}
                  alt={prod.title}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <h3 className="text-lg font-bold mt-2">{prod.title}</h3>
              <p>Price: ${prod.price}</p>
              <p>Details: {prod.details}</p>
              <p>Nature: {prod.nature}</p>
              <p>Category: {prod.category}</p>
              <button
                onClick={() => handleDelete(prod)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-3 text-center mt-10">
            No products available. Add some!
          </p>
        )}
      </div>

      <footer className="mt-16 bg-white py-6 text-center border-t">
        <p className="text-gray-600">
          <SecurityIcon /> Secured by AgroMart © 2025
        </p>
      </footer>
    </div>
  );
}
