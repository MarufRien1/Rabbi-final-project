'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const farmerLoginSchema = z.object({
  mobile: z.string().min(1, "Mobile number is required"),
  password: z.string().min(1, "Password is required"),
});

export default function FarmerLogin() {
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(farmerLoginSchema),
  });

  const onSubmit = async (formData) => {
    setServerError("");

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'farmer' }),
      });

      const data = await res.json();

      if (res.ok) {
        // login successful
        toast.success("Login successful!");
        localStorage.setItem("loggedFarmer", data.user.name);
        localStorage.setItem("currentFarmer", JSON.stringify(data.user)); // Store full object for ID access
        router.push("/farmer-homepage");
      } else {
        const errorMsg = data.error || "Invalid mobile or password!";
        setServerError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Login error:", err);
      setServerError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
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

        {serverError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-100">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
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
