import React, { useState, useEffect } from "react";

export default function AddNewProductPage() {
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
      return;
    }
    setFarmerName(logged);
  }, []);

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

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="">Select Category</option>
        <option value="Vegetables">Vegetables</option>
        <option value="Fruits">Fruits</option>
        <option value="Rice">Rice</option>
        <option value="Honey">Honey</option>
      </select>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-lg">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Nature (Fresh, Organic etc.)"
          value={nature}
          onChange={(e) => setNature(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handleAddProduct}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Product
        </button>
      </div>
    </div>
  );
}
