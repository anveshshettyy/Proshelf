import React, { useState } from 'react';

export default function EditProjectDrawer({
  onClose,
  onSubmit,
  initialData = {}, // optional: preload existing values
}) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [about, setAbout] = useState(initialData.about || '');
  const [source, setSource] = useState(initialData.source || '');
  const [liveDemo, setLiveDemo] = useState(initialData.liveDemo || '');
  const [technologies, setTechnologies] = useState((initialData.technologies || []).join(', '));
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  const handleFormSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('about', about);
    formData.append('source', source);
    formData.append('liveDemo', liveDemo);
    formData.append('technologies', technologies);

    images.forEach((img) => {
      formData.append('images', img);
    });

    if (video) {
      formData.append('video', video);
    }

    onSubmit(formData); 
  };

  return (
    <div className="w-full bg-slate-200 rounded-2xl mt-5 px-5 py-6 shadow-xl animate-slideDown">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-head">Edit Project</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-black text-xl font-bold cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Title */}
        <Field label="Title" value={title} setValue={setTitle} />

        {/* Description */}
        <Textarea label="Description" value={description} setValue={setDescription} />

        {/* About */}
        <Textarea label="About" value={about} setValue={setAbout} />

        {/* Source Link */}
        <Field label="Source Code URL" value={source} setValue={setSource} />

        {/* Live Demo Link */}
        <Field label="Live Demo URL" value={liveDemo} setValue={setLiveDemo} />

        {/* Technologies */}
        <Field label="Technologies (comma-separated)" value={technologies} setValue={setTechnologies} />

        {/* Images */}
        <div className="flex flex-col">
          <label className="font-med mb-1 text-sm text-gray-700">Upload Images</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setImages([...e.target.files])} />
        </div>

        {/* Video */}
        <div className="flex flex-col">
          <label className="font-med mb-1 text-sm text-gray-700">Upload Video</label>
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
        </div>

        <button
          onClick={handleFormSubmit}
          className="bg-black text-white py-2 px-4 rounded-xl hover:shadow-md transition font-med text-sm w-fit self-end"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Helper Input
const Field = ({ label, value, setValue }) => (
  <div className="flex flex-col">
    <label className="font-med mb-1 text-sm text-gray-700">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black"
    />
  </div>
);

// Helper Textarea
const Textarea = ({ label, value, setValue }) => (
  <div className="flex flex-col">
    <label className="font-med mb-1 text-sm text-gray-700">{label}</label>
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      rows={3}
      className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black"
    />
  </div>
);
