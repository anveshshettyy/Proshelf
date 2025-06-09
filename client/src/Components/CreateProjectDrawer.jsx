import React from 'react';

export default function CreateProjectDrawer({ onClose, onSubmit, title, setTitle, description, setDescription }) {
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

        <div className="flex flex-col">
          <label className="font-med mb-1 text-sm text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black font-med"
            placeholder="e.g. A collection of landing page projects built with React and Tailwind"
          />
        </div>

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
