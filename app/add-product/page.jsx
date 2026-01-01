'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const productSchema = z.object({
  category: z.string().min(1, "Category is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.number({ invalid_type_error: "Price must be a number" }).min(1, "Price must be greater than 0"),
  details: z.string().optional(),
  nature: z.string().optional(),
});

export default function AddNewProductPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
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

  // Logged-in farmer load করা
  useEffect(() => {
    const loggedFarmerStr = localStorage.getItem("currentFarmer");
    if (!loggedFarmerStr) {
      // Fallback to old check if currentFarmer not set (e.g. if user didn't re-login)
      const oldLogged = localStorage.getItem("loggedFarmer");
      if (!oldLogged) {
        toast.error("Please login first!");
        router.push("/farmer-login");
        return;
      }
      // If we only have the name, we can't really add a product with relation.
      // Force re-login to get the ID.
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
      reader.readAsDataURL(file);
      reader.onload = () => saveProduct(reader.result);
      reader.onerror = () => toast.error("Error reading file!");
    } else {
      saveProduct("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f7f5] p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Add New Product
      </h1>

      <div className="max-w-lg mx-auto">
        {serverError && <p className="text-red-500 mb-4 text-center">{serverError}</p>}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <select
              {...register("category")}
              className={`w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Category</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Rice">Rice</option>
              <option value="Honey">Honey</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <div>
              <input
                type="text"
                placeholder="Product Name"
                {...register("title")}
                className={`w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <input
                type="number"
                placeholder="Price"
                {...register("price", { valueAsNumber: true })}
                className={`w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <textarea
                placeholder="Details (Optional)"
                {...register("details")}
                className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Nature/Origin (Optional)"
                {...register("nature")}
                className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl text-center">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden" 
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer text-green-600 font-semibold">
                {file ? file.name : "Upload Image"}
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
