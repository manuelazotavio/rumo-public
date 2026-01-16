import React, { useEffect, useState, cloneElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Header from "../components/Header";
import Title from "../components/Title";
import Footer from "../components/Footer";
import API_URL from "../config";
import fixedBG from "../img/fixed-bg.png";

const DetailsGuide = ({ children }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guia, setGuia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/guias/${id}`);
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: Guia não encontrado`);
        }

        const data = await response.json();
        setGuia(data.guia);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGuide();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-poppins bg-white">
        <div className="animate-pulse text-[#008080] text-xl font-medium">
          Carregando detalhes...
        </div>
      </div>
    );
  }

  if (error || !guia) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-poppins bg-white p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {error ? "Erro ao carregar guia" : "Guia não encontrado"}
        </h2>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 bg-[#008080] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#006666] transition-all"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full font-poppins">
      <div className="relative h-[220px] md:h-[280px] w-full overflow-hidden flex flex-col">
        <img 
          src={fixedBG} 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ zIndex: 0 }} 
          alt="Background" 
        />
        
        <div className="absolute inset-0 bg-black/10" style={{ zIndex: 1 }}></div>

        <div className="relative" style={{ zIndex: 30 }}>
          <Header className="!bg-transparent" />
        </div>

        <div className="absolute bottom-8 left-10 md:left-32 w-full z-20" style={{ zIndex: 20 }}>
          <Title className="!text-white !m-0 !text-4xl md:!text-6xl !text-left drop-shadow-md">
            {guia.name}
          </Title>
        </div>
      </div>

      <main className="flex-1 relative bg-white z-40">
        {children && cloneElement(children, { guia })}
      </main>

      <Footer />
    </div>
  );
};

export default DetailsGuide;