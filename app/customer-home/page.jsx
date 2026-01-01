'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import SecurityIcon from "@mui/icons-material/Security";

export default function CustomerHomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredProducts(products);
      setSearchError(false);
      return;
    }
    const filtered = products.filter((p) =>
      p.title.toLowerCase().includes(term)
    );
    if (filtered.length > 0) {
      setFilteredProducts(filtered);
      setSearchError(false);
    } else {
      setFilteredProducts([]);
      setSearchError(true);
    }
  };

  const handleBuy = (product) => {
    // Next.js router.push doesn't support state. 
    // We will rely on fetching by ID in the product page.
    router.push(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-green-600 text-white py-4 px-6 flex items-center shadow-md sticky top-0 z-30">
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold">AgroMart</h1>
        </div>
        <ul className="flex gap-12 mx-auto font-semibold items-center">
          <li>
            <Link href="/" className="hover:text-gray-200">Home</Link>
          </li>
          <li>
            <Link href="/locations" className="hover:text-gray-200">Division</Link>
          </li>
          <li>
            <Link href="/cart" className="hover:text-gray-200">Cart</Link>
          </li>
        </ul>
      </nav>

      {/* Hero */}
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600')",
        }}
      >
        <div className="bg-gradient-to-r from-gray-900/80 via-gray-800/70 to-transparent py-32 px-4 sm:px-6 lg:px-8 text-white text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Buy Fresh, Pay Fair — Direct from Farmers
          </h2>
          <p className="mt-4 max-w-xl text-gray-200">
            Explore fresh and organic farm products directly from local farmers.
          </p>

          {/* Search */}
          <div className="mt-6 flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
            <div className="flex items-stretch rounded-2xl border shadow-sm overflow-hidden bg-white text-black">
              <div className="px-3 hidden md:flex items-center">
                <SearchIcon className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="px-2 py-3 outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg"
            >
              Search
            </button>
          </div>
          {searchError && (
            <p className="text-red-400 mt-2 font-semibold">
              No products found!
            </p>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Available Products
        </h3>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border"
              >
                <img
                  src={product.img}
                  alt={product.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-bold text-gray-900">
                    {product.title}
                  </h4>
                  <p className="text-green-600 font-bold text-xl mt-1">
                    ${product.price}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Category: {product.category}
                  </p>
                  <button
                    onClick={() => handleBuy(product)}
                    className="mt-4 w-full py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              No products available at the moment.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} AgroMart. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
