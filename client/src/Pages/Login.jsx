import React, { useState } from 'react';
import axios from '../lib/axios';
import Navbar from '../Components/Navbar';
import backgroundImage from '../assets/Images/beautiful-gray-color-gradient-background.avif';
import GoogleLogo from '../assets/Images/Google_Icon.webp'
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../Components/CustomAlert';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [alert, setAlert] = useState({ message: '', type: '' });

  const showAlert = (message, type = 'error') => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), 3000);
  };

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/login', formData);
      console.log('Login success:', response.data);
      showAlert('Login successful!', 'success');
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.href = "/collections";
    } catch (err) {
      console.error('Login error (frontend):', err);
      if (err.response?.data?.message) {
        showAlert(err.response.data.message);
      } else {
        showAlert('An unexpected error occurred.');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://proshelf.onrender.com/api/auth/google';
  };

  return (
    <div>
      <Navbar />

      <div className='lg:px-20 px-5 py-10 h-screen overflow-hidden mb-16'>
        <h1 className='font-head text-6xl lg:text-[12vh]'>Welcome back!</h1>

        <div className='flex gap-x-3 h-screen mt-10'>
          <div
            className='hidden lg:block h-[65%] w-1/2 bg-slate-300 rounded-2xl bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>

          <div className='h-[65%] w-full lg:w-1/2 rounded-3xl'>
            <div className='lg:p-5'>
              <form onSubmit={handleSubmit}>
                <div className='font-helvetica text-2xl md:text-4xl'>
                  <input
                    name="identifier"
                    type="text"
                    placeholder='Username or Email'
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                    className='outline-none w-full'
                  />
                </div>
                <hr />

                <div className='font-helvetica text-2xl md:text-4xl mt-5'>
                  <input
                    name="password"
                    type="password"
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className='outline-none w-full'
                  />
                </div>
                <hr />

                <button
                  type="submit"
                  className='cursor-pointer my-7 py-3 bg-black w-full text-white rounded-md font-med text-2xl md:text-3xl'
                >
                  Log In
                </button>
              </form>

              <hr />

              <button
                onClick={handleGoogleLogin}
                className='cursor-pointer flex justify-center items-center gap-x-5 my-7 py-2 bg-white w-full text-black border border-black rounded-md font-med text-2xl md:text-3xl'
              >
                <img className='h-10 w-10 object-contain' src={GoogleLogo} alt="Google" />
                Continue with Google
              </button>

              <div className='flex flex-col justify-center '>
                <h1 className='text-1xl font-med text-slate-700 text-center md:text-2xl '>New to Proshelf? </h1>
                <a href='/signup' className='text-1xl font-med text-center md:text-2xl text-slate-400 underline'>Create your account now! </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {alert.message && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: '', type: '' })}
        />
      )}
    </div>
  );
}
