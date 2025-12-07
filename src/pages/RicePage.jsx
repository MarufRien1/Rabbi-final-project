import React, { useState, useEffect } from "react";
import { products as initialProducts } from "../data/products";

export default function RicePage() {
  const storedRice = JSON.parse(localStorage.getItem("rice")) || [];
  const [products, setProducts] = useState([
    ...initialProducts.filter((p) => p.category === "rice"),
    ...storedRice,
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newPerKg, setNewPerKg] = useState("");
  const [newOrigin, setNewOrigin] = useState("");
  const [newFreshness, setNewFreshness] = useState("");
  const [newDetails, setNewDetails] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const farmerUser = JSON.parse(localStorage.getItem("farmerUser"));

  useEffect(() => {
    if (!newFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(newFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [newFile]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newProduct = {
        id: Date.now(),
        title: newTitle,
        category: "rice",
        price: parseFloat(newPrice),
        perKg: newPerKg ? parseFloat(newPerKg) : null,
        origin: newOrigin || null,
        freshness: newFreshness || null,
        details: newDetails || null,
        img: reader.result,
      };

      setProducts((prev) => [...prev, newProduct]);

      const existing = JSON.parse(localStorage.getItem("rice")) || [];
      localStorage.setItem("rice", JSON.stringify([...existing, newProduct]));

      setNewTitle("");
      setNewPrice("");
      setNewPerKg("");
      setNewOrigin("");
      setNewFreshness("");
      setNewDetails("");
      setNewFile(null);
      setPreview(null);
    };
    reader.readAsDataURL(newFile);
  };

  const handleDelete = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem(
      "rice",
      JSON.stringify(updated.filter((p) => p.category === "rice"))
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-5 capitalize">Rice & Grains</h2>

      {farmerUser && (
        <div className="mb-6 p-4 bg-white rounded-xl shadow">
          <h3 className="font-semibold mb-3">Add Your Rice/Paddy Product</h3>
          <form
            className="flex flex-col md:flex-row gap-3 flex-wrap"
            onSubmit={handleAddProduct}
          >
            <input
              type="text"
              placeholder="Rice Name"
              className="p-2 border rounded flex-1"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price"
              className="p-2 border rounded w-24"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Per Kg Price"
              className="p-2 border rounded w-28"
              value={newPerKg}
              onChange={(e) => setNewPerKg(e.target.value)}
            />
            <input
              type="text"
              placeholder="Origin"
              className="p-2 border rounded flex-1"
              value={newOrigin}
              onChange={(e) => setNewOrigin(e.target.value)}
            />
            <input
              type="text"
              placeholder="Freshness"
              className="p-2 border rounded flex-1"
              value={newFreshness}
              onChange={(e) => setNewFreshness(e.target.value)}
            />
            <input
              type="text"
              placeholder="Additional Details"
              className="p-2 border rounded flex-1"
              value={newDetails}
              onChange={(e) => setNewDetails(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="p-2 border rounded flex-1"
              onChange={(e) => setNewFile(e.target.files[0])}
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add
            </button>
          </form>
          {/* Preview Image */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 object-cover rounded w-[250px] h-[250px]" // boro kore dilam
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow p-3 relative flex flex-col"
          >
            <img
              src={p.img}
              alt={p.title}
              className="w-full h-48 object-cover rounded mb-2"
            />

            <p className="font-semibold text-lg">{p.title}</p>

            <p className="text-gray-600 text-sm mb-1">
              {p.perKg ? `Price per kg: $${p.perKg}` : "Price per kg: Not set"}
            </p>

            <p className="text-green-700 font-bold mb-1">${p.price}</p>

            <div className="text-sm text-gray-500 mb-2 space-y-1">
              {p.origin && <p>Origin: {p.origin}</p>}
              {p.freshness && <p>Freshness: {p.freshness}</p>}
              {p.details && <p>Info: {p.details}</p>}
              {!p.origin && !p.freshness && !p.details && (
                <p>No additional details</p>
              )}
            </div>

            {/* Delete Button */}
            {farmerUser && (
              <button
                onClick={() => handleDelete(p.id)}
                className="absolute top-2 right-2 text-red-600 font-bold hover:text-red-800"
              >
                X
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
