import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "../helpers/swalConfig.js";
import ButtonForm from "../components/ButtonForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUser,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import useUserStore from "../stores/usersStore";
import useUserLoggedStore from "../stores/userLoggedStore";
import Loading from "../components/Loading";
import API_URL from "../config";
import SignInEmpresa from "./SignInEmpresa";
import CriarRoteiroModal from "../components/CriarRoteiroModal.jsx";

const SignInUsuario = () => {
  const addUser = useUserStore((state) => state.addUser);
  const login = useUserLoggedStore((state) => state.login);

  const [isJuridica, setIsJuridica] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txtName, setTxtName] = useState("");
  const [txtEmail, setTxtEmail] = useState("");
  const [txtPass, setTxtPass] = useState("");
  const [txtPassConfirm, setTxtPassConfirm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [txtCadastur, setTxtCadastur] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const postUser = async (e) => {
    e.preventDefault();

    if (!txtName.trim() || !txtEmail.trim() || !txtPass.trim() || !txtPassConfirm.trim()) {
      return Swal.fire({
        text: "Preencha todos os campos obrigatórios.",
        icon: "warning",
        confirmButtonColor: "#008080",
      });
    }

    if (txtPass !== txtPassConfirm) {
      return Swal.fire({
        text: "As senhas não conferem.",
        icon: "error",
        confirmButtonColor: "#008080",
      });
    }

    if (toggled && !txtCadastur.trim()) {
      return Swal.fire({
        text: "Informe o número do Cadastur.",
        icon: "warning",
        confirmButtonColor: "#008080",
      });
    }

    try {
      setIsLoading(true);

      await fetch(`${API_URL}/logs/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TRY_SIGN_IN",
          message: `Usuário ${txtName}, com o e-mail ${txtEmail} tentou fazer o cadastro.`,
        }),
      });

      let dadosGuia = null;
      if (toggled) {
        const resultCadastur = await fetch(`${API_URL}/guide/${txtCadastur}`);
        const res = await resultCadastur.json();

        if (!res.success) {
          setIsLoading(false);
          return Swal.fire({
            text: "Guia não encontrado na base de dados. Contate o suporte.",
            icon: "error",
            confirmButtonColor: "#008080",
          });
        }
        dadosGuia = res.guia;
      }

      const payload = {
        name: txtName,
        info: txtEmail,
        pass: txtPass,
        cadastur: toggled ? txtCadastur : null,
      };

      const result = await fetch(`${API_URL}/user`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      const data = await result.json();

      if (data?.success) {
        addUser(data.user);
        if (toggled) {
          const emailParaAviso = dadosGuia ? dadosGuia.email : txtEmail;
          const emailCamuflado = emailParaAviso.replace(/(.{2}).+(@.+)/, "$1***$2");

          await Swal.fire({
            title: "Quase lá!",
            text: `Cadastro realizado! Um link de ativação foi enviado para ${emailCamuflado}.`,
            icon: "success",
            confirmButtonText: "Ir para Login",
            confirmButtonColor: "#008080",
          });
          navigate("/login");
        } else {
          const response = await fetch(`${API_URL}/auth/login/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ info: txtEmail, pass: txtPass }),
          });

          if (response.ok) {
            const loginData = await response.json();
            login(loginData.user || loginData);
            if (localStorage.getItem("atracaoPendente")) {
              setShowModal(true);
            } else {
              Swal.fire({
                text: "Cadastro realizado com sucesso!",
                icon: "success",
                confirmButtonColor: "#008080",
              });
              navigate("/");
            }
          }
        }
      } else {
        throw new Error(data.error || "Erro no cadastro");
      }
    } catch (error) {
      Swal.fire({ text: error.message, icon: "error", confirmButtonColor: "#008080" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;
  const atracaoPendente = localStorage.getItem("atracaoPendente");

  return (
    <div className="w-full max-w-[600px] mx-auto my-10 px-4 font-poppins">
      {showModal && createPortal(
        <CriarRoteiroModal onClose={() => setShowModal(false)} atracao={atracaoPendente} />,
        document.body
      )}

      <div className="flex w-full bg-gray-100 rounded-2xl p-1 mb-8 shadow-inner">
        <button
          className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            !isJuridica ? "bg-white text-[#008080] shadow-md" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setIsJuridica(false)}
        >
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          Para você
        </button>
        <button
          className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            isJuridica ? "bg-white text-[#008080] shadow-md" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setIsJuridica(true)}
        >
          <FontAwesomeIcon icon={faBuilding} className="mr-2" />
          Para empresas
        </button>
      </div>

      {isJuridica ? (
        <SignInEmpresa />
      ) : (
        <form className="flex flex-col space-y-5 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-black/5" onSubmit={postUser}>
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-bold text-[#383838] after:content-['*'] after:ml-0.5 after:text-red-500">Nome</label>
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
              value={txtName}
              onChange={(e) => setTxtName(e.target.value)}
              placeholder="Seu nome completo"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-bold text-[#383838] after:content-['*'] after:ml-0.5 after:text-red-500">E-mail ou celular</label>
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
              value={txtEmail}
              onChange={(e) => setTxtEmail(e.target.value)}
              placeholder="exemplo@email.com"
            />
          </div>

          <div className="relative flex flex-col space-y-1.5">
            <label className="text-sm font-bold text-[#383838] after:content-['*'] after:ml-0.5 after:text-red-500">Senha</label>
            <div className="relative">
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all pr-12"
                type={showPassword ? "text" : "password"}
                value={txtPass}
                onChange={(e) => setTxtPass(e.target.value)}
                placeholder="Crie uma senha forte"
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#008080] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          <div className="relative flex flex-col space-y-1.5">
            <label className="text-sm font-bold text-[#383838] after:content-['*'] after:ml-0.5 after:text-red-500">Confirme sua senha</label>
            <div className="relative">
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all pr-12"
                type={showConfirm ? "text" : "password"}
                value={txtPassConfirm}
                onChange={(e) => setTxtPassConfirm(e.target.value)}
                placeholder="Repita a senha"
              />
              <FontAwesomeIcon
                icon={showConfirm ? faEye : faEyeSlash}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#008080] transition-colors"
                onClick={() => setShowConfirm(!showConfirm)}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#383838]">Você atua como guia turístico?</span>
              <button
                type="button"
                onClick={() => setToggled(!toggled)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${toggled ? "bg-[#008080]" : "bg-gray-300"}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${toggled ? "translate-x-6" : ""}`} />
              </button>
            </div>

            {toggled && (
              <div className="flex flex-col space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                <label className="text-sm font-bold text-[#383838] after:content-['*'] after:ml-0.5 after:text-red-500">Número do Cadastur</label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={txtCadastur}
                  onChange={(e) => setTxtCadastur(e.target.value)}
                  
                />
              </div>
            )}
          </div>

          <div className="flex justify-center pt-6">
            <ButtonForm
              variant="signin" 
              title="Cadastrar" 
              onClick={postUser}
              className="w-full md:w-[250px] bg-[#008080] text-white py-3 rounded-xl font-bold text-lg  hover:scale-[1.02] active:scale-[0.98] transition-all" 
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default SignInUsuario;