'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { category } = params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Simulate network delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const res = await fetch(`/api/products?category=${category}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
           setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ArrowBackIcon />
            </button>
            <h1 className="text-xl font-bold text-gray-800 capitalize flex items-center gap-2">
              <span className="w-2 h-6 bg-green-500 rounded-full"></span>
              {category}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
              <FilterListIcon />
            </button>
            <Link href="/cart" className="p-2 text-green-600 hover:bg-green-50 rounded-full transition relative">
              <ShoppingCartIcon />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                onClick={() => router.push(`/product/${product.id}`)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <button className="absolute bottom-3 right-3 bg-white text-green-600 p-2 rounded-full shadow-lg translate-y-10 group-hover:translate-y-0 transition-transform duration-300 hover:bg-green-600 hover:text-white">
                    <ShoppingCartIcon fontSize="small" />
                  </button>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-gray-800 group-hover:text-green-700 transition-colors line-clamp-1">
                      {product.title}
                    </h4>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                      {product.unit || 'kg'}
                    </span>
                  </div>
                  
                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="text-xl font-bold text-green-600">${product.price}</p>
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-green-600 transition-colors flex items-center gap-1">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FilterListIcon className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500">We couldn't find any items in the {category} category.</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition"
            >
              Browse All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
