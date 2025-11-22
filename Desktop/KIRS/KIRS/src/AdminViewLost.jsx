import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle, Trash2 } from "lucide-react";

function AdminViewLost() {
  const [lostItems, setLostItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5234/lost-items")
      .then((res) => res.json())
      .then((data) => setLostItems(data))
      .catch((error) => {
        console.error("Error loading items from backend:", error);
        setLostItems([]);
      });
  }, []);

  const handleDelete = (idToDelete) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this claimed item? This action cannot be undone."
    );
    if (confirmDelete) {
      const updatedItems = lostItems.filter((item) => item.id !== idToDelete);
      setLostItems(updatedItems);
    }
  };

  const filteredItems = lostItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-600 p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-300 p-10 text-gray-900">
        
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

        {/* Title + Back */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-gray-900">Manage Lost Items</h2>
          <ArrowLeftCircle
            className="w-8 h-8 text-gray-900 hover:text-green-600 cursor-pointer transition-all duration-300"
            title="Go Back"
            onClick={() => navigate("/AdminDashboard")}
          />
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 Search by name, description, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Lost Items */}
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No matching items found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                {/* Image */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.itemName}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                )}

                {/* Item Details */}
                <h2 className="text-xl font-semibold mb-1 text-gray-900">{item.itemName}</h2>
                <p className="text-gray-700 text-sm mb-1">
                  <strong>Description:</strong> {item.description}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Location:</strong> {item.location}
                </p>
                <p className="text-gray-700 text-sm mb-4">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      item.status === "claimed" ? "text-green-600" : "text-yellow-500"
                    }`}
                  >
                    {item.status || "unclaimed"}
                  </span>
                </p>

                {/* Delete Button */}
                {item.status === "claimed" && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Trash2 className="w-5 h-5" /> Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminViewLost;
