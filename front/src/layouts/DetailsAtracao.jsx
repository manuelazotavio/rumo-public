import React, { useEffect, useState, cloneElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Header from "../components/Header";
import Title from "../components/Title";
import Footer from "../components/Footer";
import API_URL from "../config";
import fixedBG from "../img/fixed-bg.png";



//REMOVER
const mockAtracao = {
  id: 3,
  name: "Ilha do Tamanduá",
  description:
    "Localizada na divisa entre as cidades de Caraguatatuba e Ubatuba, a Ilha do Tamanduá, maior Ilha de Caraguatatuba, é ainda um local pouco conhecido. Uma ilha de praias tranquilas, areia fina branca e água cristalina. Saindo das praias da Mococa ou da Tabatinga, é possível acessar a Ilha do Tamanduá por travessia marítima, de lancha, bote ou escuna. A Ilha do Tamanduá possui área de 1.133m² e apresenta-se totalmente coberta por vegetação natural. Cinco praias compõem este atrativo: Praia do Fogacho, Praia da Fazenda, Praia do Meio, Praia da Laje e Praia do Sururueiro. A Ilha tem uma trilha de cerca de 20 minutos de caminhada, através da costeira, que liga a Praia do Meio à Praia da Laje e põe o visitante em contato com a natureza intocada do Lugar. A Grande variedade de fauna e flora marinhas, os diversos parcéis e rochas submersas e as águas claras e tranquilas, tornam a Ilha do Tamanduá um destino muito procurado por mergulhadores e pescadores. Por ser um local de natureza mais rústica, apresenta pouca infraestrutura. Portanto, o visitante tem que se precaver levando água, lanches e repelente para insetos. É importante também levar sacos plásticos para carregar de volta todo lixo produzido durante o passeio.",
  preco: "20.00",
  referencia: "em frente o shopping" ,
  address: "Av. Dr. Arthur Costa Filho",
  bairro: "Massaguaçu",
  cep: "11680-000",
  phone: "(12) 3897-1234",
  email: "contato@praiadotamandua.com",
  instagram: "@praiadotamandua",
  website: "https://exemplo.com"
};
//REMOVER

const Details = ({ children }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [atracao, setAtracao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAtracao = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/atracoes/${id}`);

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: Atração não encontrada`);
        }

        const data = await response.json();
        setAtracao(data.atracao);
      } catch (err) {
        // setError(err.message); ← ← DESCOMENTAR!!
        // 
        // 
        // REMOVER
        console.warn("Backend indisponível, usando mock");
        setAtracao(mockAtracao);
        // REMOVER
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAtracao();
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

  if (error || !atracao) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-poppins bg-white p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {error ? "Erro ao carregar atração" : "Atração não encontrada"}
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
            {atracao.name}
          </Title>
        </div>
      </div>

      <main className="flex-1 relative bg-white z-40">
        {children && cloneElement(children, { atracao })}
      </main>

      <Footer />
    </div>
  );
};

export default Details;