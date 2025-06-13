// Components/ProjectVideo.jsx
import React, { useRef, useState } from "react";
import { Trash2, UploadCloud } from "lucide-react";

export default function ProjectVideo({ videoUrl, onUpload, onDelete }) {
  const fileInputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      onUpload(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      onUpload(file);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="font-head text-xl mb-2">Video Demo</h2>

      {videoUrl ? (
        <div className="relative group">
          <video src={typeof videoUrl === "string" ? videoUrl : videoUrl?.url}
            controls
            className="w-full rounded-lg max-h-[400px]" />
          {onDelete && (
            <button
              onClick={onDelete}
              className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          className={`w-full border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:text-black hover:border-black transition ${dragging ? "border-black bg-gray-100" : "border-gray-400"
            }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <UploadCloud className="w-10 h-10 mb-2" />
          <p className="text-center text-sm">Drag & drop a video or click to select</p>
          <input
            type="file"
            accept="video/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
