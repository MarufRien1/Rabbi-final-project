'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { products as staticProducts } from "../../data/products";

export default function ProductBuyPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.quantity += quantity;
    else cart.push({ ...product, quantity });
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/cart");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow p-6 flex flex-col md:flex-row gap-6">
        <img src={product.img} alt={product.title} className="w-full md:w-1/2 h-64 object-cover rounded-xl" />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold">{product.title}</h2>
            <p className="text-green-700 font-bold text-xl mt-2">${product.price?.toFixed(2)}</p>
            <p className="mt-4 text-gray-600">{product.description || ""}</p>
            <div className="mt-4 flex items-center gap-2">
              <label>Quantity:</label>
              <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="border rounded px-2 py-1 w-20"/>
            </div>
          </div>
          <button onClick={handleAddToCart} className="mt-6 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
