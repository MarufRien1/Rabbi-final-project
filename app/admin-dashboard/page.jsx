'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalFarmers: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("adminAuth") || sessionStorage.getItem("adminAuth");
    if (!isAdmin) {
      router.push("/admin-login");
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/orders')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Order #${orderId} marked as ${newStatus}`);
        fetchData(); // Refresh data
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    sessionStorage.removeItem("adminAuth");
    router.push("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white fixed h-full hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
            <AdminPanelSettingsIcon />
          </div>
          <div>
            <h1 className="font-bold text-lg">AgroMart</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="px-4 py-3 bg-green-600 rounded-xl font-medium flex items-center gap-3 cursor-pointer">
            <ShoppingBagIcon fontSize="small" /> Orders
          </div>
          {/* Add more nav items here if needed */}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <LogoutIcon fontSize="small" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
          <div className="md:hidden">
            <button onClick={handleLogout} className="text-red-500 font-medium">Logout</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Revenue" 
            value={`$${stats.totalRevenue.toFixed(2)}`} 
            icon={<AttachMoneyIcon className="text-green-600" />} 
            color="bg-green-50"
          />
          <StatCard 
            title="Total Orders" 
            value={stats.totalOrders} 
            icon={<ShoppingBagIcon className="text-blue-600" />} 
            color="bg-blue-50"
          />
          <StatCard 
            title="Total Farmers" 
            value={stats.totalFarmers} 
            icon={<LocalFloristIcon className="text-orange-600" />} 
            color="bg-orange-50"
          />
          <StatCard 
            title="Total Customers" 
            value={stats.totalCustomers} 
            icon={<PeopleIcon className="text-purple-600" />} 
            color="bg-purple-50"
          />
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan="7" className="px-6 py-8 text-center">Loading...</td></tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium">#{order.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{order.user.name}</p>
                        <p className="text-xs text-gray-500">{order.user.mobile}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.items.length} items
                      </td>
                      <td className="px-6 py-4 font-bold text-green-600">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring focus:ring-green-500/20"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
      </div>
    </div>
  );
}
