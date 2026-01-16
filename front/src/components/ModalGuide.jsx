import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { faClose, faStar as faStarSolid, faUser, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from 'sweetalert2'; 

import guidePlaceholder from "../img/guide-user.png";
import whatsapp from "../img/whatsapp.png";
import placeholder from "../img/imgplaceholder.png";
import API_URL from "../config";
import useUserLoggedStore from "../stores/userLoggedStore";

export default function ModalGuide({ guide, onClose }) {
  const [guideImagem, setGuideImagem] = useState(guidePlaceholder);
  const [loadingTourId, setLoadingTourId] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();
  const viewerId = useUserLoggedStore((state) => state.id);
  const startTime = useRef(Date.now());
  const currentGuideId = useRef(guide?.id);

  const galleryImages = guide?.imagens || [];
  const mainImage = galleryImages[0]?.url || placeholder;
  const secondImage = galleryImages[1]?.url || placeholder;
  const thirdImage = galleryImages[2]?.url || placeholder;
  const remainingCount = galleryImages.length > 3 ? galleryImages.length - 3 : 0;

  const dataValidade = guide?.validadeCadastur
    ? new Date(guide.validadeCadastur).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      })
    : "Não informado";

  useEffect(() => {
    currentGuideId.current = guide?.id;
    if (guide?.id) fetchReviews();
  }, [guide]);

  useEffect(() => {
    if (guide?.image && guide.image.trim() !== "") {
      setGuideImagem(guide.image);
    } else {
      setGuideImagem(guidePlaceholder);
    }
  }, [guide]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/avaliacao/guia/${guide.id}`);
      const data = await response.json();
      if (response.ok) setReviews(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClaimProfile = async () => {
    if (!guide.email) {
      Swal.fire({
        icon: 'error',
        title: 'E-mail indisponível',
        text: 'Este perfil não possui um e-mail cadastrado para recuperação automática.',
        confirmButtonColor: "#008080"
      });
      return;
    }

    const [user, domain] = guide.email.split('@');
    const maskedEmail = `${user.substring(0, 2)}***@${domain}`;

    const result = await Swal.fire({
      title: 'Este perfil é você?',
      html: `Para ativar seu cadastro, enviaremos um link de confirmação para o e-mail: <br/><b>${maskedEmail}</b>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: "#008080",
      cancelButtonColor: "#d33",
      confirmButtonText: 'Sim, enviar e-mail',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        setIsClaiming(true);
        const response = await fetch(`${API_URL}/guide/verify`, { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cadastur: guide.certificate }) 
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'E-mail enviado!',
            text: 'Verifique sua caixa de entrada para ativar seu acesso.',
            confirmButtonColor: "#008080"
          });
        } else {
          throw new Error('Erro na API');
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao enviar',
          text: 'Não foi possível enviar o e-mail no momento.',
          confirmButtonColor: "#008080"
        });
      } finally {
        setIsClaiming(false);
      }
    }
  };

  const handleBuyTour = async (passeio) => {
    try {
      setLoadingTourId(passeio.id);
      const response = await fetch(`${API_URL}/financeiro/pagamento/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          passeioId: passeio.id,
          guiaId: guide.id,
          valor: passeio.price,
          descricao: passeio.name || passeio.nome,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível iniciar o checkout.',
        confirmButtonColor: "#008080"
      });
    } finally {
      setLoadingTourId(null);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!viewerId) {
      Swal.fire({
        icon: "warning",
        title: "Você não está logado",
        text: "É necessário fazer login para enviar uma avaliação.",
        showCancelButton: true,
        confirmButtonColor: "#008080",
        cancelButtonColor: "#d33",
        confirmButtonText: "Fazer Login",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login-user");
        }
      });
      return;
    }

    if (rating === 0) {
      Swal.fire({
        icon: "info",
        title: "Selecione uma nota",
        text: "Por favor, clique nas estrelas (1 a 5) para dar sua nota.",
        confirmButtonColor: "#008080",
      });
      return;
    }

    try {
      setIsSubmittingReview(true);
      const response = await fetch(`${API_URL}/avaliacao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          nota: rating,
          comentario: comment,
          guiaId: guide.id,
          userId: viewerId,
        }),
      });

      if (response.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Avaliação enviada!',
            text: 'Obrigado por compartilhar sua experiência.',
            confirmButtonColor: "#008080",
            timer: 2000
        });
        
        setRating(0);
        setComment("");
        fetchReviews();
      } else {
        throw new Error('Erro na requisição');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Erro ao avaliar",
        text: "Ocorreu um erro ao tentar enviar sua avaliação. Tente novamente.",
        confirmButtonColor: "#008080",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    startTime.current = Date.now();
    return () => {
      const idParaSalvar = currentGuideId.current;
      if (!idParaSalvar) return;
      const endTime = Date.now();
      const timeSpentMs = endTime - startTime.current;
      const timeSpentSeconds = Math.round(timeSpentMs / 1000);
      if (timeSpentSeconds >= 1) {
        fetch(`${API_URL}/guide/metrics/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "guia",
            id: Number(idParaSalvar),
            timeSpent: timeSpentSeconds,
            viewerId: viewerId || null,
          }),
          keepalive: true,
        }).catch((err) => console.error(err));
      }
    };
  }, [guide?.id, viewerId]);

  const getPasseioImage = (passeio) => {
    if (passeio?.imagens && passeio.imagens.length > 0) {
      return passeio.imagens[0].url;
    }
    return placeholder;
  };

  const openWhatsapp = (e) => {
    e.stopPropagation();
    if (!guide?.number) return;
    const cleanNumber = guide.number.replace(/\D/g, "");
    const fullNumber = cleanNumber.length >= 10 && cleanNumber.length <= 11 ? `55${cleanNumber}` : cleanNumber;
    window.open(`https://wa.me/${fullNumber}`, "_blank");
  };

  if (!guide) return null;

  return (
    <>
      <style>{`
        .swal2-container {
          z-index: 10000 !important;
        }
      `}</style>

      <div onClick={onClose} className="fixed inset-0 bg-black/40 z-[9998]"></div>

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[1100px] max-h-[90vh] bg-white rounded-lg shadow-2xl z-[9999] p-8 md:p-14 overflow-y-auto font-poppins text-[#4a4a4a]">
        <button className="absolute cursor-pointer top-6 right-8 text-2xl text-gray-400 hover:text-gray-600 transition-colors" onClick={onClose}>
          <FontAwesomeIcon icon={faClose} />
        </button>

        <div className="flex flex-col md:flex-row gap-10 mb-16 relative">
          <div className="relative shrink-0 flex flex-col items-center">
            <div className="relative">
              <img className="rounded-full w-[220px] h-[220px] object-cover bg-gray-100" src={guideImagem} alt="Perfil" />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-[#008080] text-4xl font-bold mb-6">{guide.name}</h2>
            <div className="space-y-3 text-[15px] leading-relaxed">
              <p><span className="font-bold">Segmento(s):</span> <span className="text-gray-500">{guide.segmentos?.map((item) => item.segmento?.name || "").join(", ") || "Não informado"}</span></p>
              <p><span className="font-bold">Idioma(s):</span> <span className="text-gray-500">{guide.languages?.split("|").join(", ") || "Não informado"}</span></p>
              <p><span className="font-bold">Número do Cadastur:</span> <span className="text-gray-500">{guide.certificate}</span></p>
              <p><span className="font-bold">Validade do Cadastur:</span> <span className="text-gray-500">{dataValidade}</span></p>
              <p><span className="font-bold">Telefone:</span> <span className="text-gray-500">{guide.number}</span></p>
              <p><span className="font-bold">E-mail:</span> <span className="text-gray-500">{guide.email}</span></p>
              <p><span className="font-bold">Website:</span> <span className="text-gray-500">{guide.website}</span></p>
            </div>
          </div>

          <div className="md:text-left flex flex-col justify-items-start md:items-start">
            <h4 className="text-[#008080] font-semibold text-xl mb-3">Entre em contato</h4>
            <img className="w-14 h-14 cursor-pointer hover:scale-105 transition-transform" src={whatsapp} alt="Whatsapp" onClick={openWhatsapp} />
            
            {guide.email && (
              <button 
                onClick={handleClaimProfile}
                disabled={isClaiming}
                className="mt-6 group flex items-center gap-2 text-md text-gray-600 hover:text-[#008080] transition-colors bg-transparent border-0 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#008080]/10 transition-colors">
                  <FontAwesomeIcon icon={faUser} className="text-xs" />
                </div>
                {isClaiming ? "Enviando..." : "Sou eu! Reivindicar perfil"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-medium text-[#383838]">Galeria de fotos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
              <img src={mainImage} className="w-full h-full object-cover" alt="Principal" />
            </div>
            <div className="grid grid-rows-2 gap-3 h-full">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                <img src={secondImage} className="w-full h-full object-cover" alt="Foto 1" />
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm cursor-pointer group">
                <img src={thirdImage} className="w-full h-full object-cover" alt="Foto 2" />
                {remainingCount > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors group-hover:bg-black/70">
                    <span className="text-white font-bold text-xl">+{remainingCount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-4xl font-semibold mb-4 text-[#333]">Passeios recentes</h2>
          <hr className="border-gray-100 mb-8" />
          {guide.passeios?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {guide.passeios.map((passeio) => (
                <div key={passeio.id} className="bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col rounded-xl">
                  <div className="h-48 bg-gray-100">
                    <img className="w-full h-full object-cover" src={getPasseioImage(passeio)} alt={passeio.name} onError={(e) => { e.target.src = placeholder; }} />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-3 line-clamp-2">{passeio.name || passeio.nome}</h3>
                    <div className="flex justify-between items-center mb-4">
                      {passeio.price && <span className="font-bold text-[#008080] text-xl">R$ {Number(passeio.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>}
                      {passeio.duration && <span className="text-sm text-gray-500">{passeio.duration} min</span>}
                    </div>
                    <button onClick={() => handleBuyTour(passeio)} disabled={loadingTourId === passeio.id} className={`w-full py-3 rounded-lg font-bold text-white transition-all ${loadingTourId === passeio.id ? "bg-gray-400" : "bg-[#008080] hover:bg-[#006666] active:scale-95 cursor-pointer"}`}>
                      {loadingTourId === passeio.id ? "Processando..." : "Reservar agora"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Nenhum passeio disponível.</p>
          )}
        </div>

        <div className="mt-20 pb-10">
          <h2 className="text-4xl font-semibold mb-4 text-[#333]">Avaliações</h2>
          <hr className="border-gray-100 mb-8" />
          {viewerId ? (
            <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-2xl mb-12">
              <h4 className="font-bold mb-4">Deixe sua avaliação</h4>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={(hoverRating || rating) >= star ? faStarSolid : faStarRegular}
                    className={`text-2xl cursor-pointer transition-colors ${ (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300" }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <textarea className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#008080] transition-colors resize-none h-32 mb-4" placeholder="Conte sua experiência..." value={comment} onChange={(e) => setComment(e.target.value)} />
              <button type="submit" disabled={isSubmittingReview} className="bg-[#008080] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#006666] transition-all disabled:bg-gray-400 cursor-pointer">
                {isSubmittingReview ? "Enviando..." : "Publicar comentário"}
              </button>
            </form>
          ) : (
            <div 
              onClick={() => navigate("/login-user")}
              className="bg-gray-50 p-8 rounded-2xl mb-12 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#008080] hover:bg-gray-100 transition-all group"
            >
              <div className="flex gap-1 mb-4 opacity-30">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon key={star} icon={faStarRegular} className="text-2xl text-gray-400" />
                ))}
              </div>
              <p className="text-gray-500 font-bold mb-4">Você precisa estar logado para avaliar este guia.</p>
              <button className="bg-[#008080] text-white px-8 py-2.5 rounded-lg font-bold group-hover:scale-105 transition-transform">
                Fazer Login agora
              </button>
            </div>
          )}
          <div className="space-y-6">
            {reviews.length > 0 ? reviews.map((rev) => (
              <div key={rev.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800">{rev.user?.name}</span>
                  <div className="flex gap-0.5 text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => <FontAwesomeIcon key={i} icon={i < rev.nota ? faStarSolid : faStarRegular} />)}
                  </div>
                </div>
                <p className="text-gray-500 text-[15px] italic">"{rev.comentario}"</p>
                <span className="text-[12px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString("pt-BR")}</span>
              </div>
            )) : <p className="text-gray-400">Sem avaliações ainda.</p>}
          </div>
        </div>
      </div>
    </>
  );
}