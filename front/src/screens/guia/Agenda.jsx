import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import ptBR from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Swal from "../../helpers/swalConfig.js";
import Auth from "../../helpers/ProtectRoute.js";
import ServerAuthGuia from "../../helpers/ProtectServerRouteGuia.js";
import useUserLoggedStore from "../../stores/userLoggedStore";
import Loading from "../../components/Loading.jsx";
import Button from "../../components/Button.jsx";
import API_URL from "../../config";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Agenda() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const guiaId = useUserLoggedStore((state) => state.guiaId);

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        setLoading(true);

        const resPasseios = await fetch(`${API_URL}/passeios/agendados/${guiaId}`);
        const data = await resPasseios.json();
        
        if (!resPasseios.ok) throw new Error(data.error || "Erro ao buscar passeio");

        const passeiosFormatados = data.data.map((passeio) => {
          let startString = passeio.startDate;
          let endString = passeio.endDate;

          if (typeof startString === "string" && startString.endsWith("Z")) startString = startString.slice(0, -1);
          if (typeof endString === "string" && endString.endsWith("Z")) endString = endString.slice(0, -1);

          return {
            ...passeio,
            title: passeio.name,
            start: new Date(startString),
            end: new Date(endString),
            type: "passeio",
          };
        });

        const mockEventosCidade = [
          // {
          //   id: 101,
          //   title: "Festival de Jazz da Cidade",
          //   start: new Date(2025, 11, 20, 18, 0),
          //   end: new Date(2025, 11, 20, 22, 0),
          //   type: "evento_cidade",
          //   desc: "Evento gratuito no parque central",
          // },
        ];

        setEvents([...passeiosFormatados, ...mockEventosCidade]);
      } catch (error) {
        console.error(error);
        Swal.fire("Erro", "Não foi possível carregar a agenda.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAgenda();
  }, [guiaId]);

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad";
    if (event.type === "passeio") backgroundColor = "#008080";
    else if (event.type === "evento_cidade") backgroundColor = "#e67e22";
    else if (event.type === "google") backgroundColor = "#db4437";

    return {
      className: "rounded-md border-none px-2 py-1 shadow-sm transition-opacity hover:opacity-90",
      style: { backgroundColor },
    };
  };

  const handleSelectEvent = (event) => {
    Swal.fire({
      title: event.title,
      html: `
        <div class="text-left font-poppins space-y-2 mt-4">
          <p><strong>Início:</strong> ${format(event.start, "dd/MM/yyyy HH:mm")}</p>
          <p><strong>Fim:</strong> ${format(event.end, "dd/MM/yyyy HH:mm")}</p>
          <p class="text-gray-600 italic mt-4 border-t pt-2">${event.desc || "Sem descrição adicional."}</p>
        </div>
      `,
      icon: event.type === "passeio" ? "info" : "question",
      confirmButtonColor: "#008080",
    });
  };

  const handleGoogleSync = () => {
    Swal.fire(
      "Integração Google",
      "Iniciando sincronização com o Google Calendar...",
      "info"
    );
  };

  if (loading) return <Loading />;

  return (
    <Auth>
      <ServerAuthGuia>
        <div className="w-full max-w-[1200px] mx-auto my-8 p-6 md:p-8 bg-white rounded-2xl shadow-xl shadow-black/5 font-poppins animate-in fade-in duration-500">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-[#333] mb-2">Agenda do Guia</h2>
              <p className="text-gray-500 text-sm">Gerencie seus passeios e visualize eventos locais.</p>
            </div>

            {/* <Button
              title="Sincronizar Google"
              onClick={handleGoogleSync}
              className="bg-[#db4437] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-all"
            /> */}
          </header>

          <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center text-sm font-bold text-[#383838]">
              <span className="w-3 h-3 bg-[#008080] rounded-full mr-2 shadow-sm"></span>
              Meus Passeios
            </div>
            <div className="flex items-center text-sm font-bold text-[#383838]">
              <span className="w-3 h-3 bg-[#e67e22] rounded-full mr-2 shadow-sm"></span>
              Eventos da Cidade
            </div>
          </div>

          <div className="h-[600px] bg-gray-50 rounded-2xl p-2 border border-gray-100">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              className="font-poppins text-sm md:text-base"
              messages={{
                next: "Próximo",
                previous: "Anterior",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "Não há eventos neste período.",
              }}
              culture="pt-BR"
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              views={["month", "week", "day", "agenda"]}
              defaultView="month"
            />
          </div>
        </div>
      </ServerAuthGuia>
    </Auth>
  );
}