import React, { useState, useEffect } from "react";
import Auth from "../../helpers/ProtectRoute.js";
import ServerAuthGuia from "../../helpers/ProtectServerRouteGuia.js";
import Loading from "../../components/Loading.jsx";
import API_URL from "../../config";
import Subtitle from "../../components/Subtitle";
import Swal from "../../helpers/swalConfig.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faHandHoldingDollar,
  faClock,
  faReceipt,
  faCircleCheck,
  faCircleExclamation,
  faMoneyBillTransfer,
} from "@fortawesome/free-solid-svg-icons";

export default function PagamentosGuia() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    saldoDisponivel: 0,
    saldoPendente: 0,
    chavePix: "",
    transacoes: [],
    saques: [],
  });

  const fetchFinanceiro = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/guide/financeiro`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceiro();
  }, []);

  const handleSolicitarSaque = async () => {
    const { value: valor } = await Swal.fire({
      title: "Solicitar saque",
      input: "number",
      inputLabel: `Disponível: R$ ${data.saldoDisponivel.toFixed(2)}`,
      inputPlaceholder: "Digite o valor do saque",
      showCancelButton: true,
      confirmButtonColor: "#008080",
      confirmButtonText: "Confirmar Saque",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value || value <= 0) return "Insira um valor válido!";
        if (value > data.saldoDisponivel) return "Saldo insuficiente!";
      },
    });

    if (valor) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/guia/saque`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ valor, chavePix: data.chavePix }),
        });

        if (res.ok) {
          Swal.fire("Sucesso", "Solicitação enviada!", "success");
          fetchFinanceiro();
        } else {
          const err = await res.json();
          throw new Error(err.error);
        }
      } catch (err) {
        Swal.fire("Erro", err.message, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAlterarChavePix = async () => {
    const { value: novaChave } = await Swal.fire({
      title: "Alterar chave PIX",
      input: "text",
      inputLabel: "Sua chave (CPF, e-mail, celular ou aleatória)",
      inputValue: data.chavePix,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#008080",
    });

    if (novaChave) {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/guide/update-pix`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chavePix: novaChave }),
      });

      if (res.status === 401) {
        const errorData = await res.json();
        console.log(errorData)
        if (errorData.code === "expired-token") {
          localStorage.removeItem("token");
          localStorage.removeItem("user-storage");
          navigate("/login");
          return;
        }
      }

      if (res.ok) {
        Swal.fire("Sucesso", "Chave atualizada!", "success");
        fetchFinanceiro();
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <Auth>
      <ServerAuthGuia>
        <div className="w-full max-w-[1440px] mx-auto p-5 md:p-10 font-poppins mb-12 animate-in fade-in duration-500">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <Subtitle className="text-[#383838] text-3xl font-black tracking-tighter">
                Financeiro
              </Subtitle>
              <p className="text-gray-500 text-sm">
                Ganhos e histórico de movimentações.
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-black/5 border border-gray-100 flex flex-col justify-between group relative overflow-hidden">
              <div className="z-10">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  Saldo Disponível
                </p>
                <h2 className="text-4xl font-black text-[#383838] mt-2">
                  R${" "}
                  {data.saldoDisponivel.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h2>
              </div>
              <button
                onClick={handleSolicitarSaque}
                className="mt-8 z-10 w-full bg-[#008080] cursor-pointer text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faHandHoldingDollar} />
                Solicitar saque
              </button>
              <FontAwesomeIcon
                icon={faWallet}
                className="absolute -right-6 -bottom-6 text-9xl text-gray-50 group-hover:text-[#008080]/5 transition-colors"
              />
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-black/5 border border-gray-100 flex flex-col justify-center">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                Aguardando Liberação
              </p>
              <h2 className="text-3xl font-bold text-gray-300 mt-2">
                R${" "}
                {data.saldoPendente.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h2>
              <div className="flex items-center gap-2 mt-4 text-amber-500">
                <FontAwesomeIcon icon={faClock} className="text-xs" />
                <span className="text-[10px] font-black uppercase tracking-tighter">
                  Disponível 7 dias após o passeio
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-[32px] border border-dashed border-gray-200 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 bg-[#008080]/10 rounded-full flex items-center justify-center text-[#008080] mb-3">
                <FontAwesomeIcon icon={faMoneyBillTransfer} />
              </div>
              <p className="text-xs font-black text-[#383838] uppercase">
                Chave PIX
              </p>
              <p className="text-sm font-medium text-gray-500 mt-1">
                {data.chavePix || "Não configurada"}
              </p>
              <button
                onClick={handleAlterarChavePix}
                className="mt-4 cursor-pointer text-[#008080] text-[10px] font-black uppercase hover:underline"
              >
                Alterar chave
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[32px] shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center gap-3">
              <FontAwesomeIcon icon={faReceipt} className="text-[#008080]" />
              <h3 className="font-black text-[#383838] uppercase text-sm tracking-widest">
                Extrato de Movimentações
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="p-6 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Data
                    </th>
                    <th className="p-6 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Descrição
                    </th>
                    <th className="p-6 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Tipo
                    </th>
                    <th className="p-6 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Valor
                    </th>
                    <th className="p-6 text-[10px] font-black tracking-widest text-gray-400 uppercase text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.transacoes.length > 0 ? (
                    data.transacoes.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="p-6 text-xs font-medium text-gray-400">
                          {new Date(t.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="p-6">
                          <span className="text-sm font-bold text-[#383838]">
                            {t.descricao}
                          </span>
                        </td>
                        <td className="p-6">
                          <span
                            className={`text-[10px] font-black ${
                              t.tipo === "CREDITO"
                                ? "text-emerald-500"
                                : "text-red-400"
                            }`}
                          >
                            {t.tipo}
                          </span>
                        </td>
                        <td className="p-6">
                          <span
                            className={`text-sm font-black ${
                              t.tipo === "CREDITO"
                                ? "text-[#383838]"
                                : "text-red-500"
                            }`}
                          >
                            {t.tipo === "CREDITO" ? "+" : "-"} R${" "}
                            {t.valor.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-6 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                              t.status === "CONCLUIDO"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs"
                      >
                        Nenhuma movimentação registrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ServerAuthGuia>
    </Auth>
  );
}
