import React from "react";
import { LogOut, Trash2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function AccountsAction({ setAlert }) {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ use the context logout

  const handleLogout = async () => {
    try {
      await logout(); // ✅ important!
      setAlert({ type: "success", message: "Logged out successfully" });
      navigate("/login");
    } catch (err) {
      setAlert({
        type: "error",
        message: err?.response?.data?.message || "Logout failed",
      });
    }
  };

  const handleDelete = async () => {
    console.log("Deleting...");
    
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete("/api/auth/delete", { withCredentials: true });
      setAlert({ type: "success", message: "Account deleted successfully" });
      navigate("/login");
    } catch (err) {
      setAlert({
        type: "error",
        message: err?.response?.data?.message || "Account deletion failed",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 mb-30 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-head text-gray-800 mb-6 border-b pb-2">Account Settings</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
          <div>
            <p className="text-lg font-head text-gray-800">Logout</p>
            <p className="text-sm font-med text-gray-600">End your current session</p>
          </div>
          <button
            onClick={handleLogout}  
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg border border-red-200">
          <div>
            <p className="text-lg font-head text-red-700">Delete Account</p>
            <p className="text-sm font-med text-red-600">Permanently remove your account</p>
          </div>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
