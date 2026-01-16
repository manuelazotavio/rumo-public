import React, { useState, useEffect } from "react";
import { Pagination } from "../../../components/Pagination";
import { useNavigate } from "react-router-dom";
import Subtitle from "../../../components/Subtitle";
import Loading from "../../../components/Loading";
import Auth from "../../../helpers/ProtectRoute";
import API_URL from "../../../config";
import ButtonForm from "../../../components/ButtonForm.jsx";
import ServerAuthGuia from "../../../helpers/ProtectServerRouteGuia";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function PasseiosPanel() {
  const [passeios, setPasseios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [columns] = useState([
    { id: "name", label: "Nome", visible: true },
    { id: "price", label: "Preço", visible: true },
    { id: "duration", label: "Duração", visible: true },
    { id: "capacity", label: "Capacidade", visible: true },
    { id: "active", label: "Ativo", visible: true },
  ]);

  const navigate = useNavigate();

  const handleRemovePasseio = (id) => async () => {
    if (window.confirm("Tem certeza que deseja remover este passeio?")) {
      try {
        const response = await fetch(`${API_URL}/passeios/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setPasseios((prev) => prev.filter((p) => p.id !== id));
        } else {
          const data = await response.json();
          setError(data.error || "Erro ao remover passeio");
        }
      } catch (err) {
        setError("Erro de conexão com o servidor");
      }
    }
  };

  useEffect(() => {
    const fetchPasseios = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({ page: currentPage, limit: 10 });
        const response = await fetch(
          `${API_URL}/passeios/panel?${params.toString()}`
        );
        const data = await response.json();

        if (response.ok) {
          setPasseios(data.data || []);
          setPaginationInfo(data.pagination || {});
        } else {
          setError(data.error || "Erro ao carregar passeios");
        }
      } catch (err) {
        setError("Erro de conexão com o servidor");
      } finally {
        setLoading(false);
      }
    };
    fetchPasseios();
  }, [currentPage]);

  const renderCellContent = (passeio, columnId) => {
    const value = passeio[columnId];
    if (columnId === "active") {
      return value ? (
        <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-xs">
          Sim
        </span>
      ) : (
        <span className="text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full text-xs">
          Não
        </span>
      );
    }
    if (columnId === "price") return `R$ ${value}`;
    if (columnId === "duration") return `${value} min`;
    return value || "—";
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="p-8 text-center text-red-500 font-bold bg-red-50 rounded-xl m-10 border border-red-100">
        Erro: {error}
      </div>
    );

  return (
    <Auth>
      <ServerAuthGuia>
        <div className="w-full max-w-[1440px] mx-auto p-5 md:p-10 font-poppins mb-12 animate-in fade-in duration-500">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="space-y-1">
              <Subtitle className="text-[#383838] text-3xl font-black">
                Painel de Passeios
              </Subtitle>
              <p className="text-gray-500 text-sm">
                Gerencie suas ofertas e disponibilidade.
              </p>
            </div>
            <ButtonForm
              className="w-full md:w-auto bg-[#008080] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-all"
              title="Adicionar passeio"
              onClick={() => navigate("/guia/add-passeio")}
            />
          </header>

          {passeios.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center text-gray-400 font-medium">
              Nenhum passeio cadastrado até o momento.
            </div>
          ) : (
            <div className="w-full overflow-hidden bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100">
              <table className="w-full border-collapse">
                <thead className="hidden md:table-header-group bg-gray-50 border-b border-gray-100">
                  <tr>
                    {columns.map((c) => (
                      <th
                        key={c.id}
                        className="p-5 text-left text-xs font-black tracking-widest text-gray-400"
                      >
                        {c.label}
                      </th>
                    ))}
                    <th className="p-5 text-center text-xs font-black tracking-widest text-gray-400">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group">
                  {passeios.map((p) => (
                    <tr
                      key={p.id}
                      className="block md:table-row border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-none"
                    >
                      {columns.map((c) => (
                        <td
                          key={c.id}
                          className="flex justify-between items-center p-4 md:table-cell md:p-5 text-[#383838] text-sm md:text-base font-medium"
                        >
                          <span className="md:hidden text-[10px] font-black tracking-tighter text-gray-400">
                            {c.label}
                          </span>
                          {renderCellContent(p, c.id)}
                        </td>
                      ))}
                      <td className="p-4 md:table-cell md:p-5 text-center">
                        <div className="flex flex-row items-center justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => navigate(`/guia/edit-passeio/${p.id}`)}
                            className="flex items-center gap-2 bg-white border border-gray-200 text-[#383838] px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all hover:border-[#008080] hover:text-[#008080] active:scale-95 uppercase cursor-pointer outline-none"
                          >
                            <FontAwesomeIcon icon={faPencilAlt} />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={handleRemovePasseio(p.id)}
                            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-400 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all hover:border-red-500 hover:text-red-500 active:scale-95 uppercase cursor-pointer outline-none"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            <span>Remover</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {paginationInfo.totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                paginationInfo={paginationInfo}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </div>
      </ServerAuthGuia>
    </Auth>
  );
}