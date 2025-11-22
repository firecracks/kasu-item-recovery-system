import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, IdCard, ShieldCheck } from "lucide-react";

function Verifyidentity() {
  const [idCard, setIdCard] = useState(null);
  const [livePhoto, setLivePhoto] = useState(null);
  const navigate = useNavigate();

  const handleIdCardChange = (e) => {
    const file = e.target.files[0];
    if (file) setIdCard(file);
  };

  const handleLivePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLivePhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idCard || !livePhoto) {
      alert("Please upload both ID card and live photo.");
      return;
    }

    const formData = new FormData();
    formData.append("idCard", idCard);
    formData.append("livePhoto", livePhoto);

    const matricId = localStorage.getItem("matricId");
    if (matricId) formData.append("matricId", matricId);

    try {
      const response = await fetch("http://localhost:5234/verifyidentity", {
        method: "POST",
        body: formData,
      });

      const type = response.headers.get("content-type");
      const data = type?.includes("application/json")
        ? await response.json()
        : { message: await response.text() };

      if (!response.ok) {
        alert(data.message || "Upload failed");
        return;
      }

      alert("✅ Verification submitted! Await admin approval.");
      navigate("/");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error submitting verification.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-700 to-green-500 p-6 relative overflow-hidden">
      
      {/* background glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.05),transparent_70%)] animate-pulse pointer-events-none"></div>

      {/* white card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-gray-700 hover:shadow-green-400/30 transition-all duration-500">
        
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="https://th.bing.com/th/id/OIP.Znr-gv8b0zCGyQ4z1dqP4wHaFu?pid=ImgDetMain"
            alt="KASU Logo"
            className="w-16 h-16 mx-auto mb-3"
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-green-700">
            KASU ITEM RECOVERY SYSTEM
          </h1>
          <p className="text-sm text-gray-500 mt-1">Identity Verification Portal</p>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-green-700">
          <ShieldCheck size={22} className="text-green-600" /> Verify Your Identity
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* ID Card Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Your KASU ID Card
            </label>
            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2 hover:bg-gray-200 transition">
              <IdCard size={20} className="text-green-600 mx-2" />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleIdCardChange}
                required
                className="w-full text-sm bg-transparent text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-green-600 file:text-white hover:file:bg-green-500 cursor-pointer focus:outline-none"
              />
            </div>
          </div>

          {/* Live Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Take a Live Photo
            </label>
            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2 hover:bg-gray-200 transition">
              <Camera size={20} className="text-purple-600 mx-2" />
              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleLivePhotoChange}
                required
                className="w-full text-sm bg-transparent text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold rounded-lg hover:scale-105 hover:shadow-xl transition-all duration-500"
          >
            Submit Verification
          </button>
        </form>

        {/* Previews */}
        {(idCard || livePhoto) && (
          <div className="mt-6 text-sm space-y-4 text-gray-700">
            {idCard && (
              <div>
                <p className="mb-1 text-green-700 font-medium">ID Card Preview:</p>
                <img
                  src={URL.createObjectURL(idCard)}
                  alt="ID Card"
                  className="w-full rounded-lg border border-gray-300"
                />
              </div>
            )}
            {livePhoto && (
              <div>
                <p className="mb-1 text-purple-700 font-medium">Live Photo Preview:</p>
                <img
                  src={URL.createObjectURL(livePhoto)}
                  alt="Live Selfie"
                  className="w-full rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Verifyidentity;
