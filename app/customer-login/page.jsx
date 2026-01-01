'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function CustomerLogin() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData) => {
    setServerError("");
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'customer' }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userType", "customer");
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        toast.success("Customer logged in successfully!");
        router.push("/customer-home");
      } else {
        setServerError(data.error || "Invalid email or password!");
        toast.error(data.error || "Invalid email or password!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setServerError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Customer Login</h2>
        {serverError && <p className="text-red-500 mb-4 text-center">{serverError}</p>}

        <label className="block mb-2 font-semibold">Email</label>
        <div className="mb-4">
          <input
            type="email"
            {...register("email")}
            className={`w-full px-4 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <label className="block mb-2 font-semibold">Password</label>
        <div className="mb-6">
          <input
            type="password"
            {...register("password")}
            className={`w-full px-4 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
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
