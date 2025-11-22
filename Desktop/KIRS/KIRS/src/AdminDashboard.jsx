import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Users, PackageSearch, Package } from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.clear();
      navigate("/AdminLogin");
      alert("Logged out successfully");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-600 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-300 p-10 text-gray-900">
        
        {/* Header */}
        <nav className="flex items-center justify-center mb-8 space-x-4">
          <img
            src="https://th.bing.com/th/id/OIP.Znr-gv8b0zCGyQ4z1dqP4wHaFu"
            alt="KASU Logo"
            className="w-12 h-12 object-contain"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center tracking-wide">
            KASU ITEM RECOVERY SYSTEM
          </h1>
        </nav>

        {/* Page Title + Logout */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h2>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-gray-900 hover:text-red-500 transition-all duration-300"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        {/* Dashboard Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* New Users */}
          <Link to="/Newusers">
            <button className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-transform duration-300">
              <Users className="w-5 h-5" />
              New Users
            </button>
          </Link>

          {/* Manage Lost Items */}
          <Link to="/AdminViewLost">
            <button className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-transform duration-300">
              <PackageSearch className="w-5 h-5" />
              Manage Lost Items
            </button>
          </Link>

          {/* Manage Found Items */}
          <Link to="/AdminViewFound">
            <button className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-transform duration-300">
              <Package className="w-5 h-5" />
              Manage Found Items
            </button>
          </Link>

          {/* Reports */}
          <Link to="/AdminReports">
            <button className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-transform duration-300">
              📊 Reports
            </button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-gray-500 text-center text-sm mt-8">
          © {new Date().getFullYear()} Kaduna State University — Admin Panel
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;
