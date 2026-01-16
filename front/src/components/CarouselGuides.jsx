import React, { useState, useEffect } from "react";
import CardGuide from "./CardGuide"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const CarouselGuides = ({ guides = [] }) => { 
  const safeGuides = Array.isArray(guides) ? guides : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleSlides(1);
        setIsMobile(true);
      } else {
        setIsMobile(false);
        if (width < 1024) setVisibleSlides(2);
        else if (width < 1600) setVisibleSlides(3);
        else setVisibleSlides(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, safeGuides.length - visibleSlides);

  const nextSlide = () => setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1));

  if (safeGuides.length === 0) return null;

  return (
    <div className="w-full relative group">
      <div className="relative overflow-hidden">
        <div
          className={`flex transition-transform duration-500 ease-in-out py-10 ${
            isMobile 
              ? "overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 px-[10vw]" 
              : ""
          }`}
          style={{
            transform: isMobile ? "none" : `translateX(-${currentIndex * (100 / visibleSlides)}%)`,
          }}
        >
          {safeGuides.map((item) => (
            <div
              key={item.id}
              className={`${isMobile ? "snap-center" : "snap-start"} shrink-0`}
              style={!isMobile 
                ? { flex: `0 0 ${100 / visibleSlides}%`, padding: "0 12px" } 
                : { flex: "0 0 80vw" }
              }
            >
              <CardGuide guide={item} />
            </div>
          ))}
        
          {isMobile && <div className="shrink-0 w-[10vw]" />}
        </div>
      </div>

      {!isMobile && safeGuides.length > visibleSlides && (
        <>
          <button
            className={`absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-2xl rounded-full flex items-center justify-center cursor-pointer z-20 hover:bg-[#008080] hover:text-white transition-all border border-gray-100 ${currentIndex === 0 ? "opacity-0 invisible" : "opacity-100"}`}
            onClick={prevSlide}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            className={`absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-2xl rounded-full flex items-center justify-center cursor-pointer z-20 hover:bg-[#008080] hover:text-white transition-all border border-gray-100 ${currentIndex >= maxIndex ? "opacity-0 invisible" : "opacity-100"}`}
            onClick={nextSlide}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </>
      )}
    </div>
  );
};

export default CarouselGuides;