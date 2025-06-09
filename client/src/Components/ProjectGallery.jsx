import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
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
    <div className="mb-6">
      <ResponsiveMasonry
        columnsCountBreakPoints={{
          0: 1,   
          640: 2,   
          1024: 3,  
        }}
      >
        <Masonry gutter="1rem">
          {slides.map((slide, i) =>
            slide.type === "video" ? (
              <video
                key={i}
                src={slide.src}
                className="w-full rounded-lg cursor-pointer object-cover"
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
                className="w-full rounded-lg cursor-pointer"
                onClick={() => handleClick(i)}
                loading="lazy"
              />
            )
          )}
        </Masonry>
      </ResponsiveMasonry>

      <Lightbox
        open={open}
        slides={slides}
        index={index}
        close={() => setOpen(false)}
      />
    </div>
  );
}
