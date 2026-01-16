import React, { useState, useEffect } from "react";
import CardAttraction from "./CardAttraction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const CarouselAttractions = ({ atracoes = [] }) => {
  const safeAtracoes = Array.isArray(atracoes) ? atracoes : [];
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
        else if (width < 1400) setVisibleSlides(3);
        else if (width < 1700) setVisibleSlides(4);
        else setVisibleSlides(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, safeAtracoes.length - visibleSlides);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? maxIndex : prevIndex - 1
    );
  };

  return (
    <div className="w-full relative group">
      <div className="relative overflow-hidden">
        {!isMobile && currentIndex > 0 && (
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white to-transparent z-[5] pointer-events-none transition-opacity duration-300" />
        )}
        
        {!isMobile && currentIndex < maxIndex && (
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-[5] pointer-events-none transition-opacity duration-300" />
        )}

        <div
          className={`flex transition-transform duration-500 ease-in-out py-10 ${
            isMobile 
            ? "overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 px-[10vw]" 
            : ""
          }`}
          style={{
            transform: isMobile
              ? "none"
              : `translateX(-${currentIndex * (100 / visibleSlides)}%)`,
          }}
        >
          {safeAtracoes.map((item) => (
            <div 
              className={`shrink-0 ${isMobile ? "snap-center flex-[0_0_80vw]" : "min-w-0 px-2"}`}
              key={item.id}
              style={!isMobile ? { flex: `0 0 ${100 / visibleSlides}%` } : {}}
            >
              <CardAttraction atracao={item} />
            </div>
          ))}
          {isMobile && <div className="shrink-0 w-[10vw]" />}
        </div>
      </div>

      {!isMobile && safeAtracoes.length > visibleSlides && (
        <>
          <button
            className={`absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white cursor-pointer shadow-2xl rounded-full flex items-center justify-center z-20 hover:bg-[#008080] hover:text-white transition-all border border-gray-100 ${currentIndex === 0 ? "opacity-0 invisible" : "opacity-100"}`}
            onClick={prevSlide}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <button
            className={`absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white cursor-pointer shadow-2xl rounded-full flex items-center justify-center z-20 hover:bg-[#008080] hover:text-white transition-all border border-gray-100 ${currentIndex >= maxIndex ? "opacity-0 invisible" : "opacity-100"}`}
            onClick={nextSlide}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </>
      )}
    </div>
  );
};

export default CarouselAttractions;