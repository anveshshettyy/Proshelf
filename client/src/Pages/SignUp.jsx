import React, { useState } from 'react';
import axios from '../lib/axios';
import Navbar from '../Components/Navbar';
import backgroundImage from '../assets/Images/beautiful-gray-color-gradient-background.avif';
import GoogleLogo from '../assets/Images/Google_Icon.webp';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../Components/CustomAlert';


export default function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
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

        if (formData.password.length < 6) {
            showAlert('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await axios.post('https://proshelf.onrender.com/api/auth/signup', formData, {
                withCredentials: true,
            });


            ('Signup success:', response.data);
            showAlert('Signup successful!', 'success');
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.href = "/collections";
        } catch (err) {
            console.error('Signup error (frontend):', err);
            if (err.response?.data?.message) {
                showAlert(err.response.data.message);
            } else {
                showAlert('An unexpected error occurred.');
            }
        }
    };


    const handleGoogleSignup = () => {
        window.location.href = 'https://proshelf.onrender.com/api/auth/google';
    };

    return (
        <div>
            <Navbar />

            <div className='lg:px-20 px-5 py-10 h-screen overflow-hidden mb-16'>
                <h1 className='font-head text-6xl lg:text-[12vh]'>Unlock your stack!</h1>

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
                                        name="username"
                                        type="text"
                                        placeholder='Username'
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className='outline-none w-full'
                                    />
                                </div>
                                <hr />

                                <div className='font-helvetica text-2xl md:text-4xl mt-5'>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder='Name'
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className='outline-none w-full'
                                    />
                                </div>
                                <hr />

                                <div className='font-helvetica text-2xl md:text-4xl mt-5'>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder='Email'
                                        value={formData.email}
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
                                    Sign Up
                                </button>
                            </form>

                            <hr />

                            <button
                                onClick={handleGoogleSignup}
                                className='cursor-pointer flex justify-center items-center gap-x-5 my-7 py-2 bg-white w-full text-black border border-black rounded-md font-med text-2xl md:text-3xl'
                            >
                                <img className='h-10 w-10 object-contain' src={GoogleLogo} alt="Google" />
                                Continue with Google
                            </button>
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
