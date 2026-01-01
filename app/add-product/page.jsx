'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import { motion } from "framer-motion";

const productSchema = z.object({
  category: z.string().min(1, "Category is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.number({ invalid_type_error: "Price must be a number" }).min(1, "Price must be greater than 0"),
  stock: z.number({ invalid_type_error: "Stock must be a number" }).min(1, "Stock must be at least 1"),
  details: z.string().optional(),
  nature: z.string().optional(),
});

export default function AddNewProductPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [farmerName, setFarmerName] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const loggedFarmerStr = localStorage.getItem("currentFarmer");
    if (!loggedFarmerStr) {
      const oldLogged = localStorage.getItem("loggedFarmer");
      if (!oldLogged) {
        toast.error("Please login first!");
        router.push("/farmer-login");
        return;
      }
      toast.error("Session expired or invalid. Please login again.");
      router.push("/farmer-login");
      return;
    }

    try {
      const farmer = JSON.parse(loggedFarmerStr);
      setFarmerName(farmer.name);
    } catch (e) {
      router.push("/farmer-login");
    }
  }, [router]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onSubmit = async (formData) => {
    setServerError("");
    
    const loggedFarmerStr = localStorage.getItem("currentFarmer");
    if (!loggedFarmerStr) {
      toast.error("Please login again.");
      return;
    }
    const farmer = JSON.parse(loggedFarmerStr);
    const farmerId = farmer.id;

    const saveProduct = async (imgData) => {
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            img: imgData,
            farmerId
          }),
        });

        if (res.ok) {
          toast.success(`${formData.category} product added successfully!`);
          router.push("/farmer-homepage");
        } else {
          const data = await res.json();
          setServerError(data.error || "Failed to add product");
          toast.error(data.error || "Failed to add product");
        }
      } catch (error) {
        console.error("Error adding product:", error);
        setServerError("Something went wrong!");
        toast.error("Something went wrong!");
      }
    };

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        saveProduct(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      saveProduct("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/farmer-homepage')}>
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-600/20">
              <LocalFloristIcon />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 leading-none">AgroMart</h1>
              <p className="text-xs text-green-600 font-medium">Farmer Dashboard</p>
            </div>
          </div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium"
          >
            <ArrowBackIcon fontSize="small" /> Back
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white w-full max-w-3xl rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="bg-green-600 p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Add New Product</h2>
            <p className="text-green-100">Share your fresh produce with the world</p>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {serverError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center">
                  {serverError}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      {...register("category")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all bg-gray-50"
                    >
                      <option value="">Select Category</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Rice">Rice</option>
                      <option value="Honey">Honey</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1 ml-1">{errors.category.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Title</label>
                    <input
                      type="text"
                      {...register("title")}
                      placeholder="e.g. Fresh Tomatoes"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all bg-gray-50"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1 ml-1">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (per unit)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.01"
                        {...register("price", { valueAsNumber: true })}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all bg-gray-50"
                      />
                    </div>
                    {errors.price && <p className="text-red-500 text-xs mt-1 ml-1">{errors.price.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                    <input
                      type="number"
                      {...register("stock", { valueAsNumber: true })}
                      placeholder="e.g. 50"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all bg-gray-50"
                    />
                    {errors.stock && <p className="text-red-500 text-xs mt-1 ml-1">{errors.stock.message}</p>}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
                    <div className="relative group cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${preview ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 group-hover:border-green-400'}`}>
                        {preview ? (
                          <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                        ) : (
                          <>
                            <CloudUploadIcon className="text-gray-400 mb-2 group-hover:text-green-500 transition-colors" fontSize="large" />
                            <p className="text-sm text-gray-500 font-medium group-hover:text-green-600">Click to upload image</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                    <textarea
                      {...register("details")}
                      rows="3"
                      placeholder="Describe your product..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all bg-gray-50 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-green-600/30 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </span>
                ) : (
                  "Publish Product"
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
