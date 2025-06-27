import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';
import { BsCollection } from "react-icons/bs";
import { HiArrowUp } from "react-icons/hi2";
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../Components/Loader';
import { ChevronRight } from 'lucide-react';

export default function UserCollections() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const res = await axios.get(`/api/auth/${username}/collections`);
                setUser(res.data.user);
                setCollections(res.data.collections);
            } catch (err) {
                console.error("❌ Error fetching collections:", err.message);
            } finally {
                setLoading(false); // always stop loading
            }
        };

        fetchCollections();
    }, [username]);

    if (loading) return <Loader />;


    return (
        <div>
            <Navbar />
            <SideBar />
            <div className='w-full py-5 px-5 md:px-20'>
                <div className='flex items-center gap-x-2 mb-5 font-helvetica' >
                    <Link className='cursor-pointer hover:underline transition text-gray-600 ' to={`/${username}`}>{user?.name}</Link>
                    <ChevronRight className="w-4 h-4" />
                    <h1>Collections</h1>
                </div>
                <div className=''>
                    <div className='flex justify-between items-center'>
                        <div>
                            <h1 className='text-[5vh] font-head leading-tight '>
                                {user?.name?.split(' ')[0]}'s Collections
                            </h1>
                            <h2 className="text-gray-700 font-helvetica text-md mt-1">
                                Collections {collections.length} &nbsp;&nbsp;|&nbsp;&nbsp; Total Projects{" "}
                                {collections.reduce((total, col) => total + col.projectCount, 0)}
                            </h2>
                        </div>

                        <div className='h-12 w-12 bg-slate-300 rounded-full overflow-hidden mr-5'
                            onClick={() => navigate(`/${username}`)}
                        >
                            <img
                                src={user?.profile}
                                alt="profile"
                                referrerPolicy="no-referrer"
                                className='h-full w-full object-cover cursor-pointer'

                            />
                        </div>
                    </div>
                </div>

                <div className='py-10 flex flex-col gap-5'>
                    {collections.length > 0 ? (
                        collections.map((collection) => (
                            <div
                                key={collection._id}
                                onClick={() => navigate(`/${username}/${collection.slug}`)}
                                className='bg-gray-100 w-full flex px-10 py-5 rounded-2xl cursor-pointer items-center justify-between 
                                transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.015] 
                                hover:bg-black hover:text-white hover:shadow-2xl group'
                            >
                                <div className='flex gap-5 items-center'>
                                    <BsCollection className='h-10 w-10' />
                                    <div>
                                        <h1 className='text-xl font-head leading-[1.1] '>{collection.title}</h1>
                                        <p className='font-med text-sm'>
                                            {collection.description || 'No description'}
                                        </p>
                                        <p className='text-xs text-gray-500 group-hover:text-white'>{collection.projectCount} Projects</p>
                                    </div>
                                </div>

                                <div className=''>
                                    <HiArrowUp className='h-8 w-8 group-hover:rotate-45 transition duration-300' />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='text-gray-500 font-head'>No collections found. Create one!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
