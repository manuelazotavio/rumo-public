import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import explorecity1 from "../img/explorecity-1.png";
import explorecity2 from "../img/explorecity-2.png";
import explorecity3 from "../img/explorecity-3.png";
import explorecity4 from "../img/explorecity-4.png";
import explorecity5 from "../img/explorecity-5.png";

const ExploreDetails = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  const contentData = {
    aventura: {
      title: "Natureza & Aventura",
      subtitle: "Ecoturismo e emoção",
      image: explorecity1,
      text: "Caraguatatuba é um refúgio para quem busca aventura. O Parque Estadual da Serra do Mar oferece trilhas deslumbrantes pela Mata Atlântica, levando a cachoeiras escondidas e mirantes panorâmicos. Você pode desfrutar de observação de aves, rapel e mountain bike em uma das áreas verdes mais preservadas do Litoral Norte.",
    },
    comercio: {
      title: "Comércio local & Cultura",
      subtitle: "Compras e tradições",
      image: explorecity2,
      text: "Além de sua beleza natural, a cidade possui uma cena comercial vibrante. Dos mercados de artesanato local ao movimentado centro da cidade, os visitantes podem encontrar produtos caiçaras exclusivos, lembranças tradicionais e instalações de compras modernas. É o lugar perfeito para vivenciar o estilo de vida local.",
    },
    gastronomia: {
      title: "Gastronomia local",
      subtitle: "Sabores frescos do mar",
      image: explorecity3,
      text: "A gastronomia em Caraguatatuba está profundamente enraizada em sua herança marítima. Os restaurantes locais especializam-se em frutos do mar frescos, servindo pratos icônicos como caranguejo, caldeiradas de camarão e peixes grelhados. Festivais gastronômicos anuais também celebram os ingredientes regionais.",
    },
    nautico: {
      title: "Experiências náuticas",
      subtitle: "Navegue pelo azul profundo",
      image: explorecity4,
      text: "Com uma marina moderna e condições perfeitas para navegação, o setor náutico é um destaque da região. Os visitantes podem alugar barcos para explorar as ilhas próximas, praticar pesca esportiva ou fazer passeios guiados de escuna. O horizonte marítimo oferece uma perspectiva única da Serra do Mar encontrando o oceano.",
    },
    praias: {
      title: "Praias paradisíacas",
      subtitle: "Sol, areia e águas cristalinas",
      image: explorecity5,
      text: "Das águas calmas da Cocanha às ondas famosas de Martim de Sá, há uma praia para todos os gostos. Caraguatatuba oferece extensas faixas de areia perfeitas para famílias, entusiastas de esportes aquáticos ou aqueles que apenas procuram relaxar sob o sol. Descubra a beleza intocada do nosso litoral.",
    },
  };

  const data = contentData[category];

  if (!data) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center font-poppins text-[#383838]">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <button 
          onClick={() => navigate("/")}
          className="mt-4 text-[#008080] font-semibold hover:underline"
        >
          Retornar ao ínicio
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white font-poppins pb-20">
      <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
          style={{ backgroundImage: `url(${data.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        

        <div className="absolute bottom-12 left-0 w-full px-5 md:px-20">
          <span className="text-white/80 uppercase tracking-[4px] text-xs md:text-sm font-bold bg-[#008080]/20 backdrop-blur-sm px-4 py-1 rounded-full">
            {data.subtitle}
          </span>
          <h1 className="text-white text-4xl md:text-7xl font-bold mt-4 tracking-tight">
            {data.title}
          </h1>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 mt-16">

        <p className="text-xl md:text-2xl text-[#383838] leading-relaxed font-medium mb-10">
          Explore o melhor de Caraguatatuba através dos nossos roteiros especializados e dicas locais.
        </p>

        <div className="text-base md:text-lg text-gray-600 leading-[2] space-y-6 text-justify">
          {data.text}
        </div>

        <div className="mt-24 p-8 md:p-12 bg-[#008080]/5 rounded-[40px] border border-[#008080]/10 text-center">
          <h3 className="text-3xl font-bold text-[#383838] mb-4">
            Pronto para explorar? 
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Planeje a sua viagem perfeita com as melhores atrações e guias personalizados.
          </p>
          <button 
            onClick={() => navigate("/")}
            className="bg-[#008080] text-white cursor-pointer px-12 py-4 rounded-2xl font-bold  hover:scale-105 active:scale-95 transition-all"
          >
            Criar roteiro
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExploreDetails;