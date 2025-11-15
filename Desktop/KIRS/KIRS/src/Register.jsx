import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    matricId: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validateName = (fullname) => /^[a-zA-Z\s]+$/.test(fullname);
    if (!validateName(formData.fullName)) {
      alert("Name can only contain letters and spaces.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5234/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          matricId: formData.matricId,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("✅ Registration successful! Please verify your identity.");
      localStorage.setItem("matricId", formData.matricId);
      navigate("/Verifyidentity");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-700 to-green-500 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.05),transparent_70%)] animate-pulse pointer-events-none"></div>

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-gray-900 hover:shadow-green-400/40 transition-all duration-500">
        
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="https://th.bing.com/th/id/OIP.Znr-gv8b0zCGyQ4z1dqP4wHaFu?pid=ImgDetMain"
            alt="KASU Logo"
            className="w-16 h-16 mx-auto mb-3"
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-green-700 tracking-wide">
            KASU ITEM RECOVERY SYSTEM
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Recovering what matters — securely and smartly.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">User Registration</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email (e.g. you@kasu.edu.ng)"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
          />

          <input
            type="text"
            name="matricId"
            placeholder="Matric/Staff ID"
            value={formData.matricId}
            onChange={handleChange}
            required
            pattern="^[Kk][Aa][Ss][Uu]/\d{2}/[a-zA-Z]{3,4}/\d{4}$"
            title="Format: Kasu/20/abc/1234"
            className="w-full px-4 py-2 bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-2.5 bg-green-600 hover:bg-green-500 rounded-lg font-semibold text-white shadow-lg hover:shadow-green-400/50 transition-all duration-300"
          >
            <UserPlus size={18} /> Register
          </button>

          {/* Login Link */}
          <p className="text-center text-sm mt-4 text-gray-700">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-green-700 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
