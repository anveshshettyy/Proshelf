import React from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function ProjectGallery({ slides }) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const handleClick = (i) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {slides.map((slide, i) => (
          slide.type === "video" ? (
            <video
              key={i}
              src={slide.src}
              className="w-full h-40 object-cover rounded cursor-pointer"
              onClick={() => handleClick(i)}
              muted
              playsInline
              loop
            />
          ) : (
            <img
              key={i}
              src={slide.src}
              alt={`Slide ${i + 1}`}
              className="w-full h-40 object-cover rounded cursor-pointer"
              onClick={() => handleClick(i)}
            />
          )
        ))}
      </div>

      <Lightbox
        open={open}
        slides={slides}
        index={index}
        close={() => setOpen(false)}
      />
    </div>
  );
}
