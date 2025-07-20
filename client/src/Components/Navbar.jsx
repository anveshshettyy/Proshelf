import React, { useState } from 'react';
import { Menu, X, UserCircle } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const profileRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return null;
  const isLoggedIn = !!user;

  const getLinkClass = (path) =>
    `px-10 py-2 rounded-md sm:rounded-none sm:px-0 sm:py-0 font-medium transition-all duration-200 ${location.pathname === path
      ? 'md:bg-white md:text-black md:underline bg-slate-200 text-black'
      : 'hover:text-slate-600'
    }`;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };


  const authLinks = (
    <>
      <Link to="/" className={getLinkClass('/')}>
        Home
      </Link>
      <Link to="/collections" className={getLinkClass('/collections')}>
        Collections
      </Link>

      {/* Profile Avatar + Dropdown */}
      <div className="relative" ref={profileRef}>
        <img
          src={user?.profile || '/default-profile.png'} // fallback image
          alt="Profile"
          referrerPolicy="no-referrer"
          className="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 ring-slate-400 transition-all"
          onClick={() => setProfileDropdown((prev) => !prev)}
        />

        {profileDropdown && (
          <div
            className="absolute top-12 right-0 bg-white shadow-md rounded-md py-2 px-4 w-40 z-50"
          >
            <Link
              to="/profile"
              className="block py-1 text-gray-700 hover:text-black transition-colors"
              onClick={() => setProfileDropdown(false)}
            >
              View Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setProfileDropdown(false);
              }}
              className="block py-1 text-left text-gray-700 hover:text-black w-full"
            >
              Logout
            </button>
          </div>
        )}
      </div>

    </>
  );

  const guestLinks = (
    <>
      <Link to="/" className={getLinkClass('/')}>
        Home
      </Link>
      <Link to="/login" className={getLinkClass('/login')}>
        Login
      </Link>
      <Link to="/signup" className={getLinkClass('/signup')}>
        Sign Up
      </Link>
    </>
  );

  return (
    <nav className="w-full md:px-15 px-5 py-4 flex justify-between items-center relative z-50">
      <Link className='text-xl font-head' to="/">Proshelf</Link>

      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="transition-transform duration-300"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <ul className="hidden md:flex gap-10 text-base font-medium items-center">
        {isLoggedIn ? authLinks : guestLinks}
      </ul>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 z-40 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          } md:hidden`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Slide Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-56 px-10 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden flex flex-col items-center pt-20 gap-6`}
      >
        {isLoggedIn ? (
          <>
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`${getLinkClass('/')} w-full text-center py-2`}
            >
              Home
            </Link>
            <Link
              to="/collections"
              onClick={() => setIsOpen(false)}
              className={`${getLinkClass('/collections')} w-full text-center py-2`}
            >
              Collections
            </Link>
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className={`${getLinkClass('/profile')} w-full text-center py-2`}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-center py-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className={`${getLinkClass('/')} w-full text-center py-2`} onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/login" className={`${getLinkClass('/login')} w-full text-center py-2`} onClick={() => setIsOpen(false)}>
              Login
            </Link>
            <Link to="/signup" className={`${getLinkClass('/signup')} w-full text-center py-2`} onClick={() => setIsOpen(false)}>
              Sign Up
            </Link>
          </>
        )}
      </div>

    </nav>
  );
}
