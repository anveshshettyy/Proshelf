import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Navbar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronUp, ExternalLink, Github, LinkIcon } from 'lucide-react';
import axios from 'axios';
import Gallery from '../../Components/Project/ImageGallery';
import Footer from '../../Components/Footer';
import Loader from '../../Components/Loader';

export default function UserProject() {
  const { username, collectionSlug, projectSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();


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

  if (loading) return <Loader />;
  if (!data) return <p>No project data found.</p>;

  const { user, collection, project } = data;

  return (
    <div>
      <Navbar />
      <SideBar />

      <div className='w-full py-5 px-5 md:px-22 font-med md:pb-20'>
        <div className='flex items-center gap-2 mb-5 text-gray-600 text-sm md:text-base font-helvetica'>
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


        <div className='flex w-full justify-between'>
          <div >
            <h1 className='text-[6vh] font-head text-gray-900'>{project.title}</h1>
            <p className='text-gray-700 text-md '>{project.description}</p>
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

        {/* ✅ About Section */}
        {project.about && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-3">About Project</h2>

            <div className={`relative bg-slate-100 md:px-10 md:py-7 rounded-xl p-5`}>
              <div
                className={`text-gray-800 leading-relaxed tracking-wide text-[15px] space-y-4 transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[9999px]' : 'max-h-[240px]'
                  }`}
              >
                {project.about.split('\r\n\r\n').map((para, i) => {
                  const isEmojiHeading = /^[^\w\s]/.test(para.trim());
                  return isEmojiHeading ? (
                    <p key={i} className="font-semibold text-[16px] mt-4">
                      {para}
                    </p>
                  ) : (
                    <p key={i} className="whitespace-pre-line">
                      {para}
                    </p>
                  );
                })}
              </div>

              {/* Fade Overlay */}
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none" />
              )}

              {/* Read More / Show Less Button */}
              <div className="flex justify-center mt-4 ">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1 text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  {isExpanded ? (
                    <>
                      Show Less <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Read More <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}




        {/* ✅ Gallery Component */}
        <Gallery images={project.images} />

        {/* ✅ Video Demo */}
        {project.video?.url && (
          <div className='mt-20'>
            <h2 className='text-2xl font-semibold mb-4'>Video Demo</h2>
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
        <div className="mt-20 space-y-10">
          {/* Source Code Section */}
          {project.source && (
            <div>
              <h2 className="font-semibold text-2xl mb-2">Source Code</h2>
              <a
                href={project.source}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-700 underline hover:text-black transition"
              >
                <LinkIcon className="w-5 h-5" />
                {project.source}
              </a>
            </div>
          )}

          {/* Live Demo Section */}
          {project.liveDemo && (
            <div>
              <h2 className="font-semibold text-2xl mb-2">Live Deployment</h2>
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-700 underline hover:text-black transition"
              >
                <ExternalLink className="w-5 h-5" />
                {project.liveDemo}
              </a>
            </div>
          )}
        </div>




        {/* ✅ Technologies Used */}
        {Array.isArray(project.technologies) &&
          project.technologies.filter((t) => t.trim() !== "").length > 0 && (
            <div className='mt-10'>
              <h2 className='text-[3.9vh] font-semibold mb-2'>Technologies Used</h2>
              <div className='flex gap-2 flex-wrap'>
                {project.technologies
                  .filter((t) => t.trim() !== "")
                  .map((tech, index) => (
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

      {/* <Footer /> */}
    </div>
  );
}
