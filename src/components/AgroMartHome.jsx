import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SecurityIcon from "@mui/icons-material/Security";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export default function AgroMartHome() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [farmerName, setFarmerName] = useState(""); // Login হলে set হবে
  const [farmerProducts, setFarmerProducts] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Default products for customers
  const defaultProducts = [
    { id: 1, title: "Vegetables", category: "vegetables", subItems: ["tomato", "potato", "carrot"], price: 2.5, img: "Tomato.jpg" },
    { id: 2, title: "Fruits", category: "fruits", subItems: ["apple", "banana", "mango", "orange"], price: 3.2, img: "Fruits.jpg" },
    { id: 3, title: "Rice/Paddy", category: "rice", subItems: ["basmati", "jasmine", "sela"], price: 12.9, img: "Rice.jpg" },
    { id: 4, title: "Organic Honey (250g)", category: "honey", subItems: ["honey"], price: 6.5, img: "honey1.jpg" },
  ];

  // Load farmer products from localStorage per farmer
  useEffect(() => {
    if (farmerName) {
      const savedProducts = JSON.parse(localStorage.getItem(`products_${farmerName}`));
      setFarmerProducts(savedProducts || []); 
    } else {
      setFarmerProducts([]); 
    }
  }, [farmerName]);

  // Click outside dropdown to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Decide which products to display
  const displayedProducts =
    farmerName && farmerProducts.length > 0
      ? farmerProducts
      : farmerName
      ? [] 
      : defaultProducts;

  // Search function
  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setSearchError(true);
      return;
    }
    const found = displayedProducts.find(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.subItems.some((item) => item.toLowerCase() === term)
    );
    if (found) {
      navigate(`/category/${found.category}`);
      setSearchTerm("");
      setSearchError(false);
    } else {
      setSearchError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-green-600 text-white shadow-sm">
              <LocalFloristIcon />
            </span>
            <div className="leading-tight">
              <p className="font-bold text-xl tracking-tight">AgroMart</p>
              <p className="text-xs text-slate-500">
                Fair price • Fresh produce
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-6 text-lg">
            <a href="#features" className="hover:text-green-700">
              Home
            </a>
            <Link to="/locations" className="hover:text-green-700">
              Division
            </Link>
            <a
              href="#support"
              className="hover:text-green-700 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                navigate("/soil-weather");
              }}
            >
              SoilBar & Weather
            </a>
          </nav>

          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            <button
              className="px-4 py-2 rounded-xl border hover:bg-slate-50"
              onClick={() => navigate("/customer-login")}
            >
              Customer Login
            </button>
            <button
              className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 shadow"
              onClick={() => navigate("/customer-signup")}
            >
              Customer Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-800/80 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid md:grid-cols-2 gap-8 items-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Buy fresh, pay fair — <span className="text-green-400">direct from farmers</span>
            </h1>
            <p className="mt-4 text-slate-200 max-w-prose">
              AgroMart is an online marketplace connecting farmers and customers. No intermediaries — ensuring fair pricing, safe and fresh products, and a smooth buying experience.
            </p>

            <div className="mt-6">
              {/* <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className={`flex-1 px-4 py-3 rounded-2xl border outline-none text-black font-semibold ${
                    searchError ? "border-red-500" : ""
                  }`}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchError(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  className="px-5 py-3 bg-green-600 text-white flex items-center gap-2 rounded-2xl hover:bg-green-700"
                  onClick={handleSearch}
                >
                  <SearchIcon /> Search
                </button>
              </div>
              {searchError && (
                <span className="text-red-500 text-sm mt-1">
                  Please fill this field or product not found!
                </span>
              )} */}

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-200">
                <span className="inline-flex items-center gap-1">
                  <SecurityIcon className="w-4 h-4" /> Secure Payments
                </span>
                <span className="inline-flex items-center gap-1">
                  <LocalShippingIcon className="w-4 h-4" /> Fast Delivery
                </span>
                <span className="inline-flex items-center gap-1">
                  <LocalFloristIcon className="w-4 h-4" /> Farm Fresh
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((p) => (
                  <div key={p.id} className="rounded-3xl overflow-hidden border bg-white shadow-sm">
                    <img src={p.img} alt={p.title} className="h-40 w-full object-cover" />
                    <div className="p-4">
                      <p className="font-semibold text-slate-900">{p.title}</p>
                      <p className="text-green-700 font-bold">${p.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-200 col-span-2 text-center mt-10">
                  No products available for this farmer yet.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="p-8 rounded-3xl bg-slate-900 text-white grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-2xl font-bold">
              Ready to digitize your farm business?
            </h3>
            <p className="mt-2 text-slate-300">
              Join AgroMart to get fair prices and reach customers directly.
            </p>
          </div>
          <div className="flex flex-wrap md:justify-end gap-3 mt-4 md:mt-0">
            <Link
              to="/farmer-signup"
              className="px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700"
            >
              Sign up as Farmer
            </Link>
            <Link
              to="/farmer-login"
              className="px-4 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100"
            >
              Login as Farmer
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-green-600 text-white">
                <LocalFloristIcon />
              </span>
              <span className="font-bold text-xl">AgroMart</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Connecting farmers & customers with fairness, transparency, and trust.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="#features" className="hover:text-green-700">
                  Features
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-green-700">
                  Categories
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-green-700">
                  Farmer Support
                </a>
              </li>
              <li>
                <a href="#how" className="hover:text-green-700">
                  How it works
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-sm text-slate-600">Email: support@agromart.com</p>
            <p className="text-sm text-slate-600">Phone: +880 1234 567 890</p>
          </div>
        </div>
        <div className="text-center text-xs text-slate-500 border-t py-4">
          © {new Date().getFullYear()} AgroMart. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
