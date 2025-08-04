import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SimpleCarousel({
  images = [],
  linkFood,
  linkMenuOrReceipt,
}) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  if (!images.length) return null;

  const goTo = (idx) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(idx);
      setFade(true);
    }, 100);
  };
  const prev = () => goTo(current === 0 ? images.length - 1 : current - 1);
  const next = () => goTo(current === images.length - 1 ? 0 : current + 1);

  return (
    <div className="relative w-full max-w-2xl mx-auto select-none">
      <div className="overflow-hidden rounded-xl flex items-center justify-center">
        <a
          href={current === 0 ? `${linkFood}` : `${linkMenuOrReceipt}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={images[current].src}
            alt={images[current].alt || `slide-${current}`}
            className={`max-w-full max-h-[40rem] object-contain rounded-xl transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          />
        </a>

        {/* Left Arrow */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg z-10 cursor-pointer"
          aria-label="Previous"
        >
          &#10094;
        </button>
        {/* Right Arrow */}
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white text-gray-900 rounded-full p-3 shadow-md z-10 cursor-pointer"
          aria-label="Next"
        >
          &#10095;
        </button>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300  ${
              idx === current ? "bg-gray-700" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
