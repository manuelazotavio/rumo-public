import React, { useEffect, useState } from "react";
import {
  faClose,
  faTrash,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "../helpers/swalConfig.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonForm from './ButtonForm.jsx'
import useRoteirosStore from "../stores/roteirosStore";
import useUserLoggedStore from "../stores/userLoggedStore.js";
import API_URL from "../config";

export default function CriarRoteiroModal({ atracao, onClose }) {
  const addRoteiros = useRoteirosStore((state) => state.addRoteiros);
  const [roteiros, setRoteiros] = useState([]);
  const [toggled, setToggled] = useState(false);
  const [txtName, setTxtName] = useState("");
  const [secreto, setSecreto] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [amigosSelecionados, setAmigosSelecionados] = useState([]);
  const [buscandoAmigo, setBuscandoAmigo] = useState(false);

  const idUser = useUserLoggedStore((state) => state.id);

  useEffect(() => {
    setSecreto(toggled ? 1 : 0);
  }, [toggled]);

  useEffect(() => {
    if (localStorage.getItem("atracaoPendente")) {
      localStorage.removeItem("atracaoPendente");
    }
  }, []);

  async function buscarRoteiros() {
    try {
      const response = await fetch(`${API_URL}/roteiro/user/${idUser}`);
      const data = await response.json();
      setRoteiros(data.roteiros);
    } catch {
      console.log("erro");
    }
  }

  async function handleBuscarAmigo() {
    if (!searchTerm) return;
    setBuscandoAmigo(true);

    try {
      const response = await fetch(
        `${API_URL}/roteiro/userMail?term=${searchTerm}`
      );
      const data = await response.json();

      if (data && data.id) {
        if (data.id === idUser) {
          Swal.fire("Ops", "Você já é o dono do roteiro.", "warning");
          return;
        }

        const jaAdicionado = amigosSelecionados.some(
          (amigo) => amigo.id === data.id
        );
        if (jaAdicionado) {
          Swal.fire("Ops", "Este usuário já foi adicionado.", "warning");
          setSearchTerm("");
          return;
        }

        setAmigosSelecionados([...amigosSelecionados, data]);
        setSearchTerm("");
      } else {
        Swal.fire(
          "Não encontrado",
          "Usuário não encontrado. Verifique o e-mail ou telefone.",
          "info"
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Erro", "Erro ao buscar usuário.", "error");
    } finally {
      setBuscandoAmigo(false);
    }
  }

  function removerAmigo(idParaRemover) {
    setAmigosSelecionados(
      amigosSelecionados.filter((a) => a.id !== idParaRemover)
    );
  }

  async function vinculateRoteiroToAtracao(atracaoId, roteiroId) {
    try {
      const response = await fetch(
        `${API_URL}/roteiro/vinculaAtracao/${roteiroId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ atracaoId }),
        }
      );

      const data = response.json();
      return data;
    } catch {
      throw new Error("Erro ao adicionar ao roteiro recém criado.");
    }
  }

  async function handleCriarRoteiro() {
    if (txtName.length < 1) {
      Swal.fire("Erro", "O roteiro precisa de um nome!", "error");
      return;
    }

    try {
      setLoading(true);

      const allUserIds = [idUser, ...amigosSelecionados.map((a) => a.id)];

      const payload = {
        name: txtName,
        userIds: allUserIds,
        secret: secreto,
      };

      const response = await fetch(`${API_URL}/roteiro`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success || response.ok) {
        try {
          const novoRoteiro = data.roteiro || data;
          addRoteiros(novoRoteiro);

          if (atracao) {
            await vinculateRoteiroToAtracao(atracao.id, novoRoteiro.id);
          }

          Swal.fire(
            '<span style="font-size: 1.4rem">Isso aí!</span>',
            "Roteiro criado com sucesso.",
            "success"
          );
        } catch {
          console.log("Erro ao criar roteiro e adicionar atração");
        }
      }

      onClose();
    } catch {
      console.log("Erro");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarRoteiros();
  }, []);

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/45 z-[1000]"
      ></div>
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[480px] max-h-[90vh] bg-white rounded-[20px] shadow-2xl z-[1001] p-6 md:p-10 font-poppins overflow-y-auto overscroll-contain">
        <button
          className="absolute cursor-pointer top-4 right-5 text-2xl text-gray-400 hover:text-[#008080] transition-colors"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>

        <h2 className="text-3xl font-bold text-[#383838] mb-8">Criar roteiro</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#383838] mb-2 after:content-['*'] after:ml-0.5 after:text-red-500">
              Nome do Roteiro
            </label>
            <input
              className="w-full h-[55px] bg-white px-5 rounded-[12px] border border-gray-300 shadow-sm outline-none focus:border-[#008080] transition-all placeholder:text-gray-400 font-medium"
              type="text"
              value={txtName}
              onChange={(e) => setTxtName(e.target.value)}
              placeholder="Ex: Viagem com a galera"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#383838] mb-2">Privacidade</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setToggled(!toggled)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  toggled ? "bg-[#008080]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    toggled ? "translate-x-6" : ""
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-500">
                {toggled ? "Secreto" : "Público"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#383838] mb-2">Adicionar viajantes</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 h-[50px] bg-gray-50 px-4 rounded-xl border border-gray-300 outline-none focus:border-[#008080] transition-all text-sm"
                placeholder="E-mail ou celular"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBuscarAmigo()}
              />
              <button
                className="bg-[#008080] text-white px-4 rounded-xl font-bold text-sm hover:bg-[#006666] transition-colors disabled:bg-gray-300"
                onClick={handleBuscarAmigo}
                disabled={buscandoAmigo || !searchTerm}
              >
                {buscandoAmigo ? "..." : "Adicionar"}
              </button>
            </div>

            {amigosSelecionados.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <small className="block text-gray-400 mb-2 font-semibold">Pessoas adicionadas:</small>
                <div className="flex flex-col gap-2">
                  {amigosSelecionados.map((amigo) => (
                    <div key={amigo.id} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#383838]">{amigo.name}</span>
                        <span className="text-[10px] text-gray-400">{amigo.email || amigo.phone}</span>
                      </div>
                      <button
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        onClick={() => removerAmigo(amigo.id)}
                      >
                        <FontAwesomeIcon icon={faClose} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-6">
            <ButtonForm
              onClick={handleCriarRoteiro}
              title={loading ? "Criando..." : "Confirmar"}
              variant="primary"
              className="w-full !h-[55px] rounded-xl font-bold text-lg shadow-lg  "
            />
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-500 font-bold hover:text-[#383838] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}