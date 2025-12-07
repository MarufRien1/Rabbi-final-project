import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";

export default function FarmerLogin() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!mobile || !password) {
      setError("All fields are required!");
      return;
    }

    // localStorage থেকে Array আকারে Data নিন
    let savedUsers = [];
    try {
      savedUsers = JSON.parse(localStorage.getItem("farmerUser")) || [];
      if (!Array.isArray(savedUsers)) {
        savedUsers = []; // যদি Array না হয়, খালি Array বানান
      }
    } catch (err) {
      savedUsers = [];
    }

    // Find user by mobile
    const savedUser = savedUsers.find((user) => user.mobile === mobile);

    if (!savedUser) {
      setError("No account found! Please sign up first.");
      return;
    }

    if (savedUser.password !== password) {
      setError("Invalid mobile or password!");
      return;
    }

    // login successful
    localStorage.setItem("loggedFarmer", savedUser.name);
    setError("");
    navigate("/farmer-homepage");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-80">
        <div className="flex justify-center mb-4">
          <div className="bg-green-600 p-3 rounded-full text-white">
            <LocalFloristIcon fontSize="large" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
          Farmer Login
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
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
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-3">
          Don't have an account?{" "}
          <span
            className="text-green-600 cursor-pointer"
            onClick={() => navigate("/farmer-signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
