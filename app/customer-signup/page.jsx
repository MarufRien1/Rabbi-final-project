'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function CustomerSignup() {
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (formData) => {
    setServerError("");
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'customer' }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully!");
        router.push("/customer-login");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Customer Sign Up</h2>
        {serverError && <p className="text-red-500 mb-4 text-center">{serverError}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("name")}
              className={`w-full border px-4 py-2 rounded-lg outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`w-full border px-4 py-2 rounded-lg outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`w-full border px-4 py-2 rounded-lg outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
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
