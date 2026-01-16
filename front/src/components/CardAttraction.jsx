import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import alecrim from "../img/alecrim.png";
import { toast } from "sonner";
import { createPortal } from "react-dom";
import estrela from "../img/estrela.png";
import { faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import ModalRoteiro from "./ModalRoteiro";
import ClaimEmpresaModal from "./ClaimEmpresaModal";
import useUserLoggedStore from "../stores/userLoggedStore";
import API_URL from "../config";

export default function CardAttraction({ atracao }) {
  const [showModal, setShowModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const imgRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [adicionada, setAdicionada] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const idUser = useUserLoggedStore((state) => state.id);
  const navigate = useNavigate();

  const handleAddRoteiro = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      if (!idUser) {
        localStorage.setItem("atracaoPendente", JSON.stringify(atracao));
        window.scrollTo(0, 0);
        navigate("/login-user");
        return;
      }

      const response = await fetch(`${API_URL}/roteiro/recente/${idUser}`);
      const data = await response.json();
      const roteiro = data.roteiro;

      if (!roteiro) {
        setShowModal(true);
        return;
      }

      toast.promise(adicionarRoteiroRecente(roteiro.id), {
        loading: "Adicionando...",
        success: () => (
          <div className="flex justify-between items-center w-full gap-[15px] font-poppins">
            <div className="flex-1 leading-[1.4] text-[16px]">
              Adicionado ao roteiro <strong>{roteiro.name}</strong>
            </div>
            <button
              className="bg-[#e0e0e0] border border-[#ccc] py-2 px-4 text-[14px] font-semibold cursor-pointer text-[#333] hover:bg-[#d1d1d1] transition-colors"
              onClick={() => setShowModal(true)}
            >
              Alterar
            </button>
          </div>
        ),
        error: "Erro ao adicionar.",
      });

      setAdicionada(true);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const verificaJaAdicionada = async () => {
    try {
      const response = await fetch(`${API_URL}/roteiro/exists/${idUser}/${atracao.id}`);
      const data = await response.json();
      setAdicionada(!!data.adicionada);
    } catch {}
  };

  async function adicionarRoteiroRecente(roteiroId) {
    const response = await fetch(`${API_URL}/roteiro/vinculaAtracao/${roteiroId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ atracaoId: atracao.id }),
    });
    return response.json();
  }

  useEffect(() => {
    setLoaded(false);
    if (imgRef.current && imgRef.current.complete) setLoaded(true);
    verificaJaAdicionada();
  }, [atracao.id]);

  const imagemCapa = atracao.imagens?.length > 0 ? atracao.imagens[0].url : alecrim;
  const dataStar = atracao.googleRating || 0;

  return (
    <div className="bg-white shadow-md border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg font-poppins h-full">
      {showModal && createPortal(<ModalRoteiro onClose={() => setShowModal(false)} atracao={atracao} />, document.body)}

      <Link to={`/atracao/${atracao.id}`} className="no-underline text-inherit flex flex-col flex-grow">
       
        <div className="relative w-full h-62 bg-gray-100 overflow-hidden">
          {!loaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          )}
          <img
            ref={imgRef}
            src={imagemCapa}
            alt={atracao.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
          />
        </div>

       
        <div className="p-4 flex flex-col gap-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-[18px] font-semibold text-[#383838] leading-tight line-clamp-2">
              {atracao.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <img src={estrela} alt="Rating" className="w-7 h-7" />
              <span className="font-medium text-gray-700 text-md">{dataStar}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-2">
            {atracao.subCategorias?.map((cat) => (
              <span key={cat.id} className="text-gray-500 text-[16px]">
                {cat.subCategoria.name}
              </span>
            ))}
          </div>
        </div>
      </Link>

    
      <div className="p-1 pt-0 mt-auto">
        <button
          onClick={handleAddRoteiro}
          disabled={loading || adicionada}
          className="w-full flex items-center cursor-pointer justify-center gap-2 py-3 text-[#008080] font-semibold text-[16px] transition-colors hover:bg-teal-50 rounded-md"
        >
          {loading ? (
            "Adicionando..."
          ) : (
            <>
              <FontAwesomeIcon icon={adicionada ? faCheck : faPlus} />
              <span>{adicionada ? "Atração salva" : "Adicionar ao roteiro"}</span>
            </>
          )}
        </button>
      </div>

      {showClaimModal && (
        <ClaimEmpresaModal
          atracao={atracao}
          isOpen={showClaimModal}
          onClose={() => setShowClaimModal(false)}
        />
      )}
    </div>
  );
}