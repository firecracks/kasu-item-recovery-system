import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ViewLostItems() {
  const [lostItems, setLostItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const navigate = useNavigate();

  const currentUserEmail = localStorage.getItem("userEmail");

  // Fetch lost items
  useEffect(() => {
    fetch("http://localhost:5234/lost-items")
      .then((res) => res.json())
      .then((data) => setLostItems(data))
      .catch((error) => {
        console.error("Error loading items from backend:", error);
        setLostItems([]);
      });
  }, []);

  // Filter items
  const filteredItems = lostItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle claim
  const handleClaim = async (item) => {
    const claimerEmail = localStorage.getItem("userEmail");

    try {
      const response = await fetch("http://localhost:5234/send-claim-email-lost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterEmail: item.reporterEmail,
          reporterName: item.reporterName,
          itemName: item.itemName,
          claimerEmail,
        }),
      });

      if (response.ok) {
        alert("✅ Claim request sent successfully! The reporter has been notified by email.");
      } else {
        alert("❌ Failed to send claim email.");
      }
    } catch (err) {
      console.error("Error sending claim email:", err);
      alert("An error occurred while sending claim email.");
    }
  };

  // Start editing
  const handleEditClick = (item) => {
    setEditingItemId(item.id);
    setNewStatus(item.status);
  };

  // Save edited status
  const handleSaveStatus = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5234/lost-items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setLostItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, status: newStatus } : item
          )
        );
        setEditingItemId(null);
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("An error occurred while updating status.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-600 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8 border border-gray-300 text-gray-900">

        {/* Header */}
        <nav className="flex items-center justify-center mb-6 space-x-3">
          <img
            src="https://th.bing.com/th/id/OIP.Znr-gv8b0zCGyQ4z1dqP4wHaFu?pid=ImgDetMain"
            alt="KASU Logo"
            className="w-12 h-12 object-contain"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
            KASU ITEM RECOVERY SYSTEM
          </h1>
        </nav>

        {/* Title + Back Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">View Lost Items</h2>
          <img
            src="https://cdn-icons-png.flaticon.com/512/93/93634.png"
            alt="Back"
            title="Go Back"
            className="w-7 h-7 cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={() => navigate("/Home")}
          />
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name, description, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Items */}
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-700">No matching items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-gray-50 rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.itemName}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}

                <h2 className="text-lg font-semibold mb-1">{item.itemName}</h2>
                <p className="text-sm mb-1"><strong>Description:</strong> {item.description}</p>
                <p className="text-sm mb-2"><strong>Location:</strong> {item.location}</p>

                {editingItemId === item.id ? (
                  <div className="mt-3 flex items-center space-x-2">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="px-2 py-1 rounded text-gray-900"
                    >
                      <option value="unclaimed">Unclaimed</option>
                      <option value="claimed">Claimed</option>
                    </select>
                    <button
                      onClick={() => handleSaveStatus(item.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingItemId(null)}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="mt-1">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-semibold ${
                        item.status === "claimed" ? "text-green-600" : "text-yellow-500"
                      }`}
                    >
                      {item.status || "unclaimed"}
                    </span>
                  </p>
                )}

                {currentUserEmail !== item.reporterEmail && item.status === "unclaimed" && (
                  <button
                    onClick={() => handleClaim(item)}
                    className="mt-4 w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 hover:scale-105 transition-all duration-300"
                  >
                    Claim Item
                  </button>
                )}

                {item.reporterEmail === currentUserEmail && (
                  <button
                    onClick={() => handleEditClick(item)}
                    className="mt-2 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 hover:scale-105 transition-all duration-300"
                  >
                    Edit Status
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

export default ViewLostItems;
