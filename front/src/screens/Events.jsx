import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FilterContainer from "../components/FilterContainer.jsx";
import EventSection from "../components/EventSection.jsx";
import API_URL from "../config";

export default function Events() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [filters, setFilters] = useState(state?.filters || {});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => {
          if (v === true) params.append(k, "true");
        });
        
        const response = await fetch(`${API_URL}/event/public?${params.toString()}`);
        const result = await response.json();
        setEvents(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col w-full font-poppins text-[#383838] bg-white overflow-x-hidden">
      {error && <p className="text-red-600 p-4 text-center bg-red-50 font-bold">Erro ao carregar agenda: {error}</p>}
      
      <div className="flex flex-col md:flex-row gap-0 md:gap-12 py-0 md:py-10 px-5 md:px-16 lg:px-24 mx-auto items-start max-w-[1800px] w-full">

        <main className="flex-1 min-w-0 w-full z-10">
          
        
          {(loading || events.length > 0) && (
            <EventSection 
              title="Eventos em destaque" 
              events={events} 
              loading={loading} 
              navigate={navigate} 
            />
          )}

         
          {!loading && events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-[40px] border border-gray-100 border-dashed">
              <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-[#383838] mb-2">Agenda vazia por enquanto</h3>
              <p className="text-gray-500 max-w-md mb-8 px-4">
                Não encontramos eventos com os filtros selecionados ou ainda não há nada agendado.
              </p>
              
              <button 
                onClick={() => navigate("/cadastrar-evento")}
                className="bg-[#008080] text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest hover:bg-[#006666] hover:scale-105 transition-all cursor-pointer"
              >
                SEJA O PRIMEIRO A SUGERIR
              </button>
            </div>
          )}

         
          {!loading && events.length > 0 && (
            <div className="mt-12 p-8 bg-gray-50 rounded-[40px] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-black text-[#383838]">Viu algum evento legal?</h4>
                <p className="text-gray-500 text-sm">Ajude a comunidade sugerindo novos eventos em Caraguatatuba.</p>
              </div>
              <button 
                onClick={() => navigate("/cadastrar-evento")}
                className="bg-[#008080] text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest hover:scale-105 transition-all cursor-pointer"
              >
                SUGERIR EVENTO
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}