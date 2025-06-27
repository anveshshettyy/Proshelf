import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';
import { User2, Mail, Phone, MapPin, Globe, Pencil, Linkedin, Github, Briefcase, FileText, Link, Star } from 'lucide-react';
import { FaYoutube, FaDribbble, FaBehance, FaFigma } from 'react-icons/fa';
import CollectionPieChart from '../../Components/CollectionPieChart';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loader from '../../Components/Loader';

export default function Profile() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`/api/auth/${username}`);
                setUser(response.data.user);
                setPieChartData(response.data.pieChartData);
            } catch (error) {
                console.error("❌ Failed to fetch user profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [username]);

    if (loading) return <Loader />;
    if (!user) return <div className='h-screen w-full flex justify-center items-center '>
        <h1 className='text-3xl font-head'>Error 404 Page not found</h1>
    </div>

    return (
        <div className='min-h-screen w-full'>
            <Navbar />
            <SideBar />
            <div className=' md:py-10 md:px-20 pb-12 '>
                <div className='w-full rounded-2xl bg-gray-100 md:p-10 flex flex-col md:flex-row gap-5 p-5 md:gap-x-10'>
                    <div className='md:w-1/2 rounded-2xl gap-5 flex flex-col md:gap-y-10'>
                        <div className='w-full bg-white rounded-2xl p-7 md:pb-5 flex flex-col gap-5'>
                            <div className='w-full flex gap-10 font-med items-center'>
                                <div className='h-30 w-30 rounded-full'>
                                    <img src={user.profile} alt="profile" referrerPolicy="no-referrer" className='h-full w-full object-cover rounded-full' />
                                </div>
                                <div>
                                    <h1 className='font-head text-2xl'>{user.name}</h1>
                                    <h1>@{user.username}</h1>
                                    <h1>{user.phone}</h1>
                                </div>
                            </div>
                        </div>

                        <div className='w-full bg-white rounded-2xl p-7'>
                            <div>
                                <h2 className="font-head text-lg mb-2">Bio</h2>
                                <p className='font-med'>{user.bio || "No bio available."}</p>
                            </div>

                            <div className='mt-10'>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 font-med text-black">
                                    <div><Mail className="inline w-4 h-4 mr-2 text-slate-400" /> {user.email}</div>
                                    <div>
                                        <MapPin className="inline w-4 h-4 mr-2 text-slate-400" />
                                        {user.location ? user.location : <span className='text-slate-400 font-med'>No location provided</span>}
                                    </div>

                                    {user.website && (
                                        <div>
                                            <Globe className="inline w-4 h-4 mr-2 text-slate-400" />
                                            <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {user.website}
                                            </a>
                                        </div>
                                    )}
                                    <div>
                                        <Briefcase className="inline w-4 h-4 mr-2 text-slate-400" />
                                        {user.isAvailableForWork ? 'Available for Work' : 'Not Available'}
                                    </div>
                                    {user.linkedin && (
                                        <div><Linkedin className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.linkedin} className='hover:underline' target="_blank">LinkedIn</a></div>
                                    )}
                                    {user.github && (
                                        <div><Github className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.github} className='hover:underline' target="_blank">GitHub</a></div>
                                    )}
                                    {user.figma && (
                                        <div><FaFigma className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.figma} target="_blank" className='hover:underline'>Figma</a></div>
                                    )}
                                    {user.portfolio && (
                                        <div><Link className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.portfolio} target="_blank" className='hover:underline'>Portfolio</a></div>
                                    )}
                                    {user.dribbble && (
                                        <div><FaDribbble className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.dribbble} target="_blank" className='hover:underline'>Dribbble</a></div>
                                    )}
                                    {user.behance && (
                                        <div><FaBehance className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.behance} target="_blank" className='hover:underline'>Behance</a></div>
                                    )}
                                    {user.youtube && (
                                        <div><FaYoutube className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.youtube} target="_blank" className='hover:underline'>YouTube</a></div>
                                    )}
                                    {user.resume?.url && (
                                        <div><FileText className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.resume.url} target="_blank" className='hover:underline'>Resume</a></div>
                                    )}
                                </div>



                            </div>
                        </div>
                    </div>



                    <div className='md:w-1/2 bg-white rounded-2xl px-5 md:px-8 py-5 '>
                        <h1 className='font-head text-[3vh]'>Project Overview</h1>
                        <div className='flex items-center justify-center relative'>
                            {pieChartData && pieChartData.length > 0 ? (
                                <CollectionPieChart data={pieChartData} />
                            ) : (
                                <p className='text-slate-400 font-med'>No statistics available.</p>
                            )}
                        </div>
                        <div className=''>
                            <h2 className="font-head text-[3vh] mb-2">Skills</h2>
                            {user.skills && user.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-slate-100 text-black rounded-md border border-slate-300 text-sm flex font-med items-center gap-1">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-slate-400 font-med text-sm'>No skills mentioned.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
