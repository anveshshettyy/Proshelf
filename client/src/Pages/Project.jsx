import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronRight, Edit2, Trash2, ExternalLink, Github, ArrowUpRight, EditIcon, Link2, LinkIcon, Link2Icon, ChevronUp, ChevronDown } from "lucide-react";
import Navbar from "../Components/Navbar";
import ProjectGallery from "../Components/Project/ProjectGallery";
import EditProjectDrawer from "../Components/Project/UpdateProjectDrawer";
import CreateIcon from '../assets/Images/add.png';
import CreateIconB from '../assets/Images/addB.png';
import DeleteIcon from '../assets/Images/delete.png';
import DeleteIconB from '../assets/Images/deleteB.png';
import CustomAlert from "../Components/CustomAlert";
import ProjectVideo from "../Components/Project/ProjectVideo";
import ConfirmPopup from '../Components/ConfirmPopup';
import Loader from '../Components/Loader';

export default function Project() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditDrawer, setShowEditDrawer] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [onConfirmCallback, setOnConfirmCallback] = useState(() => () => { });

    const confirmVideoDelete = () => {
        setPopupMessage("Are you sure you want to delete this video?");
        setOnConfirmCallback(() => () => handleVideoDelete());
        setShowPopup(true);
    };

    const confirmProjectDelete = () => {
        setPopupMessage("This project will be permanently deleted. Continue?");
        setOnConfirmCallback(() => () => handleDelete(project._id));
        setShowPopup(true);
    };


    const confirmImageDelete = (image) => {
        setPopupMessage("Are you sure you want to delete this image?");
        setOnConfirmCallback(() => () => handleImageDelete(image));
        setShowPopup(true);
    };

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDrawer = () => setShowEditDrawer(!showEditDrawer);

    const [alert, setAlert] = useState(null);
    const dismissAlert = () => setAlert(null);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/projects/single/${id}`, { withCredentials: true });
                setProject(res.data.project); // Set project first
            } catch (error) {
                console.error("Error fetching single project:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);


    if (loading) return <Loader />;
    if (!project) return <div>Project not found</div>;

    const handleEditSubmit = async (formData) => {
        try {
            const res = await axios.post(`/api/projects/update/${project._id}`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setProject(res.data.project);
            setShowEditDrawer(false);
        } catch (err) {
            console.error("Failed to update project:", err);
        }
    };

    const handleVideoDelete = async () => {
        try {
            setAlert({ message: "Deleting video. Please wait...", type: "info" });

            await axios.put(
                `/api/projects/remove-video/${project._id}`,
                {},
                { withCredentials: true }
            );

            setProject((prev) => ({ ...prev, video: "" }));
            setAlert({ message: "Video deleted successfully.", type: "success" });
            setShowPopup(false); // Close popup after deletion
        } catch (err) {
            console.error("Failed to delete video:", err);
            setAlert({ message: "Failed to delete video. Please try again.", type: "error" });
        }
    };

    const handleImageDelete = async (image) => {
        try {
            setAlert({ message: "Deleting image. Please wait...", type: "info" });

            const res = await axios.put(
                `/api/projects/remove-image/${project._id}`,
                { public_id: image.public_id }, // 
                { withCredentials: true }
            );

            setProject((prev) => ({ ...prev, images: res.data.images }));
            setAlert({ message: "Image deleted successfully.", type: "success" });
            setShowPopup(false); // Close popup after deletion
        } catch (err) {
            console.error("Failed to delete image:", err);
            setAlert({ message: "Failed to delete image. Please try again.", type: "error" });
        }
    };


    const handleAddImage = async (files) => {
        const formData = new FormData();
        for (let file of files) {
            formData.append("images", file);
        }

        try {
            setAlert({ message: "Adding image. Please wait...", type: "info" });

            const res = await axios.post(`/api/projects/add-image/${project._id}`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            setProject((prev) => ({ ...prev, images: res.data.images }));
            setAlert({ message: "Image Added successfully.", type: "success" });
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (projectId) => {
        try {
            await axios.delete(`/api/projects/delete/${projectId}`, { withCredentials: true });

            setAlert({ message: "Project deleted successfully!", type: "success" });
            navigate(-1); // or navigate("/collections")
            setShowPopup(false); // Close popup after deletion
        } catch (error) {
            console.error("Error deleting project:", error);
            setAlert({ message: "Failed to delete project.", type: "error" });
        }
    };


    const imageSlides = Array.isArray(project.images)
        ? project.images.map(img => ({ src: img.url, type: "image", original: img }))
        : [];

    const cancelPopup = () => {
        setShowPopup(false);
        setOnConfirmCallback(() => () => { });
    };

    return (
        <div>
            <Navbar />

            {alert && <CustomAlert message={alert.message} type={alert.type} onClose={dismissAlert} />}

            <div className="flex items-center gap-x-3 font-med text-gray-700 md:px-15 px-4">
                <Link to="/collections" className="hover:underline">Collections</Link>
                <ChevronRight className="w-4 h-4" />
                <h1 className="cursor-pointer hover:underline" onClick={() => navigate(-1)}>Projects</h1>
                <ChevronRight className="w-4 h-4" />
                <h1 className="font-semibold text-black">Project</h1>
            </div>

            <div className="py-2 px-4 md:p-15 md:flex  md:flex-row md:justify-between md:items-center gap-4  ">
                <div className="flex flex-col gap-2 md:w-[70%]">
                    <h1 className="text-4xl md:text-5xl font-head">{project.title}</h1>
                    <p className="mb-6 font-med">{project.description}</p>
                </div>
                <div className="flex justify-around font-med gap-3 text-gray-500 mb-5 text-sm md:text-[2.3vh] ">
                    <div onClick={toggleDrawer} className="group border-2 rounded-2xl p-2 flex cursor-pointer items-center gap-2 transition duration-200 border-gray-500 hover:border-black hover:text-black hover:shadow-lg px-5">
                        <div className='relative h-5 w-5'>
                            <img className={`absolute inset-0 object-contain transition duration-200 ${showEditDrawer ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`} src={CreateIcon} alt='Create Default' />
                            <img className={`absolute inset-0 object-contain transition duration-200 ${showEditDrawer ? 'opacity-100' : 'md:opacity-0 group-hover:opacity-100'}`} src={CreateIconB} alt='Create Hover' />
                        </div>
                        <h1>Edit Project</h1>
                    </div>

                    <div className='group border-2 rounded-2xl border-gray-500 p-2 flex cursor-pointer items-center gap-2 hover:border-black hover:text-black hover:shadow-lg duration-200 transition'
                        onClick={confirmProjectDelete}
                    >
                        <div className='relative h-5 w-5'>
                            <img className='absolute inset-0 object-contain opacity-100 md:group-hover:opacity-0 transition duration-200' src={DeleteIcon} alt='Delete Default' />
                            <img className='absolute inset-0 object-contain md:opacity-0 group-hover:opacity-100 transition duration-200' src={DeleteIconB} alt='Delete Hover' />
                        </div>
                        <h1>Delete Project</h1>
                    </div>
                </div>
            </div>


            {showEditDrawer && (
                <div className="px-15 pb-5">
                    <EditProjectDrawer
                        initialData={project}
                        onClose={() => setShowEditDrawer(false)}
                        onSubmit={handleEditSubmit}
                    />
                </div>

            )}

            <div className="p-4 md:px-15  w-full">
                <h1 className="text-3xl font-head pb-5">About Project</h1>
                <div
                    className={`${project.about ? 'overflow-y-auto' : 'overflow-y-hidden'
                        } relative max-h-[500px] pr-2 bg-slate-100 md:px-10 md:py-7 rounded-xl p-5`}
                    data-lenis-prevent
                >
                    {project.about ? (
                        <>
                            <div
                                className={`text-gray-700 leading-relaxed tracking-wide font-med transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[9999px]' : 'max-h-[240px]'
                                    }`}
                            >
                                {project.about.split('\r\n\r\n').map((para, i) => {
                                    const isEmojiHeading = /^[^\w\s]/.test(para.trim());
                                    return isEmojiHeading ? (
                                        <p key={i} className="font-semibold text-[16px] mt-4">
                                            {para}
                                        </p>
                                    ) : (
                                        <p key={i} className="whitespace-pre-line mb-2">{para}</p>
                                    );
                                })}
                            </div>

                            {/* Fade Overlay */}
                            {!isExpanded && (
                                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none" />
                            )}

                            {/* Read More / Show Less */}
                            <div className="flex justify-center mt-4">
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
                        </>
                    ) : (
                        <div className="text-center text-gray-600">
                            <p className="text-lg font-med mb-2">No About section added yet.</p>
                            <button
                                onClick={toggleDrawer}
                                className="text-slate-600 hover:underline font-med cursor-pointer flex justify-center w-full items-center gap-2"
                            >
                                Add About Info
                                <EditIcon className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>

                {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-6 mb-6">
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
                {project.source ? (
                    <div className="mb-6">
                        <h2 className="font-head text-xl mb-2">Source Code</h2>
                        <a
                            href={project.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-slate-700 underline font-med"
                        >
                            <LinkIcon /> {project.source}
                        </a>
                    </div>
                ) : (
                    <div className="mb-6   text-gray-600">
                        <h2 className="font-head text-xl mb-2 text-black">Source Code</h2>

                        <div className="flex gap-x-2 ">
                            <p className="mb-1 font-med">No Source code link available.</p>
                            <button onClick={toggleDrawer} className=" underline hover:text-black cursor-pointer flex gap-2  font-med">Add Source code
                                <EditIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Live Demo */}
                {project.liveDemo ? (
                    <div className="mb-6">
                        <h2 className="font-head text-xl mb-2">Live Demo</h2>
                        <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-slate-700 underline font-med"
                        >
                            <ExternalLink className="w-5 h-5" />
                            {project.liveDemo}
                        </a>
                    </div>
                ) : (
                    <div className="mb-6  text-gray-600">
                        <h2 className="font-head text-xl mb-2 text-black ">Live Demo</h2>
                        <div className="flex gap-x-2 ">
                            <p className="mb-1 font-med">No Live Demo link available.</p>
                            <button onClick={toggleDrawer} className=" underline hover:text-black cursor-pointer flex gap-2  font-med">Add Live Demo
                                <EditIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

                <ProjectVideo
                    videoUrl={project.video}
                    onUpload={async (file) => {
                        const formData = new FormData();
                        formData.append("video", file);

                        try {
                            setAlert({ message: "Uploading video...", type: "info" });

                            const res = await axios.put(`/api/projects/add-video/${project._id}`, formData, {
                                withCredentials: true,
                                headers: { "Content-Type": "multipart/form-data" },
                            });




                            setProject(res.data.project);
                            setAlert({ message: "Video uploaded successfully.", type: "success" });
                        } catch (err) {
                            console.error(err);
                            setAlert({ message: "Video upload failed.", type: "error" });
                        }
                    }}
                    onDelete={confirmVideoDelete}
                />

                <ProjectGallery
                    slides={imageSlides}
                    onDeleteImage={confirmImageDelete}
                    onAddImage={handleAddImage}
                />
            </div>


            {showPopup && (
                <ConfirmPopup
                    isOpen={showPopup}
                    message={popupMessage}
                    onConfirm={onConfirmCallback}
                    onCancel={cancelPopup}
                />
            )}

        </div>
    );
}
