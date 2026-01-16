import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapSigns, faHouse } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";

export default function NaoEncontrado() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-5 bg-white w-full font-poppins">
      <style>
        {`
          @keyframes bounce404 {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
          }
          .animate-bounce-404 {
            animation: bounce404 2s infinite;
          }
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in-scale {
            animation: fadeInScale 0.5s ease-out;
          }
        `}
      </style>

      <div className="text-center bg-white py-10 px-8 md:py-[60px] md:px-10 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] max-w-[600px] w-full border border-gray-100 relative overflow-hidden animate-fade-in-scale">
        <div className="relative h-[180px] flex items-center justify-center mb-5">
          <h1 className="text-[7rem] md:text-[10rem] font-black text-slate-50 m-0 leading-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            404
          </h1>
          <div className="z-[1] bg-white p-2.5 rounded-full">
            <FontAwesomeIcon 
              icon={faMapSigns} 
              className="text-4xl md:text-[4rem] text-[#008080] animate-bounce-404" 
            />
          </div>
        </div>

        <h3 className="text-2xl md:text-[1.8rem] font-bold text-[#1e293b] mb-4 relative z-[1]">
          Ops! Você perdeu o Rumo?
        </h3>

        <p className="text-base md:text-[1.1rem] text-[#64748b] leading-relaxed mb-10 relative z-[1]">
          A página que você está tentando acessar não existe ou foi movida.
          <br /><br />
          Não se preocupe, vamos te ajudar a encontrar o caminho de volta.
        </p>

        <div className="flex justify-center gap-4 flex-wrap relative z-[1] max-[600px]:flex-col">
          <Button
            title="Ir para o Início"
            icon="faHouse"
            onClick={() => navigate("/")}
            variant="primary"
            className="max-[600px]:w-full"
          />
        </div>
      </div>
    </div>
  );
}