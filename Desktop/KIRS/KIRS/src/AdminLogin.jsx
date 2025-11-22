import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5234/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert("✅ Login successful! Welcome, Admin.");
        navigate("/AdminDashboard");
      } else {
        alert(result.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-600 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-300 p-8 text-gray-900">
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="https://th.bing.com/th/id/OIP.Znr-gv8b0zCGyQ4z1dqP4wHaFu?pid=ImgDetMain"
            alt="KASU Logo"
            className="w-16 h-16 mx-auto mb-3"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            KASU ITEM RECOVERY SYSTEM
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Admin Access — Secure Dashboard Login
          </p>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-6 flex items-center justify-center gap-2 text-gray-900">
          <ShieldCheck size={20} className="text-green-600" /> Admin Login
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full py-2.5 bg-green-600 hover:bg-green-500 rounded-lg font-semibold text-white shadow-md hover:shadow-green-400/50 transition-all duration-300 flex justify-center items-center gap-2"
          >
            <ShieldCheck size={18} /> Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          For authorized KASU administrators only.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
