import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, ArrowLeftCircle } from "lucide-react";

function NewUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [verifications, setVerifications] = useState([]);

  // Fetch pending users
  useEffect(() => {
    fetch("http://localhost:5234/users")
      .then((res) => res.json())
      .then((data) =>
        setPendingUsers(data.filter((user) => user.status === "pending"))
      );
  }, []);

  // Fetch verifications
  useEffect(() => {
    fetch("http://localhost:5234/verifications")
      .then((res) => res.json())
      .then((data) => setVerifications(data));
  }, []);

  // Get verification details for a user
  const getVerification = (matricId) =>
    verifications.find((v) => v.matricId === matricId);

  // Approve user
  const handleApprove = async (id) => {
    await fetch(`http://localhost:5234/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    setPendingUsers((prev) => prev.filter((user) => user.id !== id));
  };

  // Reject user
  const handleReject = async (id) => {
    await fetch(`http://localhost:5234/users/${id}`, { method: "DELETE" });
    setPendingUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-600 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-300 p-10 text-gray-900">
        
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">
            Pending User Verifications
          </h2>
          <Link to="/AdminDashboard" title="Back to Dashboard">
            <ArrowLeftCircle className="w-7 h-7 text-gray-900 hover:text-green-600 transition-all duration-300" />
          </Link>
        </div>

        {/* Pending Users */}
        {pendingUsers.length === 0 ? (
          <p className="text-center text-gray-600 text-lg font-medium mt-8">
            🎉 All users have been verified. No pending requests!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingUsers.map((user) => {
              const verification = getVerification(user.matricId);
              return (
                <div
                  key={user.id}
                  className="bg-white/80 p-6 rounded-xl border border-gray-300 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="mb-3 text-gray-900">
                    <p>
                      <span className="font-semibold">👤 Name:</span> {user.fullName}
                    </p>
                    <p>
                      <span className="font-semibold">🎓 Matric ID:</span> {user.matricId}
                    </p>
                    <p>
                      <span className="font-semibold">✉️ Email:</span> {user.email}
                    </p>
                  </div>

                  {verification && (
                    <div className="flex gap-4 mb-4 justify-center">
                      <a
                        href={`http://localhost:5234/uploads/${verification.idCardPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View ID Card"
                      >
                        <img
                          src={`http://localhost:5234/uploads/${verification.idCardPath}`}
                          alt="ID Card"
                          className="w-24 h-24 object-cover rounded-md border border-gray-300 hover:scale-105 transition-all duration-300"
                        />
                      </a>
                      <a
                        href={`http://localhost:5234/uploads/${verification.livePhotoPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Live Selfie"
                      >
                        <img
                          src={`http://localhost:5234/uploads/${verification.livePhotoPath}`}
                          alt="Selfie"
                          className="w-24 h-24 object-cover rounded-md border border-gray-300 hover:scale-105 transition-all duration-300"
                        />
                      </a>
                    </div>
                  )}

                  {/* Approve / Reject Buttons */}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <CheckCircle className="w-5 h-5" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <XCircle className="w-5 h-5" /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Back Button */}
        <div className="mt-8 text-center">
          <Link to="/AdminDashboard">
            <button className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300">
              ← Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NewUsers;
