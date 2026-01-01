'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { products as staticProducts } from "../../data/products";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { category } = params; // e.g., "fruits", "vegetables"
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products?category=${category}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category]);
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold capitalize">{category}</h1>
          <Link href="/" className="text-green-600 hover:underline">Back to Home</Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border">
                <img
                  src={product.img}
                  alt={product.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-bold text-gray-900">{product.title}</h4>
                  <p className="text-green-600 font-bold text-xl mt-1">${product.price}</p>
                  <button
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="mt-4 w-full py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No products found in this category.</p>
        )}
      </div>
    </div>
  );
}
