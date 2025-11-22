import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";

function Login() {
  const [formData, setFormData] = useState({
    matricId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5234/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      } else {
        localStorage.setItem("userName", data.fullName);
        localStorage.setItem("userEmail", data.email);
        alert("✅ Login successful! Welcome " + data.fullName);
        navigate("/Home");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-700 to-green-500 p-6">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 transition-all hover:shadow-green-400/40 duration-500">
        
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="https://th.bing.com/th/id/OIP.Znr-gv8b0zCGyQ4z1dqP4wHaFu?pid=ImgDetMain"
            alt="KASU Logo"
            className="w-16 h-16 mx-auto mb-3"
          />
          <h1 className="text-2xl font-extrabold text-green-700 tracking-wide">
            KASU ITEM RECOVERY SYSTEM
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Recovering what matters — with trust and technology.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-gray-900">
          {/* Matric ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Matric/Staff ID
            </label>
            <input
              type="text"
              name="matricId"
              value={formData.matricId}
              onChange={handleChange}
              placeholder="Enter your ID"
              required
              className="w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-2.5 bg-green-600 hover:bg-green-500 rounded-lg font-semibold text-white shadow-lg hover:shadow-green-400/50 transition-all duration-300"
          >
            <LogIn size={18} /> Login
          </button>

          {/* Links */}
          <p className="text-center text-sm mt-4 text-gray-700">
            Don’t have an account?{" "}
            <Link
              to="/Register"
              className="text-green-700 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>

          <div className="flex justify-end mt-3">
            <Link
              to="/AdminLogin"
              className="text-sm text-green-700 font-semibold hover:underline bg-green-100 px-3 py-1 rounded-lg shadow-sm hover:bg-green-200"
            >
              Admin Login
            </Link>
          </div>
        </form>
      </div>

      {/* Background overlay animation */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.05),transparent_70%)] animate-pulse pointer-events-none"></div>
    </div>
  );
}

export default Login;
