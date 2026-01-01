'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const farmerLoginSchema = z.object({
  mobile: z.string().min(1, "Mobile number is required"),
  password: z.string().min(1, "Password is required"),
});

export default function FarmerLogin() {
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'farmer' }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful!");
        localStorage.setItem("loggedFarmer", data.user.name);
        localStorage.setItem("currentFarmer", JSON.stringify(data.user));
        router.push("/farmer-homepage");
      } else {
        const errorMsg = data.error || "Invalid mobile or password!";
        setServerError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Login error:", err);
      setServerError("Something went wrong. Please try again.");
      toast.error("Connection error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        
        <div className="relative z-20 text-center p-12 text-white">
          <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
            <LocalFloristIcon style={{ fontSize: 48 }} />
          </div>
          <h1 className="text-5xl font-bold mb-6">Grow with AgroMart</h1>
          <p className="text-xl text-green-100 max-w-md mx-auto">
            Access market insights, sell your produce directly, and manage your farm efficiently.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 relative">
        <button 
          onClick={() => router.push('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors"
        >
          <ArrowBackIcon fontSize="small" /> Back to Home
        </button>

        <div className="max-w-md mx-auto w-full">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Farmer Login</h2>
            <p className="text-gray-500">Welcome back! Please enter your details.</p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="text-gray-400" fontSize="small" />
                </div>
                <input
                  type="text"
                  {...register("mobile")}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all ${
                    errors.mobile 
                      ? 'border-red-300 focus:ring-2 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                  }`}
                  placeholder="01XXXXXXXXX"
                />
              </div>
              {errors.mobile && <p className="text-red-500 text-xs mt-1 ml-1">{errors.mobile.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="text-gray-400" fontSize="small" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full pl-10 pr-10 py-3 border rounded-xl outline-none transition-all ${
                    errors.password 
                      ? 'border-red-300 focus:ring-2 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-green-600 font-medium hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500">
            Don't have an account?{" "}
            <Link href="/farmer-signup" className="text-green-600 font-bold hover:underline">
              Register as Farmer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
