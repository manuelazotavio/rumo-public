import React, { useState, useEffect } from "react";
import { Pagination } from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import ButtonForm from "../../components/ButtonForm";
import Button from "../../components/Button";
import Subtitle from "../../components/Subtitle";
import Loading from "../../components/Loading";
import Auth from "../../helpers/ProtectRoute";
import API_URL from "../../config";
import ServerAuthGuia from "../../helpers/ProtectServerRouteGuia";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function AttractionsPanelGuide() {
  const [atracoes, setAtracoes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [columns] = useState([
    { id: "id", label: "ID", visible: true },
    { id: "name", label: "Nome", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "cpfcnpj", label: "CPF/CNPJ", visible: true },
    { id: "tipoatuacao", label: "Atuação", visible: true },
    { id: "email", label: "E-mail", visible: true },
    { id: "subCategorias", label: "Categoria", visible: true },
  ]);

  const navigate = useNavigate();

  const handleRemoveAtracao = (id) => async () => {
    if (window.confirm("Tem certeza que deseja remover esta atração?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/atracoes/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setAtracoes((prev) => prev.filter((a) => a.id !== id));
        }
      } catch (err) {
        setError("Erro de conexão com o servidor");
      }
    }
  };

  useEffect(() => {
    const fetchAtracoes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const params = new URLSearchParams({ page: currentPage, limit: 10 });

        const response = await fetch(
          `${API_URL}/atracoes/panel?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          setAtracoes(data.data || []);
          setPaginationInfo(data.pagination || {});
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Erro de conexão");
      } finally {
        setLoading(false);
      }
    };
    fetchAtracoes();
  }, [currentPage]);

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "ativo":
        return "bg-green-100 text-green-700";
      case "pendente":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  if (loading) return <Loading />;

  return (
    <Auth>
      <ServerAuthGuia>
        <div className="w-full max-w-[1440px] mx-auto p-5 md:p-10 font-poppins mb-12">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="space-y-1">
              <Subtitle className="text-[#383838] text-3xl font-black tracking-tighter">
                Minhas atrações
              </Subtitle>
              <p className="text-gray-500 text-sm">
                Gerencie os locais cadastrados por você.
              </p>
            </div>
            <ButtonForm
              className="w-full md:w-auto bg-[#008080] text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all"
              title="Adicionar Atração"
              onClick={() => navigate("/guia/add-atracao")}
            />
          </header>

          {atracoes.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center text-gray-400 font-medium">
              Nenhuma atração encontrada.
            </div>
          ) : (
            <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
              <table className="w-full border-collapse text-left min-w-[1000px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {columns
                      .filter((c) => c.visible)
                      .map((c) => (
                        <th
                          key={c.id}
                          className="p-5 text-[10px] font-black tracking-widest text-gray-400 uppercase"
                        >
                          {c.label}
                        </th>
                      ))}
                    <th className="p-5 text-[10px] font-black tracking-widest text-gray-400 text-center uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {atracoes.map((a) => (
                    <tr
                      key={a.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {columns
                        .filter((c) => c.visible)
                        .map((c) => (
                          <td
                            key={c.id}
                            className="p-5 text-[#383838] text-sm font-medium whitespace-nowrap"
                          >
                            {c.id === "subCategorias" ? (
                              <div className="flex flex-wrap gap-1">
                                {a.subCategorias?.map((cat, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-500"
                                  >
                                    {cat.subCategoria?.name}
                                  </span>
                                ))}
                              </div>
                            ) : c.id === "status" ? (
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black ${getStatusStyles(
                                  a.status
                                )}`}
                              >
                                {a.status}
                              </span>
                            ) : (
                              a[c.id] || "—"
                            )}
                          </td>
                        ))}
                      <td className="p-4 md:table-cell md:p-5 text-center">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          <button
                            onClick={() =>
                              navigate(`/guia/edit-atracao/${a.id}`)
                            }
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#383838] px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-[1px] transition-all hover:border-[#008080] hover:text-[#008080] active:scale-95 uppercase cursor-pointer outline-none"
                          >
                            <FontAwesomeIcon
                              icon={faPencilAlt}
                              className="text-[10px]"
                            />
                            EDITAR
                          </button>

                          <button
                            onClick={handleRemoveAtracao(a.id)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-400 px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-[1px] transition-all hover:border-red-500 hover:text-red-500 active:scale-95 uppercase cursor-pointer outline-none"
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-[10px]"
                            />
                            REMOVER
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
            <div className="mt-10 flex justify-center">
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
