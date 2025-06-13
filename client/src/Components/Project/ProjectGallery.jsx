import React, { useRef, useState, useEffect } from "react";
import { Trash2, UploadCloud } from "lucide-react";

export default function ProjectGallery({ slides, onDeleteImage, onAddImage }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleFileChange = (e) => {
    onAddImage([...e.target.files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = [...e.dataTransfer.files];
    onAddImage(files);
  };

  const handleImageClick = (index) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => setSelectedIndex(null);
  const handleNext = () =>
    setSelectedIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () =>
    setSelectedIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [slides]);

  return (
    <div className="mt-6">
      {slides.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="mb-4 text-lg font-med">No images found. Add some images below 👇</p>
          <div
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-8 rounded-lg cursor-pointer transition ${
              dragging ? "border-black bg-gray-100" : "border-gray-400"
            }`}
          >
            <UploadCloud className="mx-auto h-10 w-10 mb-2 text-gray-500" />
            <p className="text-gray-500 text-sm">Click or drag & drop to upload image(s)</p>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <>
          <h2 className="font-head text-xl mb-3">Project Images</h2>
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {slides.map((slide, idx) => (
              <div key={idx} className="break-inside-avoid relative group">
                <img
                  src={slide.src || slide.url || slide} // fallback support
                  alt={`slide-${idx}`}
                  className="rounded-md w-full h-auto cursor-pointer"
                  onClick={() => handleImageClick(idx)}
                />
                <button
                  onClick={() => onDeleteImage(slide.original)}

                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`mt-6 border-2 border-dashed p-6 rounded-lg cursor-pointer transition ${
              dragging ? "border-black bg-gray-100" : "border-gray-400"
            }`}
          >
            <UploadCloud className="mx-auto h-8 w-8 mb-2 text-gray-500" />
            <p className="text-center text-sm text-gray-500">
              Click or drag & drop to add more images
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Lightbox viewer */}
          {selectedIndex !== null && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
              <button
                onClick={closeLightbox}
                className="absolute top-5 right-6 text-white text-3xl font-bold"
              >
                &times;
              </button>

              <button
                onClick={handlePrev}
                className="absolute left-4 text-white text-4xl font-bold px-3 hover:scale-110 transition"
              >
                ‹
              </button>

              <img
                src={slides[selectedIndex].src || slides[selectedIndex]}
                alt="Full View"
                className="max-h-[90vh] max-w-[90vw] object-contain rounded shadow-xl"
              />

              <button
                onClick={handleNext}
                className="absolute right-4 text-white text-4xl font-bold px-3 hover:scale-110 transition"
              >
                ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
