import React, { useState } from "react";
import { LogOut, Trash2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import ConfirmPopup from "../../Components/ConfirmPopup";

export default function AccountsAction({ setAlert }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(''); // 'logout' or 'delete'

  const handleLogout = async () => {
    try {
      await logout();
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
    try {
      // First clear the JWT cookie
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Then make the delete request
      await axios.delete("/api/auth/delete", { withCredentials: true });
      
      // Clear the auth state
      await logout();
      
      // Set success alert
      setAlert({ type: "success", message: "Account deleted successfully" });
      
      // Navigate to login
      navigate("/login");
    } catch (err) {
      setAlert({
        type: "error",
        message: err?.response?.data?.message || "Account deletion failed",
      });
    }
  };

  const confirmLogout = () => {
    setPopupType('logout');
    setShowPopup(true);
  };

  const confirmDelete = () => {
    setPopupType('delete');
    setShowPopup(true);
  };

  const cancelAction = () => {
    setShowPopup(false);
    setPopupType('');
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
            onClick={confirmLogout}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg border border-red-200">
          <div>
            <p className="text-lg font-head text-red-700">Delete Account</p>
            <p className="text-sm font-med text-red-600">All your projects, collections, and personal data will be permanently deleted</p>
          </div>
          <button
            onClick={confirmDelete}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <ConfirmPopup
        isOpen={showPopup}
        message={
          popupType === 'logout' ? 
            "Are you sure you want to logout? This will end your current session." :
            "Are you sure you want to delete your account? This action will permanently delete all your projects, collections, and personal data. This action cannot be undone."
        }
        onConfirm={popupType === 'logout' ? handleLogout : handleDelete}
        onCancel={cancelAction}
      />
    </div>
  );
}
