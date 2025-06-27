import React from 'react';

export default function ImageGallery({ images }) {
  if (!images || images.length === 0) return null;

  return (
    <div className='mt-10'>
      <h2 className='text-xl font-semibold mb-4'>Gallery</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {images.map((img) => (
          <img
            key={img._id}
            src={img.url}
            alt='project-img'
            className='rounded-xl shadow-md hover:scale-105 transition duration-300 object-cover w-full h-[280px]'
          />
        ))}
      </div>
    </div>
  );
}
