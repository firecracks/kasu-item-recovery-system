import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.clear();
      navigate('/');
      alert("Logged out successfully");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-700 to-green-500 p-4">
      
      {/* White Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        
        {/* Header */}
        <nav className="flex items-center justify-center mb-6 space-x-3">
          <img
            src="https://th.bing.com/th/id/OIP.Znr-gv8b0zCGyQ4z1dqP4wHaFu"
            alt="KASU Logo"
            className="w-12 h-12 object-contain"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700 text-center tracking-wide">
            KASU ITEM RECOVERY SYSTEM
          </h1>
        </nav>

        {/* Home Header + Logout */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-green-700">Home</h2>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-gray-700 hover:text-red-500 transition-all duration-300"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mb-8">
          <Link to="/reportlostitems">
            <button className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">
              Report Lost Items
            </button>
          </Link>

          <Link to="/reportfounditems">
            <button className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">
              Report Found Items
            </button>
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-6"></div>

        <h3 className="text-xl font-semibold text-green-700 mb-4 text-center">View Reports</h3>

        <div className="flex flex-col gap-4">
          <Link to="/ViewLostItems">
            <button className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">
              View Lost Items
            </button>
          </Link>

          <Link to="/ViewFoundItems">
            <button className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">
              View Found Items
            </button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-gray-500 text-center text-sm mt-6">
          © {new Date().getFullYear()} Kaduna State University
        </p>
      </div>
    </div>
  );
}

export default Home;
