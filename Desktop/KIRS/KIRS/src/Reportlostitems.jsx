import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Reportlostitems() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    location: "",
    image: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reporterName = localStorage.getItem("userName");
    const reporterEmail = localStorage.getItem("userEmail");

    const newItem = {
      ...formData,
      reporterName,
      reporterEmail,
    };

    try {
      const response = await fetch("http://localhost:5234/lost-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        alert("✅ Lost item report submitted successfully!");
        setFormData({
          itemName: "",
          description: "",
          location: "",
          image: "",
        });
      } else {
        alert("⚠️ Failed to submit report.");
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("❌ Error submitting report.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-600 p-6">

      {/* White Card Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-300 text-gray-900">
        
        {/* Header */}
        <nav className="flex items-center justify-center mb-6">
          <img
            src="https://th.bing.com/th/id/OIP.Znr-gv8b0zCGyQ4z1dqP4wHaFu?o=7rm=3&rs=1&pid=ImgDetMain"
            alt="KASU Logo"
            className="w-12 h-12 object-contain mr-2"
          />
          <h1 className="text-2xl font-bold text-center tracking-wide text-gray-900">
            KASU ITEM RECOVERY SYSTEM
          </h1>
        </nav>

        {/* Title + Back Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">🎒 Report Lost Item</h2>
          <img
            src="https://tse1.mm.bing.net/th/id/OIP.1fsIIAjy-r0wuOiAvPA4LAHaHa?rs=1&pid=ImgDetMain"
            alt="Back"
            title="Go Back"
            className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => navigate("/Home")}
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 animate-fadeIn transition-all"
        >
          {/* Image Upload */}
          <div>
            <label className="block text-sm mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFormData({ ...formData, image: reader.result });
                };
                if (file) reader.readAsDataURL(file);
              }}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Item Name */}
          <input
            type="text"
            placeholder="Item Name"
            value={formData.itemName}
            onChange={(e) =>
              setFormData({ ...formData, itemName: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
          ></textarea>

          {/* Location */}
          <input
            type="text"
            placeholder="Location Lost"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold rounded-md shadow-lg hover:scale-105 transition-all duration-300"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default Reportlostitems;
