import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../../helpers/ProtectRoute";
import API_URL from "../../config";
import useUserLoggedStore from "../../stores/userLoggedStore";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faUser,
  faClock,
  faArrowTrendUp,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import ServerAuthGuia from "../../helpers/ProtectServerRouteGuia";

const Visualizacoes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    isPremium: false,
    totalVisualizacoes: 0,
    totalCliques: 0,
    uniqueVisitors: 0,
    TempoMedioSegundos: 0,
    viewsHistory: [],
    recentVisits: [],
  });

  const guiaId = useUserLoggedStore((state) => state.guiaId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_URL}/guide/${guiaId}/metrics/dashboard`
        );
        if (response.ok) {
          const data = await response.json();
          setMetrics(data.data);
        } else {
          setMetrics({
            isPremium: false,
            totalVisualizacoes: 1240,
            uniqueVisitors: 85,
            TempoMedioSegundos: 145,
            viewsHistory: [
              { date: "01/12", count: 12 },
              { date: "02/12", count: 19 },
              { date: "03/12", count: 15 },
              { date: "04/12", count: 25 },
              { date: "05/12", count: 32 },
              { date: "06/12", count: 28 },
              { date: "07/12", count: 45 },
            ],
            recentVisits: [
              { userName: "Ana Clara", date: new Date().toISOString() },
              {
                userName: "Carlos Eduardo",
                date: new Date(Date.now() - 86400000).toISOString(),
              },
            ],
          });
        }
      } catch (err) {
        console.error("Erro ao buscar métricas:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (guiaId) fetchMetrics();
  }, [guiaId]);

  const formatTime = (seconds) => {
    if (!seconds) return "0s";
    const m = Math.floor(seconds / 60);
    return m > 0 ? `${m}m` : `${seconds}s`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 rounded-lg p-3 shadow-xl border-none font-poppins">
          <div className="text-gray-400 text-xs mb-1">{label}</div>
          <div className="text-white font-bold text-sm">{payload[0].value} visitas</div>
        </div>
      );
    }
    return null;
  };

  const DashboardSkeleton = () => (
    <div className="animate-pulse space-y-10">
      <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[140px] bg-gray-100 rounded-2xl"></div>
        ))}
      </div>
      <div className="h-[400px] bg-gray-100 rounded-2xl"></div>
    </div>
  );

  return (
    <Auth>
      <ServerAuthGuia>
        <div className="w-full max-w-[1200px] mx-auto my-10 px-6 mb-[100px] font-poppins text-[#383838]">
          <header className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-[#333] mb-2">Performance</h2>
            <p className="text-gray-500 text-sm font-normal">
              Visão geral do engajamento com seu perfil.
            </p>
          </header>

          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <div className="animate-in fade-in duration-500">
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#008080] hover:shadow-xl hover:shadow-[#008080]/5 flex flex-col justify-between h-[140px]">
                  <span className="text-[11px] font-black text-gray-400    tracking-widest">Visualizações</span>
                  <div className="text-4xl font-black text-[#383838] tracking-tighter leading-none">{metrics.totalVisualizacoes}</div>
                  <div className="text-xs flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">+12%</span>
                    <span className="text-gray-400">vs. mês anterior</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#008080] hover:shadow-xl hover:shadow-[#008080]/5 flex flex-col justify-between h-[140px]">
                  <span className="text-[11px] font-black text-gray-400    tracking-widest">Visitantes Únicos</span>
                  <div className="text-4xl font-black text-[#383838] tracking-tighter leading-none">{metrics.uniqueVisitors}</div>
                  <div className="text-xs text-gray-400 font-medium italic">Alcance real do perfil</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#008080] hover:shadow-xl hover:shadow-[#008080]/5 flex flex-col justify-between h-[140px]">
                  <span className="text-[11px] font-black text-gray-400    tracking-widest">Tempo Médio</span>
                  <div className="text-4xl font-black text-[#383838] tracking-tighter leading-none">
                    {formatTime(metrics.TempoMedioSegundos)}
                  </div>
                  <div className="text-xs text-gray-400 font-medium italic">Retenção de visitantes</div>
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-3xl p-8 mb-12 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-lg font-bold text-[#383838]">Tendência de acesso</h3>
                </div>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.viewsHistory}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#008080" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#008080" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
                        dy={15}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#008080"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {metrics.recentVisits && metrics.recentVisits.length > 0 && (
                <section className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-[#383838] mb-8">Leads recentes</h3>
                  <div className="flex flex-col">
                    {metrics.recentVisits.map((visit, index) => (
                      <div key={index} className="flex items-center justify-between py-5 border-b border-gray-100 last:border-none group">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-gradient-to-br from-[#008080] to-[#1a5f5f] text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg  ">
                            {visit.userName ? visit.userName.charAt(0) : "?"}
                          </div>
                          <div>
                            <p className="font-bold text-[#383838] flex items-center gap-3">
                              {visit.userName || "Visitante Anônimo"}
                              <span className="text-sm font-medium text-gray-400   tracking-tighter">
                                {new Date(visit.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                              </span>
                            </p>

                            {metrics.isPremium ? (
                              <div className="flex gap-4 mt-1">
                                <span className="text-xs font-medium text-gray-500 underline underline-offset-2 decoration-[#008080]/30">
                                  {visit.userEmail || "E-mail indisponível"}
                                </span>
                                <span className="text-xs font-medium text-gray-500">
                                  {visit.userPhone || "Telefone indisponível"}
                                </span>
                              </div>
                            ) : (
                              <div className="mt-2">
                                <button
                                  className="text-[16px] cursor-pointer font-medium  text-[#008080] hover:text-[#1a5f5f] "
                                  onClick={() => navigate("/planos")}
                                >
                                  Liberar contato 
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </ServerAuthGuia>
    </Auth>
  );
};

export default Visualizacoes;