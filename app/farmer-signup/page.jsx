'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const farmerSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().regex(/^\d{11}$/, "Mobile number must be 11 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function FarmerSignup() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(farmerSignupSchema),
  });

  const onSubmit = async (formData) => {
    setServerError("");
    setSuccess("");

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'farmer' }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Account created successfully! Redirecting...");
        toast.success("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/farmer-login");
        }, 1500);
      } else {
        setServerError(data.error || "Signup failed");
        toast.error(data.error || "Signup failed");
      }
    } catch (err) {
      setServerError("Something went wrong");
      toast.error("Something went wrong");
    }
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

        {serverError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-100">
            {serverError}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm text-center border border-green-100">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register("name")}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your Name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              {...register("mobile")}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="01XXXXXXXXX"
            />
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

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
