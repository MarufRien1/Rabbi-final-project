'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomerSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    // Load existing customers from localStorage
    const existingCustomers = JSON.parse(localStorage.getItem("customers")) || [];

    // Check if email already exists
    const emailExists = existingCustomers.some((c) => c.email === email);
    if (emailExists) {
      setError("Email already registered");
      return;
    }

    // Add new customer
    const newCustomer = { name, email, password };
    localStorage.setItem("customers", JSON.stringify([...existingCustomers, newCustomer]));

    alert("Account created successfully!");
    router.push("/customer-login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Customer Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-4 py-2 rounded-lg outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-4 py-2 rounded-lg outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-4 py-2 rounded-lg outline-none"
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/customer-login" className="text-green-600 font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
