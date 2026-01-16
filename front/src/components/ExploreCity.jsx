import React, { useState, useEffect } from "react";
import explorecity1 from "../img/explorecity-1.png";
import explorecity2 from "../img/explorecity-2.png";
import explorecity3 from "../img/explorecity-3.png";
import explorecity4 from "../img/explorecity-4.png";
import explorecity5 from "../img/explorecity-5.png";
import { useNavigate } from "react-router-dom";
import Subtitle from "./Subtitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const ExploreCity = () => {

  const navigate = useNavigate();

  const attractions = [
    {
      id: 1,
      title: "Aventura",
      path: "/blog/aventura",
      description:
        "Explore trilhas, cachoeiras e atividades de ecoturismo em meio à natureza preservada.",
      image: explorecity1,
    },
    {
      id: 2,
      title: "Comércio",
      path: "/blog/comercio",
      description:
        "Conheça a rica história e tradições caiçaras que moldaram a identidade da região.",
      image: explorecity2,
    },
    {
      id: 3,
      title: "Gastronomia Local",
      path: "/blog/gastronomia",
      description:
        "A culinária de Caraguatatuba se destaca pelos pratos à base de frutos do mar frescos.",
      image: explorecity3,
    },
    {
      id: 4,
      title: "Náutico",
      path: "/blog/nautico",
      description:
        "Explore a história marítima através dos monumentos locais e passeios de barco.",
      image: explorecity4,
    },
    {
      id: 5,
      title: "Praias",
      path: "/blog/praias",
      description:
        "Descubra as praias paradisíacas de Caraguatatuba, com águas cristalinas.",
      image: explorecity5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleSlides, setVisibleSlides] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleSlides(1);
      } else if (window.innerWidth < 1024) {
        setVisibleSlides(2);
      } else {
        setVisibleSlides(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, attractions.length - visibleSlides);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? maxIndex : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, maxIndex]);

  const ArrowIcon = ({ size = 16, className = "" }) => (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );

  return (
    <section className="w-full py-12 bg-transparent font-poppins">
      <div className="max-w-[1200px] mx-auto w-full">
        <Subtitle className="ml-5 md:ml-[60px] mb-10 text-[50px] font-semibold">
          Explore a cidade
        </Subtitle>

        <div
          className="relative px-0 md:px-[60px]"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden pb-[30px]">
            <div
              className="flex transition-transform duration-500 ease-in-out w-full"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / visibleSlides)
                }%)`,
              }}
            >
              {attractions.map((attraction) => (
                <div
                  key={attraction.id}
                  onClick={() => navigate(attraction.path)}
                  className="min-w-0 px-[15px] box-border"
                  style={{ flex: `0 0 ${100 / visibleSlides}%` }}
                >
                  <div className="group bg-white overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.08)] cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex flex-col h-auto max-w-[320px] mx-auto hover:-translate-y-2 md:max-w-full">
                    <div
                      className="h-[280px] relative overflow-hidden shrink-0 bg-cover bg-center bg-no-repeat transition-[height] duration-300"
                      style={{ backgroundImage: `url(${attraction.image})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <div className="p-5 flex flex-col relative bg-white">
                      <h3 className="text-[20px] font-medium m-0 text-[#070707] transition-all duration-300 group-hover:text-[#008080] group-hover:-translate-y-0.5">
                        {attraction.title}
                      </h3>

                      <div className="max-h-0 md:group-hover:max-h-[250px] opacity-0 md:group-hover:opacity-100 overflow-hidden transition-all duration-500 ease-in-out mt-0 md:group-hover:mt-4 max-[768px]:max-h-none max-[768px]:opacity-100 max-[768px]:mt-2.5">
                        <p className="text-sm text-[#383838] leading-relaxed mb-5 text-start">
                          {attraction.description}
                        </p>
                        <button className="flex items-center justify-center gap-2 text-[#383838] font-semibold text-sm border-none rounded-lg py-2.5 px-5 cursor-pointer w-full transition-all duration-300 hover:bg-[#008080] hover:text-white">
                          <span>Ver mais</span>
                          <ArrowIcon
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-[10px] w-11 h-11 border-none rounded-full bg-white cursor-pointer items-center justify-center transition-all duration-300 z-10 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:scale-110"
            onClick={prevSlide}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-gray-500" />
          </button>
          <button
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-[10px] w-11 h-11 border-none rounded-full bg-white cursor-pointer items-center justify-center transition-all duration-300 z-10 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:scale-110"
            onClick={nextSlide}
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-500" />
          </button>

          {attractions.length > visibleSlides && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  className={`h-2.5 rounded-full border-none cursor-pointer transition-all duration-300 p-0 ${
                    index === currentIndex
                      ? "bg-[#008080] w-7 rounded-[5px]"
                      : "bg-[#cbd5e1] w-2.5 hover:bg-[#94a3b8]"
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExploreCity;
