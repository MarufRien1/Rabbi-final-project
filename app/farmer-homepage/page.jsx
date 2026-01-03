'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SecurityIcon from "@mui/icons-material/Security";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import FilterListIcon from "@mui/icons-material/FilterList";
import toast from "react-hot-toast";

export default function FarmerHomepage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [farmerName, setFarmerName] = useState("");
  const [farmerId, setFarmerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loggedFarmerStr = localStorage.getItem("currentFarmer") || sessionStorage.getItem("currentFarmer");
    if (!loggedFarmerStr) {
       router.push("/farmer-login");
    } else {
      const farmer = JSON.parse(loggedFarmerStr);
      setFarmerName(farmer.name);
      setFarmerId(farmer.id);
    }
  }, [router]);

  useEffect(() => {
    if (farmerId) {
      loadProducts();
      loadOrders();
    }
  }, [farmerId, categoryFilter]);

  const loadOrders = async () => {
    try {
      const res = await fetch(`/api/orders/farmer/${farmerId}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      let url = `/api/products?farmerId=${farmerId}`;
      if (categoryFilter) {
        url += `&category=${categoryFilter}`;
      }
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Order marked as ${newStatus}`);
        loadOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  const handleDelete = (prod) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[200px]">
        <p className="font-medium text-gray-800">Delete "{prod.title}"?</p>
        <div className="flex gap-2 justify-end">
          <button 
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button 
            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
            onClick={() => {
              toast.dismiss(t.id);
              performDelete(prod);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 5000, icon: '🗑️', style: { borderRadius: '1rem', padding: '1rem' } });
  };

  const performDelete = async (prod) => {
    try {
      const res = await fetch(`/api/products/${prod.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success("Product deleted successfully");
        loadProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-600/20">
              <LocalFloristIcon />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 leading-none">AgroMart</h1>
              <p className="text-xs text-green-600 font-medium">Farmer Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm font-medium text-gray-600">
              Welcome, <span className="text-green-700 font-bold">{farmerName}</span>
            </span>
            <button 
              onClick={() => {
                localStorage.removeItem("currentFarmer");
                sessionStorage.removeItem("currentFarmer");
                router.push("/farmer-login");
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-full transition-colors font-medium text-sm"
            >
              <LogoutIcon fontSize="small" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-4 px-2 font-bold text-lg transition-colors relative ${activeTab === "products" ? "text-green-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            My Products
            {activeTab === "products" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 px-2 font-bold text-lg transition-colors relative ${activeTab === "orders" ? "text-green-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Incoming Orders
            {orders.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{orders.length}</span>}
            {activeTab === "orders" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />}
          </button>
        </div>

        {activeTab === "products" ? (
          <>
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Products</h2>
            <p className="text-gray-500 mt-1">Manage your inventory and listings</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-700 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 shadow-sm cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="rice">Rice</option>
                <option value="honey">Honey</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <FilterListIcon fontSize="small" />
              </div>
            </div>
            
            <button
              onClick={() => router.push("/add-product")}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <AddIcon fontSize="small" /> Add New Product
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100 shadow-sm"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                <div className="h-48 overflow-hidden relative bg-gray-100">
                  <img
                    src={product.img || "/placeholder.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop"}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm">
                    {product.category}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                  <p className="text-green-600 font-bold text-lg mb-4">${product.price}</p>
                  
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => router.push(`/edit-product/${product.id}`)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <EditIcon fontSize="small" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      <DeleteIcon fontSize="small" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <LocalFloristIcon fontSize="large" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Start selling your fresh produce by adding your first product to the marketplace.
            </p>
            <button
              onClick={() => router.push("/add-product")}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md"
            >
              <AddIcon /> Add Your First Product
            </button>
          </div>
        )}
        </>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Incoming Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length > 0 ? (
                  orders.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-900 font-medium">#{item.orderId}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.product.img || "/placeholder.jpg"} className="w-10 h-10 rounded-lg object-cover bg-gray-100" alt="" />
                          <span className="text-gray-900">{item.product.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                      <td className="px-6 py-4 text-green-600 font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{item.order.user.name}</p>
                          <p className="text-gray-500">{item.order.user.mobile}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          item.order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          item.order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.order.status === 'Pending' && (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => updateOrderStatus(item.orderId, 'Shipped')}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
                            >
                              Ship to Warehouse
                            </button>
                            <button
                              onClick={() => updateOrderStatus(item.orderId, 'Cancelled')}
                              className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded-full hover:bg-red-200 transition-colors"
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}
                        {item.order.status === 'Shipped' && (
                          <span className="text-xs text-blue-600 font-medium">At Warehouse (Admin Processing)</span>
                        )}
                        {item.order.status === 'Delivered' && (
                          <span className="text-xs text-green-600 font-medium">Completed</span>
                        )}
                        {item.order.status === 'Cancelled' && (
                          <span className="text-xs text-red-600 font-medium">Cancelled</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
