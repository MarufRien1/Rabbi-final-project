import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import SecurityIcon from "@mui/icons-material/Security";

export default function CustomerHomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // আগের পুরোনো products clear করা
    localStorage.removeItem("fruits");
    localStorage.removeItem("vegetables");
    localStorage.removeItem("rice");
    localStorage.removeItem("honey");

    // Farmer থেকে add করা সব products collect করা
    const farmerKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("products_")
    );

    let allProducts = [];
    farmerKeys.forEach((key) => {
      const prods = JSON.parse(localStorage.getItem(key)) || [];
      allProducts = [...allProducts, ...prods];
    });

    setProducts(allProducts);
    setFilteredProducts(allProducts);
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
    navigate(`/product/${product.id}`, { state: { product } });
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
            <Link to="/" className="hover:text-gray-200">Home</Link>
          </li>
          <li>
            <Link to="/locations" className="hover:text-gray-200">Division</Link>
          </li>
          <li>
            <Link to="/cart" className="hover:text-gray-200">Cart</Link>
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
                <LocationOnIcon />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className={`px-4 py-3 outline-none font-semibold w-64 ${searchError ? "border-red-500" : ""}`}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setSearchError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                className="px-5 bg-green-600 hover:bg-green-700 flex items-center gap-2 text-white"
                onClick={handleSearch}
              >
                <SearchIcon /> Search
              </button>
            </div>
            {searchError && <span className="text-red-500 text-sm mt-1">No products found!</span>}
          </div>

          {/* Features */}
          <div className="mt-6 flex flex-wrap gap-6 justify-center md:justify-start text-xs text-gray-200">
            <span className="flex items-center gap-1"><SecurityIcon className="w-4 h-4" /> Secure Payments</span>
            <span className="flex items-center gap-1"><LocalShippingIcon className="w-4 h-4" /> Fast Delivery</span>
            <span className="flex items-center gap-1"><LocalFloristIcon className="w-4 h-4" /> Farm Fresh</span>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h3 className="text-2xl font-bold mb-6 text-center">Shop by Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No products available.</p>
          ) : (
            filteredProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-lg transition duration-300">
                {p.img && <img src={p.img} alt={p.title} className="h-40 w-full object-cover" />}
                <div className="p-4 text-center">
                  <p className="font-semibold text-slate-900">{p.title}</p>
                  <p className="text-green-700 font-bold">${p.price?.toFixed(2)}</p>
                  <button
                    onClick={() => handleBuy(p)}
                    className="mt-3 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
