'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";

export default function FarmerSignup() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !mobile || !password) {
      setError("All fields are required!");
      setSuccess("");
      return;
    }

    // localStorage থেকে existing users নিয়ে আসা
    let existingUsers = [];
    try {
      existingUsers = JSON.parse(localStorage.getItem("farmerUser")) || [];
      if (!Array.isArray(existingUsers)) {
        existingUsers = [];
      }
    } catch (err) {
      existingUsers = [];
    }

    // Mobile number check
    const userExists = existingUsers.some((user) => user.mobile === mobile);
    if (userExists) {
      setError("Mobile number already registered! Please login.");
      setSuccess("");
      return;
    }

    // নতুন user add করা
    const newUser = { name, mobile, password };
    existingUsers.push(newUser);
    localStorage.setItem("farmerUser", JSON.stringify(existingUsers));

    // ইনপুট ফিল্ডগুলো পরিষ্কার করা
    setName("");
    setMobile("");
    setPassword("");

    setSuccess("Account created successfully! Redirecting...");
    setError("");

    setTimeout(() => {
      router.push("/farmer-login");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-green-100">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mb-2">
            <LocalFloristIcon fontSize="large" />
          </div>
          <h2 className="text-2xl font-bold text-green-800">Farmer Sign Up</h2>
          <p className="text-sm text-gray-500">Join AgroMart to sell your products</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm text-center border border-green-100">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="Your Name"
            />
          </div>

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
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/farmer-login" className="text-green-600 font-bold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
