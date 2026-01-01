'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

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
    
    toast.success(
      <div className="flex flex-col">
        <span className="font-bold">Added to Cart!</span>
        <span className="text-sm">{quantity}x {product.title}</span>
      </div>
    );
    // Optional: Redirect or stay. Let's stay but maybe show a "Go to Cart" button in toast?
    // For now, simple toast is good.
  };

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="animate-pulse flex flex-col md:flex-row gap-8 max-w-4xl w-full bg-white p-8 rounded-3xl shadow-sm">
        <div className="w-full md:w-1/2 h-80 bg-gray-200 rounded-2xl"></div>
        <div className="flex-1 space-y-4 py-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded w-full"></div>
          <div className="h-12 bg-gray-200 rounded w-1/3 mt-8"></div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
      <button onClick={() => router.back()} className="text-green-600 hover:underline">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors font-medium"
        >
          <ArrowBackIcon /> Back to Products
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-gray-100 relative group">
            <img 
              src={product.img} 
              alt={product.title} 
              className="w-full h-full object-cover min-h-[400px] transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-green-800 shadow-sm">
              {product.category}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 p-8 md:p-12 flex flex-col">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-green-600">${product.price?.toFixed(2)}</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Per Unit</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {product.description || "No description available for this product. Fresh from the farm to your table."}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                <LocalShippingIcon className="text-green-600" />
                <span className="text-sm font-medium">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                <VerifiedUserIcon className="text-green-600" />
                <span className="text-sm font-medium">Quality Assured</span>
              </div>
            </div>

            <div className="mt-auto border-t pt-8">
              <div className="flex items-center gap-6 mb-6">
                <span className="font-bold text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button 
                    onClick={decrement}
                    className="px-4 py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  >
                    <RemoveIcon fontSize="small" />
                  </button>
                  <span className="px-4 py-2 font-bold min-w-[3rem] text-center">{quantity}</span>
                  <button 
                    onClick={increment}
                    className="px-4 py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  >
                    <AddIcon fontSize="small" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart} 
                  className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200 flex items-center justify-center gap-2 active:scale-95 transform"
                >
                  <ShoppingCartIcon /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
