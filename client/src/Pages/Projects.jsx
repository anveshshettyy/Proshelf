import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function CategoryProjects() {
  const { id } = useParams(); 
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategoryAndProjects = async () => {
      try {
        const res = await axios.get(`/api/projects/${id}`);
        setCategory(res.data.category);
        setProjects(res.data.projects);
      } catch (error) {
        console.error('Error fetching category projects:', error);
      }
    };

    fetchCategoryAndProjects();
  }, [id]);

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">
        {category?.title || 'Loading...'}
      </h1>
      <p className="mb-6 text-gray-600">{category?.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white shadow-md rounded-lg p-4 border"
          >
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-sm text-gray-600">{project.description}</p>

            {project.images?.length > 0 && (
              <img
                src={project.images[0]}
                alt="project thumbnail"
                className="mt-2 w-full h-40 object-cover rounded-md"
              />
            )}

            <div className="flex gap-4 mt-4 text-sm text-blue-600">
              {project.source && (
                <a href={project.source} target="_blank" rel="noreferrer">
                  Source Code
                </a>
              )}
              {project.liveDemo && (
                <a href={project.liveDemo} target="_blank" rel="noreferrer">
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
