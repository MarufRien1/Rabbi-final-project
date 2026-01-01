'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";

export default function FarmerLogin() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!mobile || !password) {
      setError("All fields are required!");
      return;
    }

    // localStorage থেকে Array আকারে Data নিন
    let savedUsers = [];
    try {
      savedUsers = JSON.parse(localStorage.getItem("farmerUser")) || [];
      if (!Array.isArray(savedUsers)) {
        savedUsers = []; // যদি Array না হয়, খালি Array বানান
      }
    } catch (err) {
      savedUsers = [];
    }

    // Find user by mobile
    const savedUser = savedUsers.find((user) => user.mobile === mobile);

    if (!savedUser) {
      setError("No account found! Please sign up first.");
      return;
    }

    if (savedUser.password !== password) {
      setError("Invalid mobile or password!");
      return;
    }

    // login successful
    localStorage.setItem("loggedFarmer", savedUser.name);
    setError("");
    router.push("/farmer-homepage");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-green-100">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mb-2">
            <LocalFloristIcon fontSize="large" />
          </div>
          <h2 className="text-2xl font-bold text-green-800">Farmer Login</h2>
          <p className="text-sm text-gray-500">Welcome back to AgroMart</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="01XXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/farmer-signup" className="text-green-600 font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
