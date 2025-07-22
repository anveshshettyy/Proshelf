import React, { useState } from 'react';
import axiosInstance from '../../lib/axios';
import { Eye, EyeOff } from 'lucide-react';
import Loader from '../Loader';
import axiosInstance from '../../lib/axios';

export default function ChangePassword({ setAlert, user }) {
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  if (!user) return <Loader />;

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setAlert({ type: 'error', message: "Passwords don't match" });
      return;
    }

    try {
      setLoading(true);
      const route = user.hasPassword
        ? '/api/auth/change-password'
        : '/api/auth/create-password';

      const payload = user.hasPassword
        ? form
        : { newPassword: form.newPassword }; // Don't send oldPassword if creating

      const { data } = await axiosInstance.post(route, payload, {
        withCredentials: true,
      });

      setAlert({ type: 'success', message: data.message });
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err) {
      setAlert({
        type: 'error',
        message: err?.response?.data?.message || 'Password update failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto space-y-6 bg-white px-6 py-10 rounded-xl shadow"
    >
      <h2 className="text-2xl font-head font-semibold ">
        {user.hasPassword ? 'Change Password' : 'Create Password'}
      </h2>

      {user.hasPassword && (
        <div>
          <label className="block text-sm font-med mb-1">Old Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-med mb-1">New Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-med mb-1">Confirm Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-gray-300"
          required
        />
      </div>

      <button
        type="button"
        onClick={toggleVisibility}
        className="text-sm flex items-center gap-1 cursor-pointer "
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        {showPassword ? 'Hide Passwords' : 'Show Passwords'}
      </button>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white font-med py-2 rounded hover:bg-gray-900"
      >
        {loading ? 'Updating...' : user.hasPassword ? 'Change Password' : 'Create Password'}
      </button>
    </form>
  );
}
