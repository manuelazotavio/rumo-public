import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ComentarioCard from "./ComentarioCard";

export default function ComentariosCarousel({ comentarios }) {
  const [indexAtivo, setIndexAtivo] = useState(0);
  const total = comentarios.length;

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const prev = () =>
    setIndexAtivo((prev) => (prev - 1 + total) % total);

  console.log('tesste')
  const next = () =>
    setIndexAtivo((prev) => (prev + 1) % total);

  const getIndex = (offset) =>
    (indexAtivo + offset + total) % total;

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (diff > 50) next();    
    if (diff < -50) prev();   
  };

  return (
    <section className="mt-6">
      
      <div className="flex items-center gap-5 mb-8">
        <h3 className="text-3xl md:text-5xl font-black text-[#383838]">
          Comentários
        </h3>

        <button className="text-sm font-bold text-[#008080] hover:underline">
          Ver todos &gt;
        </button>
      </div>

      <div
        className="md:hidden relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <ComentarioCard
          comentario={comentarios[indexAtivo]}
          variant="destaque"
        />

        <div className="flex justify-center gap-2 mt-4">
          {comentarios.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === indexAtivo ? "bg-[#008080]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="hidden md:flex relative items-center justify-center gap-10">

        <button
          onClick={prev}
          className="absolute left-0 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center xl:left-[-60px]"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <ComentarioCard
          comentario={comentarios[getIndex(-1)]}
          variant="pequeno"
        />

        <ComentarioCard
          comentario={comentarios[getIndex(0)]}
          variant="destaque"
        />

        <ComentarioCard
          comentario={comentarios[getIndex(1)]}
          variant="pequeno"
        />

        <button
          onClick={next}
          className="absolute right-0 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center xl:right-[-60px]"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </section>
  );
}
