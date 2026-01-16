import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonDigging, faHouse } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";

export default function EmConstrucao() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-5 w-full font-poppins">
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>
      
      <div className="text-center bg-white py-10 px-8 md:py-[60px] md:px-10 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] max-w-[600px] w-full border border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div className="mb-[30px] relative inline-block">
          <FontAwesomeIcon 
            icon={faPersonDigging} 
            className="text-[5rem] text-[#008080] animate-float" 
          />
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-3/5 h-2.5 bg-[#008080]/10 rounded-full "></div>
        </div>
        
        <h3 className="text-2xl md:text-[2rem] font-bold text-[#1e293b] mb-4">
          Página em Construção
        </h3>
        
        <p className="text-base md:text-[1.1rem] text-[#64748b] leading-relaxed mb-10">
          Estamos preparando algo incrível para você! <br className="hidden md:block" />
          Esta funcionalidade estará disponível em breve.
        </p>

        <div className="flex justify-center gap-4 flex-wrap max-[600px]:flex-col">
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