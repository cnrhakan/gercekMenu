import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";

export default function HorizontalPostSlider({ posts = [], clickedPost }) {
  const [startIdx, setStartIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1); // md altı
      } else {
        setVisibleCount(2); // md ve üzeri
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const canGoLeft = startIdx > 0;
  const canGoRight = startIdx + visibleCount < posts.length;

  const handlePrev = () => {
    if (canGoLeft) setStartIdx(startIdx - 1);
  };

  const handleNext = () => {
    if (canGoRight) setStartIdx(startIdx + 1);
  };

  if (!posts.length) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="relative w-full max-w-3xl flex items-center">
        <button
          onClick={handlePrev}
          disabled={!canGoLeft}
          className="absolute left-0 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition disabled:opacity-30 cursor-pointer"
          aria-label="Önceki"
        >
          ❮
        </button>

        <div className="flex gap-4 w-full justify-center px-10">
          {posts.slice(startIdx, startIdx + visibleCount).map((post) => (
            <div
              key={post.id}
              className={`flex-shrink-0 w-full ${
                visibleCount > 1 ? "md:w-1/2" : "w-full"
              }`}
            >
              <PostCard
                size="sm"
                post={post}
                sameUser={false}
                clickedPost={clickedPost}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!canGoRight}
          className="absolute right-0 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition disabled:opacity-30 cursor-pointer"
          aria-label="Sonraki"
        >
          ❯
        </button>
      </div>

      <div className="flex gap-2 mt-2">
        {Array.from({
          length: Math.max(posts.length - visibleCount + 1, 1),
        }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setStartIdx(idx)}
            className={`w-3 h-3 rounded-full ${
              idx === startIdx ? "bg-gray-700" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
