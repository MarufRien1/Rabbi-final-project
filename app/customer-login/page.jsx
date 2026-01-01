'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    const customers = JSON.parse(localStorage.getItem("customers")) || [];

    const found = customers.find(
      (c) => c.email === email && c.password === password
    );

    if (found) {
      localStorage.setItem("userType", "customer");
      localStorage.setItem("currentUser", JSON.stringify(found));

      alert("Customer logged in successfully!");
      router.push("/customer-home");
    } else {
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Customer Login</h2>

        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          placeholder="Enter your email"
        />

        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-lg"
          placeholder="Enter your password"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/customer-signup" className="text-green-600 font-bold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
