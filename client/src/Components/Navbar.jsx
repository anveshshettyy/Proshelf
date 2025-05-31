import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading } = useAuth(); 

  if (loading) {
    return null; 
  }

  const isLoggedIn = !!user;

  const authLinks = (
    <>
      <a href="#" className="hover:text-slate-600 md:hover:underline">Home</a>
      <a href="#" className="hover:text-slate-600 md:hover:underline">About</a>
      <a href="#" className="hover:text-slate-600 md:hover:underline">Contact</a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          logout();
        }}
        className="hover:text-slate-500 md:hover:underline"
      >
        Logout
      </a>
    </>
  );

  const guestLinks = (
    <>
      <a href="/" className="bg-slate-400 rounded-3xl px-10 py-2
        sm:bg-transparent sm:rounded-none sm:px-0 sm:py-0
        hover:text-slate-600 font-medium md:hover:underline">Home</a>
      <a href="/login" className="hover:text-slate-600 font-medium md:hover:underline">Login</a>
      <a href="/signup" className="hover:text-slate-600 font-medium md:hover:underline">Sign Up</a>
    </>
  );

  return (
    <nav className="w-full md:px-15 px-5 py-3 flex justify-between items-center relative z-50">
      <div className="text-xl font-head">Proshelf</div>

      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="transition-transform duration-300">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <ul className="hidden md:flex gap-10 text-base font-medium">
        {isLoggedIn ? authLinks : guestLinks}
      </ul>

      <div
        className={`fixed inset-0 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } md:hidden`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-50 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden flex flex-col items-center pt-20 gap-6`}
      >
        {isLoggedIn ? authLinks : guestLinks}
      </div>
    </nav>
  );
}
