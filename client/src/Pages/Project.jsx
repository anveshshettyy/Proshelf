import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronRight, Edit2, Trash2, ExternalLink, Github } from "lucide-react";
import Navbar from "../Components/Navbar";
import ProjectGallery from "../Components/ProjectGallery";
import EditProjectDrawer from "../Components/EditProjectDrawer";
import CreateIcon from '../assets/Images/add.png';
import CreateIconB from '../assets/Images/addB.png';
import DeleteIcon from '../assets/Images/delete.png';
import DeleteIconB from '../assets/Images/deleteB.png';

export default function Project() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditDrawer, setShowEditDrawer] = useState(false);

    const toggleDrawer = () => setShowEditDrawer(!showEditDrawer);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/projects/single/${id}`, { withCredentials: true });
                setProject(res.data.project);
            } catch (error) {
                console.error("Error fetching single project:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found</div>;

    const imageSlides = (project.images || []).map((url) => ({ src: url, type: "image" }));

    return (
        <div>
            <Navbar />

            {/* Breadcrumbs */}
            <div className="flex items-center gap-x-3 font-med text-gray-700 md:px-15 px-4">
                <Link to="/collections" className="">
                    Collections
                </Link>
                <ChevronRight className="w-4 h-4" />
                <h1 className="cursor-pointer" onClick={() => navigate(-1)}>Projects</h1>
                <ChevronRight className="w-4 h-4" />
                <h1 className="font-semibold text-black">Project</h1>
            </div>

            <div className="p-2 md:p-15 md:flex md:justify-between md:items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-5xl font-head">{project.title}</h1>
                    <p className="mb-6 font-med">{project.description}</p>
                </div>
                <div className="flex justify-around font-med gap-3 text-gray-500 mt-5 text-sm md:text-[2.3vh]">
                    {/* Edit Project Button */}
                    <div
                        className="group border-2 rounded-2xl p-2 flex cursor-pointer items-center gap-2 transition duration-200 border-gray-500 hover:border-black hover:text-black hover:shadow-lg"
                        onClick={toggleDrawer}
                    >
                        <div className='relative h-5 w-5'>
                            <img
                                className={`absolute inset-0 object-contain transition duration-200 ${showEditDrawer ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
                                    }`}
                                src={CreateIcon}
                                alt='Create Default'
                            />
                            <img
                                className={`absolute inset-0 object-contain transition duration-200 ${showEditDrawer ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                    }`}
                                src={CreateIconB}
                                alt='Create Hover'
                            />
                        </div>
                        <h1>Create Collection</h1>
                    </div>

                    {/* Delete Project Button */}
                    <div className='group border-2 rounded-2xl border-gray-500 p-2 flex cursor-pointer items-center gap-2 hover:border-black hover:text-black hover:shadow-lg duration-200 transition'>
                        <div className='relative h-5 w-5'>
                            <img
                                className='absolute inset-0 object-contain opacity-100 group-hover:opacity-0 transition duration-200'
                                src={DeleteIcon}
                                alt='Delete Default'
                            />
                            <img
                                className='absolute inset-0 object-contain opacity-0 group-hover:opacity-100 transition duration-200'
                                src={DeleteIconB}
                                alt='Delete Hover'
                            />
                        </div>
                        <h1>Delete Collection</h1>
                    </div>
                </div>
            </div>

            {/* Edit Project Drawer */}
            {showEditDrawer && (
                <EditProjectDrawer
                    project={project}
                    onClose={() => setShowEditDrawer(false)}
                // Pass any other props needed for your EditProjectDrawer
                />
            )}

            {/* Project Content */}
            <div className="p-4 md:px-15 md:py-6 w-full">

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-6">
                        <h2 className="font-head text-xl mb-2">Technologies</h2>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full font-med text-sm">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Source Code */}
                {project.source && (
                    <div className="mb-6">
                        <h2 className="font-head text-xl mb-2">Source Code</h2>
                        <a
                            href={project.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 underline font-med"
                        >
                            <Github className="w-5 h-5" />
                            View on GitHub
                        </a>
                    </div>
                )}

                {/* Live Demo */}
                {project.liveDemo && (
                    <div className="mb-6">
                        <h2 className="font-head text-xl mb-2">Live Demo</h2>
                        <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 underline font-med"
                        >
                            <ExternalLink className="w-5 h-5" />
                            Visit Live Demo
                        </a>
                    </div>
                )}

                {/* Video */}
                {project.video && (
                    <div className="mb-6">
                        <h2 className="font-head text-xl mb-2">Video Demo</h2>
                        <video
                            src={project.video}
                            controls
                            className="w-full max-h-[400px] rounded-lg object-contain"
                        />
                    </div>
                )}

                {/* Images gallery */}
                {imageSlides.length > 0 && <ProjectGallery slides={imageSlides} />}
            </div>
        </div>
    );
}
