import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 
import Auth from "../helpers/ProtectRoute.js";
import Loading from "../components/Loading.jsx";
import API_URL from "../config.js";

import { FaMapMarkerAlt, FaCalendarAlt, FaInstagram, FaTicketAlt, FaArrowLeft } from "react-icons/fa";

import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUserLoggedStore from "../stores/userLoggedStore.js";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  const viewerId = useUserLoggedStore((state) => state.id);

  useEffect(() => {

    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/event/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Erro ao buscar evento");
        
        setEvent(data.event);

        const resImage = await fetch(`${API_URL}/event/${id}/images`);
        const dataImage = await resImage.json();
      
        if (dataImage && dataImage.length > 0) {
            setImage(dataImage[0].url);
        }

        fetchReviews();

      } catch (err) {
        Swal.fire("Erro", err.message, "error");
        navigate("/eventos");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/avaliacao/evento/${id}`);
      const data = await response.json();
      if (response.ok) setReviews(data);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
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
        confirmButtonText: "Fazer login",
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
        },
        body: JSON.stringify({
          nota: rating,
          comentario: comment,
          eventId: id,
          userId: viewerId
        }),
      });

      const data = await response.json();

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
        throw new Error(data.error || 'Erro na requisição');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Erro ao avaliar",
        text: error.message || "Ocorreu um erro ao tentar enviar sua avaliação.",
        confirmButtonColor: "#008080",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) return <Loading />;
  if (!event) return null;

  return (
    <Auth>
      <div className="w-full max-w-[1100px] mx-auto my-3 p-6 md:p-14 rounded-[40px] font-poppins animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center cursor-pointer text-gray-500 hover:text-[#008080] transition-colors mb-8 font-bold text-sm uppercase tracking-widest"
        >
          <FaArrowLeft className="mr-2" /> Voltar
        </button>

        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-[#383838] mt-6 tracking-tighter leading-tight">
            {event.name}
          </h1>
          {event.Atracao && (
            <div className="flex items-center justify-center mt-4 text-gray-500 font-medium">
              <FaMapMarkerAlt className="text-[#008080] mr-2" />
              <span>Em: {event.Atracao.name}</span>
            </div>
          )}
        </header>

        {image ? (
          <div className="mb-12 rounded-[32px] overflow-hidden shadow-xl shadow-[#008080]/10">
            <img 
              src={image} 
              alt={event.name} 
              className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        ) : (
          <div className="mb-12 h-64 bg-gray-100 rounded-[32px] flex items-center justify-center border-2 border-dashed border-gray-200">
            <span className="text-gray-400 font-bold uppercase tracking-widest">Sem imagem disponível</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#008080] text-white rounded-2xl">
                <FaCalendarAlt size={20} />
              </div>
              <div>
                <h3 className="text-[#383838] font-black text-lg mb-1">Quando?</h3>
                <p className="text-gray-600 font-medium text-sm">
                  Início: {formatDate(event.startDate)}
                </p>
                {event.endDate && (
                  <p className="text-gray-600 font-medium text-sm mt-1">
                    Fim: {formatDate(event.endDate)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#008080] text-white rounded-2xl">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <h3 className="text-[#383838] font-black text-lg mb-1">Onde?</h3>
                <p className="text-gray-600 font-medium text-sm">
                  {event.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-12">
          <h2 className="text-4xl font-semibold mb-4 text-[#333]">
            Sobre o evento
          </h2>
          <div className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
            {event.description}
          </div>
        </div>

        {(event.links?.instagram || event.links?.tickets) && (
          <div className="flex flex-col md:flex-row gap-4 pt-8 border-t border-gray-100 mb-20">
            {event.links?.instagram && (
              <a 
                href={event.links.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all hover:scale-[1.02]"
              >
                <FaInstagram size={24} />
                <span>Ver no Instagram</span>
              </a>
            )}
            
            {event.links?.tickets && (
              <a 
                href={event.links.tickets} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 py-4 px-6 bg-[#008080] text-white rounded-2xl font-bold hover:bg-[#006666] transition-all hover:scale-[1.02]"
              >
                <FaTicketAlt size={20} />
                <span>Garantir ingressos</span>
              </a>
            )}
          </div>
        )}

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
              <textarea 
                className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#008080] transition-colors resize-none h-32 mb-4" 
                placeholder="Conte sua experiência..." 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
              />
              <button 
                type="submit" 
                disabled={isSubmittingReview} 
                className="bg-[#008080] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#006666] transition-all disabled:bg-gray-400 cursor-pointer"
              >
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
              <p className="text-gray-500 font-bold mb-4">Você precisa estar logado para avaliar este evento.</p>
              <button className="bg-[#008080] text-white px-8 py-2.5 rounded-lg font-bold group-hover:scale-105 transition-transform">
                Fazer login
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
    </Auth>
  );
}