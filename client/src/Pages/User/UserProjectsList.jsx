import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';
import { HiArrowUp } from "react-icons/hi2";
import { RiFolder6Fill } from "react-icons/ri";
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../Components/Loader';
import { ChevronRight } from 'lucide-react';

export default function UserProjectsList() {
  const { username, collectionSlug } = useParams();
  const [user, setUser] = useState(null);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`/api/auth/${username}/${collectionSlug}`);
        setUser(res.data.user);
        setCollection(res.data.collection);
      } catch (err) {
        console.error("❌ Error fetching projects:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [username, collectionSlug]);

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar />
      <SideBar />




      <div className='w-full py-5 px-5 md:px-20'>
        <div className='flex items-center gap-x-2 mb-5 font-helvetica' >
          <Link className='cursor-pointer hover:underline transition ' to={`/${username}`}>{user?.name}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link className='cursor-pointer hover:underline transition ' to={`/${username}/collections`}>{collection.title}</Link>
          <ChevronRight className="w-4 h-4" />
          <h1>Projects</h1>
        </div>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-[5vh] font-head'>
              {collection?.title}
            </h1>
            <h2 className="text-gray-700 font-helvetica text-md mt-1">
              {collection?.description || "No description available."} &nbsp;&nbsp;|&nbsp;&nbsp; Total Projects {collection?.projects?.length}
            </h2>
          </div>

          <div
            className='h-12 w-12 bg-slate-300 rounded-full overflow-hidden mr-5 cursor-pointer'
            onClick={() => navigate(`/${username}`)}
          >
            <img
              src={user?.profile}
              alt="profile"
              referrerPolicy="no-referrer"
              className='h-full w-full object-cover'
            />
          </div>
        </div>

        <div className='py-10 flex flex-col gap-5'>
          {collection?.projects?.length > 0 ? (
            collection.projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/${username}/${collectionSlug}/${project.slug}`)}
                className='bg-gray-100 w-full flex px-10 py-5 rounded-2xl cursor-pointer items-center justify-between 
                transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.015] 
                hover:bg-black hover:text-white hover:shadow-2xl group'
              >
                <div className='flex gap-5 items-center'>
                  <RiFolder6Fill className='h-10 w-10' />
                  <div>
                    <h1 className='text-xl font-head'>{project.title}</h1>
                    <p className='font-med text-sm'>
                      {project.description || 'No description'}
                    </p>
                    <p className='text-xs text-gray-500 group-hover:text-white'>
                      Technologies: {project.technologies?.filter(t => t)?.join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>

                <HiArrowUp className='h-8 w-8 group-hover:rotate-45 transition duration-300' />
              </div>
            ))
          ) : (
            <p className='text-gray-500 font-head'>No projects found in this collection.</p>
          )}
        </div>
      </div>
    </div>
  );
}
