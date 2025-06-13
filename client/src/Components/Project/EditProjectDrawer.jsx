import React, { useEffect, useState } from 'react';

export default function EditProjectDrawer({ initialData, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [about, setAbout] = useState('');
  const [source, setSource] = useState('');
  const [liveDemo, setLiveDemo] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  // Pre-fill data when drawer opens
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setAbout(initialData.about || '');
      setSource(initialData.source || '');
      setLiveDemo(initialData.liveDemo || '');
      setTechnologies(initialData.technologies?.join(', ') || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('about', about);
    formData.append('source', source);
    formData.append('liveDemo', liveDemo);
    formData.append('technologies', technologies);

    // Add files only if selected
    images.forEach((img) => formData.append('images', img));
    if (video) formData.append('video', video);

    onSubmit(formData);
  };

  return (
    <div className="w-full bg-slate-200 rounded-2xl mt-5 px-5 py-6 shadow-xl animate-slideDown">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-head">Edit Project</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-black text-xl font-bold">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="font-med text-sm">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
            placeholder="e.g. Portfolio Redesign"
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-med text-sm">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
            rows={2}
            placeholder="Short summary of the project"
          />
        </div>

        {/* About */}
        <div>
          <label className="font-med text-sm">About (Longer details)</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
            rows={4}
            placeholder="Detailed information"
          />
        </div>

        {/* Source Code */}
        <div>
          <label className="font-med text-sm">GitHub Source URL</label>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
            placeholder="e.g. https://github.com/your-repo"
          />
        </div>

        {/* Live Demo */}
        <div>
          <label className="font-med text-sm">Live Demo URL</label>
          <input
            value={liveDemo}
            onChange={(e) => setLiveDemo(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
            placeholder="e.g. https://your-demo.vercel.app"
          />
        </div>

        {/* Technologies */}
        <div>
          <label className="font-med text-sm">Technologies (comma-separated)</label>
          <input
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
            placeholder="React, Node.js, MongoDB"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="font-med text-sm">Upload New Images</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} />
        </div>

        {/* Video Upload */}
        <div>
          <label className="font-med text-sm">Upload New Video</label>
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
        </div>

        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded-xl hover:shadow-md transition font-med text-sm w-fit self-end"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
