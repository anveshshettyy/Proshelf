import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

export default function ImageGallery({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [direction, setDirection] = useState(0);
  const [photoData, setPhotoData] = useState([]);

  // Dynamically load image dimensions once
  useEffect(() => {
    const loadImageSizes = async () => {
      const promises = images.map((img) => {
        return new Promise((resolve) => {
          const image = new Image();
          image.onload = () => {
            resolve({
              ...img,
              aspectRatio: image.naturalWidth / image.naturalHeight,
            });
          };
          image.src = img.url;
        });
      });

      const result = await Promise.all(promises);
      setPhotoData(result);
    };

    if (images?.length) loadImageSizes();
  }, [images]);

  const openModal = (index) => {
    setSelectedIndex(index);
    setDirection(0);
  };

  const closeModal = () => setSelectedIndex(null);

  const showPrev = () => {
    setDirection(-1);
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const showNext = () => {
    setDirection(1);
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  if (!images || images.length === 0) return null;

  return (
    <div className='mt-10'>
      <h2 className='text-2xl font-semibold mb-4'>Gallery</h2>

      {/* ✅ Pinterest-Style Layout */}
      <div className='columns-1 sm:columns-2 md:columns-3 gap-5 space-y-5'>
        {photoData.map((img, index) => (
          <motion.div
            key={img._id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => openModal(index)}
            className="break-inside-avoid overflow-hidden rounded-xl shadow-md cursor-pointer"
          >
            <img
              src={img.url}
              alt="project-img"
              className="w-full h-auto object-cover"
              style={{ aspectRatio: img.aspectRatio }}
            />
          </motion.div>
        ))}
      </div>

      {/* ✅ Preview Modal */}
      <AnimatePresence custom={direction}>
        {selectedIndex !== null && (
          <motion.div
            className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center px-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button onClick={closeModal} className='absolute top-5 right-5 text-white hover:text-slate-300 z-10 cursor-pointer'>
              <X size={30} />
            </button>

            <button onClick={showPrev} className='absolute left-5 text-white hover:text-gray-300 z-10 cursor-pointer'>
              <ArrowLeft size={40} />
            </button>

            <div className='relative w-full max-w-7xl h-[90vh] flex items-center justify-center overflow-hidden'>
              <AnimatePresence custom={direction} mode='wait'>
                <motion.img
                  key={images[selectedIndex].url}
                  src={images[selectedIndex].url}
                  custom={direction}
                  variants={slideVariants}
                  initial='enter'
                  animate='center'
                  exit='exit'
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className='absolute max-h-[90vh] w-auto rounded-xl shadow-2xl object-contain'
                />
              </AnimatePresence>
            </div>

            <button onClick={showNext} className='absolute right-5 text-white hover:text-gray-300 z-10 cursor-pointer'>
              <ArrowRight size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
