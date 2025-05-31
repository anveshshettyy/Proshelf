import React, { useState } from 'react'
import axios from '../lib/axios'
import Navbar from '../Components/Navbar'
import backgroundImage from '../assets/Images/beautiful-gray-color-gradient-background.avif';
import GoogleLogo from '../assets/Images/google_Icon.webp';

export default function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            // Replace with your signup API endpoint
            const response = await axios.post('/api/signup', formData);
            console.log('Signup success:', response.data);
            // Redirect or show success message here
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('An error occurred, please try again.');
            }
        }
    };

    const handleGoogleSignup = () => {
        window.location.href = 'http://localhost:5000/api/auth/google'; 
    };


    return (
        <div>
            <Navbar />

            <div className='lg:px-20 px-5 py-10 h-screen'>
                <h1 className='font-head text-6xl lg:text-[12vh]'>Lets's Grow Together</h1>

                <div className='flex gap-x-3 h-screen mt-10'>
                    <div className='hidden lg:block h-[65%] w-1/2 bg-slate-300 rounded-2xl bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${backgroundImage})` }}></div>

                    <div className='h-[65%] w-full lg:w-1/2  rounded-3xl  '>
                        <div className='lg:p-5'>
                            <form onSubmit={handleSubmit}>
                                {error && <p style={{ color: 'red' }}>{error}</p>}

                                <div className='font-helvetica text-4xl '>
                                    <input
                                        name="username"
                                        type="text"
                                        placeholder='Username'
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className='outline-none'
                                    />
                                </div>
                                
                                <hr />

                                <div className='font-helvetica text-4xl mt-5 '>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder='Name'
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className='outline-none'
                                    />
                                </div>

                                <hr />

                                <div className='font-helvetica text-4xl mt-5 '>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder='Email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className='outline-none'
                                    />
                                </div>

                                <hr />

                                <div className='font-helvetica text-4xl mt-5 '>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder='Password'
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className='outline-none'
                                    />
                                </div>

                                <hr />

                                <button className='cursor-pointer my-7 py-3 bg-black w-full text-white rounded-md font-med text-3xl' type="submit">Sign Up</button>
                            </form>

                            <hr />

                            <button className='cursor-pointer flex justify-center items-center gap-x-5 my-7 py-2 bg-white w-full text-black border border-black rounded-md font-med text-3xl' onClick={handleGoogleSignup}>
                                <img className='h-10 w-10 object-contain' src={GoogleLogo} alt="" />
                                Continue with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
