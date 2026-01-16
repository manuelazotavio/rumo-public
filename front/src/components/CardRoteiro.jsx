import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faLanguage,
  faPhone,
  faEnvelope,
  faGlobe,
  faCertificate,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function CardRoteiro({ roteiro: guide }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const segs = guide.segment?.replace(/\|/g, " • ");

  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return null;
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
  };

  const openWhatsApp = () => {
    const whatsappNumber = formatPhoneForWhatsApp(guide.number);
    if (whatsappNumber) {
      const message = encodeURIComponent(
        `Olá ${guide.name}! Vi seu perfil no Rumo e gostaria de saber mais sobre seus serviços de guia turístico.`
      );
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="box-border bg-gradient-to-br from-white/95 to-[#f8fafa]/90 backdrop-blur-md flex flex-col shadow-[0_8px_25px_-3px_rgba(0,0,0,0.12),0_4px_10px_-2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)] transition-all duration-400 p-6 rounded-[16px] relative overflow-hidden min-h-[300px] w-full max-w-[400px] mx-auto font-poppins">
      <h3 className="text-[20px] font-semibold text-[#008080] text-center mb-6 leading-tight tracking-tight">
        {guide.name}
      </h3>

      <div className="flex flex-col gap-4">
        {segs && (
          <div className="flex items-start gap-3 p-3 bg-[#3b82f6]/5 rounded-xl transition-all duration-200">
            <FontAwesomeIcon icon={faLayerGroup} className="w-[18px] h-[18px] mt-1 text-[#008080] flex-shrink-0" />
            <span className="text-[0.95rem] text-[#475569] font-medium leading-[1.4]">
              <strong className="text-[#1e293b] mr-1">Segmento:</strong> {segs}
            </span>
          </div>
        )}

        {guide.languages && (
          <div className="flex items-center gap-3 p-3 bg-[#3b82f6]/5 rounded-xl transition-all duration-200">
            <FontAwesomeIcon icon={faLanguage} className="w-[18px] h-[18px] text-[#008080] flex-shrink-0" />
            <span className="text-[0.95rem] text-[#475569] font-medium leading-[1.4]">
              <strong className="text-[#1e293b] mr-1">Idiomas:</strong> {guide.languages}
            </span>
          </div>
        )}

        {guide.number && (
          <div className="flex items-center gap-3 p-3 bg-[#3b82f6]/5 rounded-xl transition-all duration-200">
            <FontAwesomeIcon icon={faPhone} className="w-[18px] h-[18px] text-[#008080] flex-shrink-0" />
            <span className="text-[0.95rem] text-[#475569] font-medium leading-[1.4]">
              <strong className="text-[#1e293b] mr-1">Celular:</strong> {guide.number}
            </span>
          </div>
        )}

        <div 
          className={`transition-[max-height] duration-500 ease-in-out overflow-hidden flex flex-col gap-4 ${isExpanded ? "max-height-[500px]" : "max-h-0"}`}
        >
          {guide.certificate && (
            <div className="flex items-center gap-3 p-3 bg-[#3b82f6]/5 rounded-xl transition-all duration-200">
              <FontAwesomeIcon icon={faCertificate} className="w-[18px] h-[18px] text-[#008080] flex-shrink-0" />
              <span className="text-[0.95rem] text-[#475569] font-medium leading-[1.4]">
                <strong className="text-[#1e293b] mr-1">Certificado:</strong> {guide.certificate}
              </span>
            </div>
          )}

          {guide.email && (
            <div className="flex items-center gap-3 p-3 bg-[#3b82f6]/5 rounded-xl transition-all duration-200">
              <FontAwesomeIcon icon={faEnvelope} className="w-[18px] h-[18px] text-[#008080] flex-shrink-0" />
              <span className="text-[0.95rem] text-[#475569] font-medium leading-[1.4]">
                <strong className="text-[#1e293b] mr-1">E-mail:</strong> {guide.email}
              </span>
            </div>
          )}

          {guide.website && guide.website.trim() && (
            <div className="flex items-center gap-3 p-3 bg-[#3b82f6]/5 rounded-xl transition-all duration-200">
              <FontAwesomeIcon icon={faGlobe} className="w-[18px] h-[18px] text-[#008080] flex-shrink-0" />
              <span className="text-[0.95rem] text-[#475569] font-medium leading-[1.4]">
                <strong className="text-[#1e293b] mr-1">Website:</strong> {guide.website}
              </span>
            </div>
          )}
        </div>

        <div className="text-center py-2 border-t border-white/20 mt-2">
          <button 
            className="bg-[#008080] text-white border-none rounded-[25px] py-[10px] px-[18px] text-[14px] font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 mx-auto min-w-[160px] shadow-lg hover:bg-[#006666]"
            onClick={toggleExpanded}
          >
            <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
            {isExpanded ? "Menos informações" : "Mais informações"}
          </button>
        </div>

        <div className="flex gap-3 flex-wrap mt-4">
          {guide.id && (
            <button
              className="flex-1 min-w-[calc(50%-6px)] bg-[#1d4ed8] text-white border-none py-3 px-4 rounded-xl font-semibold text-[0.9rem] cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
              onClick={() => navigate(`/setur/cadastro/${guide.id}`)}
            >
              Ver Cadastur
            </button>
          )}

          {guide.number && (
            <button
              className="flex-1 min-w-[calc(50%-6px)] bg-[#1e994b] text-white border-none py-3 px-4 rounded-xl font-semibold text-[0.9rem] cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
              onClick={openWhatsApp}
            >
              WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
}