import React from "react";
import { Link } from "react-router-dom";
import CarouselAttractionsItinerary from "./CarouselAttractionsItinerary";
import { FaChevronRight } from "react-icons/fa";

const SkeletonCarousel = () => (
  <div className="flex gap-5 px-10 mb-10 overflow-hidden max-[900px]:px-5 max-[900px]:flex-row max-[900px]:overflow-x-auto">
    {[1, 2, 3].map((item) => (
      <div key={item} className="flex-[0_0_260px] md:flex-[0_0_280px] flex flex-col gap-3 rounded-xl bg-white">
        <div className="w-full h-[200px] rounded-xl bg-gray-200 animate-pulse"></div>
        <div className="h-6 w-4/5 rounded bg-gray-200 animate-pulse"></div>
        <div className="h-4 w-3/5 rounded bg-gray-200 animate-pulse"></div>
      </div>
    ))}
  </div>
);

export default function AttractionSection({
  title,
  atracoes,
  loading,
  filterKey,
  filterName,
  navigate,
}) {
  const handleSeeAll = () => {
    navigate("/lista-atracoes", {
      state: { filters: { [filterKey]: true }, title: filterName },
    });
  };

  return (
    <section className="ml-5 max-[900px]:ml-0 font-poppins">
      <div className="flex justify-between items-center mb-4 px-5 max-[900px]:px-0">
        <h3 className="text-[#383838] text-[30px] font-semibold max-[900px]:text-[24px]">
          {title}
        </h3>
        <button 
          className="bg-transparent border-none p-0 cursor-pointer text-[#008080] text-base font-bold flex items-center gap-1.5 transition-opacity hover:opacity-80" 
          onClick={handleSeeAll}
        >
          Ver todos
          <FaChevronRight size={14} strokeWidth={2} />
        </button>
      </div>
      
      {loading ? (
        <SkeletonCarousel />
      ) : atracoes.length === 0 ? (
        <p className="px-5 text-[#383838]">Nenhuma atração de {filterName.toLowerCase()} encontrada.</p>
      ) : (
        <CarouselAttractionsItinerary atracoes={atracoes} />
      )}
    </section>
  );
}