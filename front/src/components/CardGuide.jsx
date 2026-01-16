import React, { useState } from "react";
import { createPortal } from "react-dom";
import guidePlaceholder from "../img/guide-user.png";
import { FaChevronRight } from "react-icons/fa";
import ModalGuide from "./ModalGuide";

export default function CardGuide({ guide }) {
  const [showModal, setShowModal] = useState(false);

  const segs = guide.segment?.replace(/\|/g, " • ");
  const langs = guide.languages?.replace(/\|/g, ", ");
  const guideImagem = guide.image?.trim() ? guide.image : guidePlaceholder;

  return (
    <>
      {showModal &&
        createPortal(
          <ModalGuide onClose={() => setShowModal(false)} guide={guide} />,
          document.body
        )}

      <div
        onClick={() => setShowModal(true)}
        className="flex flex-col h-[480px] w-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden font-poppins transition-all duration-300 hover:shadow-2xl group cursor-pointer"
      >
        <div className="flex justify-center pt-8 pb-4 shrink-0">
          <div className="relative">
            <img
              src={guideImagem}
              alt={guide.name}
              className="w-36 h-36 object-cover rounded-full transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 px-6 pb-6 text-left">
          <h4 className="text-[20px] font-bold text-[#008080] leading-tight mb-4 min-h-[3rem] line-clamp-2">
            {guide.name}
          </h4>

          <div className="space-y-4 flex-1">
            <div className="text-[15px] leading-relaxed">
              <span className="font-bold text-[#1e293b]">Segmento: </span>
              <span className="text-gray-500 line-clamp-3">
                {segs || "Ecoturismo"}
              </span>
            </div>

            <div className="text-[15px] leading-relaxed">
              <span className="font-bold text-[#1e293b]">Idioma(s): </span>
              <span className="text-gray-500 line-clamp-2">
                {langs || "Português"}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-4 flex justify-end">
            <button className="text-[#008080] font-bold text-[16px] flex items-center gap-1 hover:gap-2 hover:underline cursor-pointer transition-all">
              Ver perfil
              <FaChevronRight size={14} className="mt-0.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}