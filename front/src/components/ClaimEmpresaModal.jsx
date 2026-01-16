import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Swal from "../helpers/swalConfig.js";
import { useNavigate } from "react-router-dom";
import useUserLoggedStore from "../stores/userLoggedStore";
import API_URL from "../config";

Modal.setAppElement("#root");

export default function ClaimEmpresaModal({ atracao, isOpen, onClose }) {
  const navigate = useNavigate();
  const login = useUserLoggedStore((state) => state.login);

  const [info, setInfo] = useState("");
  const [pass, setPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (atracao) {
      if (atracao.email) setInfo(atracao.email);
      else if (atracao.phone) setInfo(atracao.phone);
      else setInfo("");
    }
  }, [atracao]);

  const handleSubmit = async () => {
    if (!info || !pass) {
      Swal.fire("Atenção", "Informe email/celular e senha.", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login/empresa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ info, pass }),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        Swal.fire("Sucesso", "Login realizado com sucesso.", "success").then(() => {
          onClose();
          navigate("/perfil/user");
        });
      } else {
        Swal.fire("Erro", data.error || "Falha no login", "error");
      }
    } catch (err) {
      Swal.fire("Erro", "Erro de conexão com o servidor.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      className="bg-white w-[95%] max-w-[500px] rounded-2xl p-8 shadow-2xl outline-none font-poppins text-[#383838] relative"
      overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-4"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3 text-[#383838]">Reivindicar empresa</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Faça login com os dados cadastrados da sua empresa para reivindicar este perfil.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold    tracking-wider text-gray-400">Empresa</label>
          <div className="p-4 bg-gray-50 rounded-xl font-bold border border-gray-100 text-[#008080]">
            {atracao?.name}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold    tracking-wider text-gray-400">Email ou celular</label>
          <input 
            className="w-full h-[55px] bg-white px-5 rounded-[12px] text-base font-medium border border-gray-300 shadow-sm outline-none focus:border-[#008080] transition-all placeholder:text-gray-400"
            value={info} 
            onChange={(e) => setInfo(e.target.value)} 
            placeholder="seu@email.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold    tracking-wider text-gray-400">Senha</label>
          <input 
            type="password" 
            className="w-full h-[55px] bg-white px-5 rounded-[12px] text-base font-medium border border-gray-300 shadow-sm outline-none focus:border-[#008080] transition-all placeholder:text-gray-400"
            value={pass} 
            onChange={(e) => setPass(e.target.value)} 
            placeholder="Sua senha"
          />
        </div>

        <div className="flex gap-3 mt-6 max-[480px]:flex-col-reverse">
          <button 
            className="flex-1 h-[52px] rounded-xl border-2 border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            onClick={onClose} 
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            className="flex-1 h-[52px] rounded-xl bg-[#008080] text-white font-bold hover:opacity-90 transition-opacity disabled:bg-gray-300 shadow-md"
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar como empresa"}
          </button>
        </div>
      </div>
    </Modal>
  );
}