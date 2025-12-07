import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";

export default function FarmerSignup() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

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

    setError("");
    setSuccess("Signup successful! Redirecting to login...");

    // 1.5 সেকেন্ড পরে login page এ navigate করা
    setTimeout(() => {
      navigate("/farmer-login");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-80">
        <div className="flex justify-center mb-4">
          <div className="bg-green-600 p-3 rounded-full text-white">
            <LocalFloristIcon fontSize="large" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-center mb-2">Farmer Signup</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm text-center">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Mobile Number"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
