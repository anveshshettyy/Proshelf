import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ChevronRight } from 'lucide-react';
import Navbar from "../Components/Navbar";
import ProjectGallery from "../Components/ProjectGallery";
import { useNavigate } from 'react-router-dom';

export default function Project() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

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

    // Separate images and videos into slides for ProjectGallery
    const imageSlides = (project.images || []).map((url) => ({ src: url, type: "image" }));

    return (
        <div>
            <Navbar />

            <div className="flex items-center gap-x-3 font-med text-gray-700 md:px-15 px-4">
                <Link to="/collections" className="">
                    Collections
                </Link>
                <ChevronRight className="w-4 h-4" />
                <h1 className="cursor-pointer" onClick={() => navigate(-1)}>Projects</h1>
                <ChevronRight className="w-4 h-4" />
                <h1 className=" font-semibold text-black">Project</h1>
            </div>

            <div className="p-4 max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
                <p className="mb-6">{project.description}</p>

                {/* Video container (if project.video exists) */}
                {project.video && (
                    <div className="mb-6">
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
