import React from 'react';

export default function CreateProjectDrawer({
  onClose,
  onSubmit,
  // Existing
  title, setTitle,
  description, setDescription,
  // Add these new states and setters
  about, setAbout,
  source, setSource,
  liveDemo, setLiveDemo,
  technologies, setTechnologies,
  // File upload handlers
  handleImageUpload, // function to handle image files (call this onChange on file input)
  handleVideoUpload, // function to handle video file (call this onChange on file input)
}) {
  return (
    <div className="w-full bg-slate-200 rounded-2xl mt-5 px-5 py-6 shadow-xl animate-slideDown">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-head">Create New Project</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-black text-xl font-bold cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col">
          <label className="font-med mb-1 text-sm text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-med"
            placeholder="e.g. Landing Page Designs"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="font-med mb-1 text-sm text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-med"
            placeholder="e.g. A collection of landing page "
          />
        </div>

        <div className='flex flex-col'>
          <label className='font-med mb-1 text-sm text-gray-700'>Give brief about the project</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-med"
            placeholder="Tell about your project"
          />
        </div>

        {/* Source */}
        <div className="flex flex-col">
          <label className="font-med mb-1 text-sm text-gray-700">Source (e.g. GitHub URL)</label>
          <input
            type="url"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-med"
            placeholder="https://github.com/yourusername/project"
          />
        </div>

        {/* Live Demo */}
        <div className="flex flex-col">
          <label className="font-med mb-1 text-sm text-gray-700">Live Demo URL</label>
          <input
            type="url"
            value={liveDemo}
            onChange={(e) => setLiveDemo(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-med"
            placeholder="https://yourproject.com"
          />
        </div>

        {/* Technologies */}
        <div className="flex flex-col">
          <label className="font-med mb-1 text-sm text-gray-700">
            Technologies (comma-separated)
          </label>
          <input
            type="text"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-med"
            placeholder="React, Tailwind, Node.js"
          />
        </div>

        {/* Images Upload */}
        <div className="flex flex-col">
          <label className="font-med mb-1 text-sm text-gray-700">Images (multiple allowed)</label>
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-med"
          />
        </div>

        {/* Video Upload */}
        <div className="flex flex-col">
          <label className="font-med mb-1 text-sm text-gray-700">Video</label>
          <input
            type="file"
            onChange={handleVideoUpload}
            accept="video/*"
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-med"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          className="bg-black text-white py-2 px-4 rounded-xl hover:shadow-md transition font-med text-sm w-fit self-end cursor-pointer"
        >
          Create Project
        </button>
      </div>
    </div>
  );
}
