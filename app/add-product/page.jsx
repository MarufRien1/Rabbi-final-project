'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddNewProductPage() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [nature, setNature] = useState("");
  const [file, setFile] = useState(null);
  const [farmerName, setFarmerName] = useState("");

  // Logged-in farmer load করা
  useEffect(() => {
    const logged = localStorage.getItem("loggedFarmer");
    if (!logged) {
      alert("Please login first!");
      router.push("/farmer-login");
      return;
    }
    setFarmerName(logged);
  }, [router]);

  const handleAddProduct = () => {
    if (!name || !price) return alert("Name and Price are required!");
    if (!category) return alert("Please select a category!");
    if (!farmerName) return;

    const saveProduct = (imgData) => {
      const newProduct = {
        id: Date.now(),
        title: name,
        price: Number(price),
        details,
        nature,
        category,
        img: imgData,
      };

      // Farmer-specific key
      const farmerKey = `products_${farmerName}_${category.toLowerCase()}`;
      const existingFarmer = JSON.parse(localStorage.getItem(farmerKey)) || [];
      localStorage.setItem(farmerKey, JSON.stringify([...existingFarmer, newProduct]));

      // General category key (Customer page দেখবে)
      // Note: CustomerHomePage looks at `products_` keys.
      // CategoryPage looks at `products_` keys AND legacy keys.
      // So saving to `products_${farmerName}_${category}` is enough for CustomerHomePage.
      // But CategoryPage also looks at `category.toLowerCase()` key.
      // Let's keep saving to both for compatibility.
      
      const generalKey = category.toLowerCase();
      const existingGeneral = JSON.parse(localStorage.getItem(generalKey)) || [];
      localStorage.setItem(generalKey, JSON.stringify([...existingGeneral, newProduct]));

      // Reset form
      setName("");
      setPrice("");
      setDetails("");
      setNature("");
      setFile(null);

      alert(`${category} product added successfully!`);
      router.push("/farmer-homepage");
    };

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => saveProduct(reader.result);
      reader.onerror = () => alert("Error reading file!");
    } else {
      saveProduct("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f7f5] p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Add New Product
      </h1>

      <div className="max-w-lg mx-auto">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Category</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Rice">Rice</option>
          <option value="Honey">Honey</option>
        </select>

        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            placeholder="Details (Optional)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
          />
          <input
            type="text"
            placeholder="Nature/Origin (Optional)"
            value={nature}
            onChange={(e) => setNature(e.target.value)}
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          />
          
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl text-center">
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden" 
              id="product-img"
            />
            <label htmlFor="product-img" className="cursor-pointer text-green-600 font-semibold">
              {file ? file.name : "Upload Product Image"}
            </label>
          </div>

          <button 
            onClick={handleAddProduct}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
