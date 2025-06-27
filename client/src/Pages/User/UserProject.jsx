import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import axios from 'axios';
import Gallery from '../../Components/Project/ImageGallery'; // 💡 Import the new component

export default function UserProject() {
  const { username, collectionSlug, projectSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `/api/auth/${username}/${collectionSlug}/${projectSlug}`
        );
        setData(res.data);
      } catch (err) {
        console.error('❌ Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [username, collectionSlug, projectSlug]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No project data found.</p>;

  const { user, collection, project } = data;

  return (
    <div>
      <Navbar />
      <SideBar />

      <div className='w-full py-5 px-5 md:px-20 font-sans'>
        {/* ✅ Breadcrumbs */}
        <div className='flex items-center gap-2 mb-5 text-gray-600 text-sm md:text-base'>
          <Link to={`/${username}`} className='hover:underline hover:text-black transition'>
            {user?.name?.split(' ')[0]}
          </Link>
          <ChevronRight className='w-4 h-4' />
          <Link to={`/${username}/${collection.slug}`} className='hover:underline hover:text-black transition'>
            {collection?.title}
          </Link>
          <ChevronRight className='w-4 h-4' />
          <span className='text-black font-medium'>{project?.title}</span>
        </div>

        {/* ✅ Project Title and Description */}
        <h1 className='text-3xl font-semibold text-gray-900'>{project.title}</h1>
        <p className='text-gray-700 text-md mt-2'>{project.description}</p>

        {/* ✅ About Section */}
        {project.about && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">About</h2>

            <div
              className={`${project.about ? "overflow-y-auto" : "overflow-y-hidden"
                } max-h-[500px] pr-2 bg-slate-100 md:px-10 md:py-7 rounded-xl p-5`}
              data-lenis-prevent
            >
              {project.about ? (
                <p className="whitespace-pre-wrap font-med text-gray-700 leading-relaxed tracking-wide">
                  {project.about}
                </p>
              ) : (
                <div className="text-center text-gray-600">
                  <p className="text-lg font-med mb-2">No About section added yet.</p>
                  <button
                    className="text-slate-600 hover:underline font-med cursor-pointer flex justify-center w-full items-center gap-2"
                  >
                    Add About Info
                  </button>
                </div>
              )}
            </div>
          </div>
        )}



        {/* ✅ Gallery Component */}
        <Gallery images={project.images} />

        {/* ✅ Video Demo */}
        {project.video?.url && (
          <div className='mt-10'>
            <h2 className='text-xl font-semibold mb-4'>Video Demo</h2>
            <video
              src={project.video.url}
              controls
              autoPlay
              loop
              muted
              className='w-full max-h-[600px] rounded-xl shadow-md object-cover'
            />
          </div>
        )}

        {/* ✅ Links Section */}
        <div className='mt-10'>
          <h2 className='text-xl font-semibold mb-2'>Links</h2>
          <div className='flex flex-wrap gap-4'>
            {project.source && (
              <a
                href={project.source}
                target='_blank'
                rel='noopener noreferrer'
                className='px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium shadow-sm'
              >
                🔗 View Source Code
              </a>
            )}
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target='_blank'
                rel='noopener noreferrer'
                className='px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium shadow-sm'
              >
                🚀 Live Demo
              </a>
            )}
          </div>
        </div>

        {/* ✅ Technologies Used */}
        {project.technologies?.length > 0 && (
          <div className='mt-10'>
            <h2 className='text-xl font-semibold mb-2'>Technologies Used</h2>
            <div className='flex gap-2 flex-wrap'>
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className='px-3 py-1 bg-gray-100 rounded-md text-sm border border-gray-300'
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
