import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Swal from "../helpers/swalConfig.js";
import ButtonForm from "../components/ButtonForm.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import SignBtn from "../components/SignBtn.jsx";
import useUserLoggedStore from "../stores/userLoggedStore.js";
import Loading from "../components/Loading.jsx";
import API_URL from "../config";
import ModalLogin from "../components/ModalLogin.jsx";
import CriarRoteiroModal from "../components/CriarRoteiroModal.jsx";
import ModalRoteiro from "../components/ModalRoteiro.jsx";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [txtInfo, setTxtInfo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalAttraction, setShowModalAttraction] = useState(false);
  const [txtPass, setTxtPass] = useState("");
  const [showCreateItineraryModal, setShowCreateItineraryModal] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = useUserLoggedStore((state) => state.login);

  useEffect(() => {
    if (localStorage.getItem("atracaoPendente")) {
      setShowModal(true);
    }
  }, []);

  const atracaoPendente = JSON.parse(localStorage.getItem("atracaoPendente"));
  const idUser = useUserLoggedStore((state) => state.id);
  const navigate = useNavigate();

  const handleAddItinerary = async () => {
    try {
      const response = await fetch(`${API_URL}/roteiro/`);
      const data = await response.json();
      const itinerary = data.roteiro;

      if (!itinerary) {
        setShowModalAttraction(true);
        return;
      }
      toast.promise(addRecentItinerary(itinerary.id), {
        loading: "Adicionando...",
        success: () => (
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#383838]">
              Adicionado ao roteiro <strong>{itinerary.name}</strong>
            </div>
            <button
              className="bg-[#008080] text-white px-3 py-1 rounded-md text-xs font-bold"
              onClick={() => setShowModalAttraction(true)}
            >
              Alterar
            </button>
          </div>
        ),
        error: "Erro ao adicionar.",
        duration: 5000,
      });
    } catch {}
  };

  async function addRecentItinerary(itineraryId) {
    try {
      const response = await fetch(
        `${API_URL}/roteiro/vincular/${itineraryId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ atracaoId: atracaoPendente.id }),
        }
      );
      return response.json();
    } catch {
      throw new Error("Erro ao adicionar");
    }
  }

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ info: txtInfo, pass: txtPass }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.user, data.token);
        if (localStorage.getItem("atracaoPendente")) {
          handleAddItinerary();
        } else {
          navigate("/");
        }
      } else {
        const errorData = await response.json();
        Swal.fire({
          text: errorData.error,
          icon: "error",
          confirmButtonText: "Voltar",
          confirmButtonColor: "#008080",
        });
      }
    } catch {
      Swal.fire({
        text: "Erro ao fazer login.",
        icon: "error",
        confirmButtonText: "Voltar",
        confirmButtonColor: "#008080",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="font-poppins text-[#383838]">
      {showModalAttraction &&
        createPortal(
          <ModalRoteiro
            onClose={() => setShowModalAttraction(false)}
            atracao={atracaoPendente}
          />,
          document.body
        )}
      {showCreateItineraryModal &&
        createPortal(
          <CriarRoteiroModal
            onClose={() => setShowCreateItineraryModal(false)}
            atracao={atracaoPendente}
          />,
          document.body
        )}
      {showModal &&
        createPortal(
          <ModalLogin onClose={() => setShowModal(false)} />,
          document.body
        )}

      <div className="w-full flex flex-col justify-center items-center p-5 min-h-[80vh]">

        <ButtonForm
          onClick={() => navigate("/cadastro/usuario")}
          title="Criar conta"
        />

        <p className="mb-0 mt-6 text-base font-medium">Ou faça login abaixo</p>

        <div className="w-full max-w-[450px] flex flex-col gap-5 mt-10">
          <div className="w-full">
            <input
              className="!w-full h-[55px] bg-white px-5 rounded-[12px] text-base font-medium border border-gray-300 shadow-sm outline-none focus:border-[#008080] transition-all placeholder:text-gray-400"
              type="text"
              placeholder="Número do celular ou email"
              value={txtInfo}
              onChange={(e) => setTxtInfo(e.target.value)}
            />
          </div>

          <div className="w-full relative">
            <input
              className="!w-full h-[55px] bg-white px-5 rounded-[12px] text-base font-medium border border-gray-300 shadow-sm outline-none focus:border-[#008080] transition-all placeholder:text-gray-400"
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={txtPass}
              onChange={(e) => setTxtPass(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-[#008080] text-xl"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <div className="mt-12">
          <ButtonForm
            onClick={handleLogin}
            title="Entrar"
            variant="outline"
            className="w-[200px] !h-[50px] text-xl rounded-[15px] font-bold"
          />
        </div>

        <button
          onClick={() => navigate("/esqueci-minha-senha")}
          className="bg-transparent border-none text-lg text-[#383838] font-bold cursor-pointer mt-10 hover:text-[#008080] transition-colors"
        >
          Esqueceu a senha?
        </button>
      </div>

      <Modal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md mx-auto mt-40 outline-none"
        overlayClassName="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">{modalMessage}</h2>
        <button
          className="w-full bg-[#008080] text-white py-3 rounded-xl font-bold"
          onClick={() => setModalVisible(false)}
        >
          Fechar
        </button>
      </Modal>
    </div>
  );
};

export default Login;
