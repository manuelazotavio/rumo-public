import React from "react";
import CarouselEvents from "./CarouselEvents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const SkeletonCarousel = () => (
  <div className="flex gap-5 px-10 overflow-hidden mb-10 max-[900px]:px-5">
    {[1, 2, 3, 4].map((item) => (
      <div
        key={item}
        className="flex-[0_0_280px] flex flex-col gap-3 rounded-3xl bg-white box-border p-2"
      >
        <div className="w-full h-[180px] rounded-3xl bg-gray-100 animate-pulse"></div>
        <div className="h-6 w-4/5 rounded bg-gray-100 animate-pulse mt-2"></div>
        <div className="h-4 w-3/5 rounded bg-gray-100 animate-pulse"></div>
      </div>
    ))}
  </div>
);

export default function EventSection({ title, events, loading, navigate }) {
  if (!loading && events.length === 0) return null;

  return (
    <section className="w-full mb-12 font-poppins">
      <div className="flex justify-between items-end mb-6 px-4 md:px-2">
        <h3 className="text-[#383838] text-[28px] md:text-[34px] font-medium leading-none">
          {title}
        </h3>
        <button
          onClick={() => navigate("/todos-eventos")}
          className="bg-transparent border-none p-0 cursor-pointer text-[#008080] text-sm md:text-base font-bold flex items-center gap-1.5 transition-all hover:opacity-75 hover:underline"
        >
          Ver todos
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] mt-0.5" />
        </button>
      </div>

      {loading ? (
        <SkeletonCarousel />
      ) : (
        <CarouselEvents events={events} />
      )}
    </section>
  );
}