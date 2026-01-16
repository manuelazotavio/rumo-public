import React from "react";
import CarouselAttractions from "./CarouselAttractions";
import { FaChevronRight } from "react-icons/fa";

const SkeletonCarousel = () => (
  <div className="flex gap-5 px-10 overflow-hidden mb-10 max-[900px]:px-5 max-[900px]:flex-row max-[900px]:overflow-x-auto">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="flex-[0_0_260px] md:flex-[0_0_280px] flex flex-col gap-3 rounded-xl bg-white box-border"
      >
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
    <section className="w-full mb-12 font-poppins">
      <div className="flex justify-between items-end mb-6 px-4 md:px-2">
        <h3 className="text-[#383838] text-[28px] md:text-[34px] font-medium leading-none">
          {title}
        </h3>
        <button
          className="bg-transparent border-none p-0 cursor-pointer text-[#008080] text-sm md:text-base font-bold flex items-center gap-1.5 transition-all hover:opacity-75 hover:underline"
          onClick={handleSeeAll}
        >
          Ver todos
          <FaChevronRight size={14} className="mt-0.5" />
        </button>
      </div>

      {loading ? (
        <SkeletonCarousel />
      ) : atracoes.length === 0 ? (
        <p className="px-5 text-gray-500">
          Nenhuma atração de {filterName.toLowerCase()} encontrada.
        </p>
      ) : (
        <CarouselAttractions atracoes={atracoes} />
      )}
    </section>
  );
}
