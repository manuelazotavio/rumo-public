import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import useUserLoggedStore from "../../stores/userLoggedStore.js";
import Auth from "../../helpers/ProtectRoute.js";
import API_URL from "../../config.js";
import Swal from "sweetalert2";
import { faPen, faTrash, faPlus, faArrowLeft, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import guidePlaceholder from "../../img/guide-user.png";
import whatsapp from "../../img/whatsapp.png";
import placeholder from "../../img/imgplaceholder.png";
import gmail from "../../img/gmail.png";
import Button from "../../components/Button.jsx";
import ButtonForm from '../../components/ButtonForm.jsx'

const PerfilGuia = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [guideImagem, setGuideImagem] = useState(guidePlaceholder);
  const [guia, setGuia] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const { setSidebarOpen } = useOutletContext() || { setSidebarOpen: () => {} };

  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const navigate = useNavigate();
  const guiaId = useUserLoggedStore((state) => state.guiaId);

  useEffect(() => {
    const fetchGuia = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/guide/id/${guiaId}`);
        const data = await response.json();
        if (response.ok) {
          const dadosGuia = data.guia || {};
          if (!dadosGuia.imagens) dadosGuia.imagens = [];
          setGuia(dadosGuia);
          setFormData(dadosGuia);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuia();
  }, [guiaId]);

  useEffect(() => {
    if (guia.image && guia.image.trim() !== "") {
      setGuideImagem(guia.image);
    } else {
      setGuideImagem(guidePlaceholder);
    }
  }, [guia]);

  useEffect(() => {
    return () => setSidebarOpen(true);
  }, [setSidebarOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => {
    if (!isEditing) {
      setFormData(guia);
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "imagens" && key !== "image" && formData[key] !== null) {
          dataToSend.append(key, formData[key]);
        }
      });
      if (selectedFile) dataToSend.append("image", selectedFile);

      const response = await fetch(`${API_URL}/guide/${guiaId}`, {
        method: "PUT",
        body: dataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        setGuia(data.guide);
        setFormData(data.guide);
        setIsEditing(false);
        setSidebarOpen(true);
        setSelectedFile(null);
        Swal.fire("Boa!", "Perfil atualizado com sucesso.", "success");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(guia);
    setIsEditing(false);
    setSidebarOpen(true);
  };

  const logout = useUserLoggedStore((state) => state.logout);

  const handleLogoutUser = async () => {
    try {
      logout();
      navigate("/login-user");
    } catch (error) {
      console.error("Erro ao sair");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setGuideImagem(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleGalleryFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const tempId = Date.now();
    const previewUrl = URL.createObjectURL(file);
    const tempImage = { id: tempId, url: previewUrl, isUploading: true };

    setFormData((prev) => ({ ...prev, imagens: [...(prev.imagens || []), tempImage] }));

    const formDataImage = new FormData();
    formDataImage.append("image", file);

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/guide/${guiaId}/imagens`, {
        method: "POST",
        body: formDataImage,
      });
      const data = await response.json();
      if (response.ok && data[0].url) {
        const realImage = { id: data[0].id, url: data[0].url };
        setFormData((prev) => ({
          ...prev,
          imagens: prev.imagens.map((img) => (img.id === tempId ? realImage : img)),
        }));
        setGuia((prev) => ({ ...prev, imagens: [...(prev.imagens || []), realImage] }));
      }
    } catch (error) {
      setFormData((prev) => ({ ...prev, imagens: prev.imagens.filter((img) => img.id !== tempId) }));
      Swal.fire("Erro", "Falha ao enviar foto.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    try {
      const response = await fetch(`${API_URL}/guide/${guiaId}/imagens/${imageId}`, { method: "DELETE" });
      if (response.ok) {
        setFormData((prev) => ({ ...prev, imagens: prev.imagens.filter((img) => img.id !== imageId) }));
        setGuia((prev) => ({ ...prev, imagens: prev.imagens.filter((img) => img.id !== imageId) }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const displayData = isEditing ? formData : guia;
  const galleryImages = displayData.imagens || [];
  const mainImage = galleryImages[0]?.url || placeholder;
  const secondImage = galleryImages[1]?.url || placeholder;
  const thirdImage = galleryImages[2]?.url || placeholder;
  const remainingCount = galleryImages.length > 3 ? galleryImages.length - 3 : 0;

  const dataValidade = displayData?.validadeCadastur
    ? new Date(displayData.validadeCadastur).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    : "Não informado";

  const dataAtualizacao = displayData?.updatedAt
    ? new Date(displayData.updatedAt).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    : "Não informado";

  const ProfileSkeleton = () => (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl p-8 md:p-20 shadow-2xl animate-pulse font-poppins mt-12">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
        <div className="w-64 h-64 bg-gray-200 rounded-full shrink-0 mx-auto md:mx-0"></div>
        <div className="flex-1 space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-5/6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 pt-10"></div>
        </div>
      </div>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-4 h-[380px]">
        <div className="bg-gray-200 rounded-xl"></div>
        <div className="grid grid-rows-2 gap-4">
          <div className="bg-gray-200 rounded-xl"></div>
          <div className="bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );

  const ProfileCard = ({ isPreview = false }) => (
    <div className={`w-full max-w-[1100px] mx-auto bg-white rounded-xl shadow-xl font-poppins overflow-hidden ${isPreview ? 'p-6' : 'p-8 md:p-14 my-10'}`}>
      <div className="flex flex-col md:flex-row gap-8 lg:gap-14 items-center md:items-start text-center md:text-left">
        <div className="relative w-48 h-48 lg:w-56 lg:h-56 shrink-0">
          <img src={guideImagem} alt="Perfil" className="w-full h-full object-cover rounded-full " />
          {isEditing && (
            <button onClick={() => fileInputRef.current.click()} className="absolute bottom-2 right-2 bg-[#008080] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10">
              <FontAwesomeIcon icon={faPen} />
            </button>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="flex-1 space-y-2 text-[#383838] text-[17px]">
          <h2 className="text-[#008080] text-3xl font-semibold mb-6">{displayData.name || "Seu Nome"}</h2>
          <p><span className="font-bold">Segmento(s): </span>{displayData.segmentos?.map(s => s.segmento?.name || s.name).join(", ") || "Não informado"}</p>
          <p><span className="font-bold">Idioma(s): </span>{displayData.languages?.split("|").join(", ") || "Português"}</p>
          <p><span className="font-bold">Número do Cadastur:</span> {displayData.certificate || "Não informado"}</p>
          <p><span className="font-bold">Validade do Cadastur:</span> {dataValidade}</p>
          <p><span className="font-bold">Telefone:</span> {displayData.number || "Não informado"}</p>
          <p><span className="font-bold">E-mail:</span> {displayData.email || "Não informado"}</p>
          <p><span className="font-bold">Website:</span> {displayData.website || "Não informado"}</p>
          <p className="pt-2 text-[13px]"><span className="font-bold text-[#008080]">Última atualização em:</span> {dataAtualizacao}</p>
        </div>

        <div className="shrink-0 flex flex-col items-center md:items-start">
          <h4 className="text-[#008080] font-semibold text-xl mb-4">Entre em contato</h4>
          <div className="flex gap-4 items-center">
            <img className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform" src={whatsapp} alt="Whatsapp" />
            <img className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform" src={gmail} alt="Gmail" />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-medium text-[#383838]">Galeria de fotos</h2>
            <span className="text-[#008080] font-bold cursor-pointer hover:underline text-sm flex items-center gap-1">Ver todos &gt;</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
            <img src={mainImage} className="w-full h-full object-cover" alt="Principal" />
          </div>
          <div className="grid grid-rows-2 gap-3 h-full">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
              <img src={secondImage} className="w-full h-full object-cover" alt="Foto 1" />
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm cursor-pointer group">
              <img src={thirdImage} className="w-full h-full object-cover" alt="Foto 2" />
              {remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors group-hover:bg-black/70">
                  <span className="text-white font-bold text-xl">+{remainingCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-gray-100 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="text-4xl font-medium text-[#383838]">Passeios recentes</h2>
          {!isEditing && (
            <button onClick={() => navigate("/guia/panel/passeios")} className="bg-[#008080] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#2c8989] transition-colors flex items-center gap-2 shadow-md">
              <FontAwesomeIcon icon={faPen} /> Editar passeios
            </button>
          )}
        </div>
        <p className="text-gray-500 italic">O guia não possui passeios cadastrados no momento.</p>
      </div>
    </div>
  );

  return (
    <Auth>
      {isLoading && !isEditing ? (
        <ProfileSkeleton />
      ) : isEditing ? (
        <div className="flex flex-col lg:flex-row w-full min-h-[100vh] bg-gray-50 font-poppins">
          <div className="w-full lg:w-[450px] bg-white p-6 md:p-10  scrollbar-thin overflow-y-auto ">
            <button onClick={handleCancel} className="mb-6 cursor-pointer text-gray-500 hover:text-[#383838] flex items-center gap-2 font-bold transition-colors text-sm">
              <FontAwesomeIcon icon={faArrowLeft} /> Voltar para o Perfil
            </button>
            <h2 className="text-4xl font-semibold text-[#383838] mb-1 tracking-tight">Editar perfil</h2>
            <p className="text-gray-400 text-sm mb-8">Atualize suas informações visíveis para os turistas.</p>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {[
                { label: "Nome completo", name: "name" },
                { label: "Telefone (WhatsApp)", name: "number" },
                { label: "E-mail de contato", name: "email", type: "email" },
                { label: "Website", name: "website" },
                { label: "Idiomas (separe por |)", name: "languages" }
              ].map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-[16px] font-bold text-[#383838]">{field.label}</label>
                  <input
                    type={field.type === "date" ? "date" : field.type || "text"}
                    name={field.name}
                    value={field.type === "date" && formData[field.name] ? formData[field.name].split('T')[0] : formData[field.name] || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008080] outline-none text-sm"
                  />
                </div>
              ))}

              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-bold text-[#383838] text-[16px] mb-4 ">Gerenciar galeria</h4>
                <div className="flex flex-wrap gap-2.5">
                  {formData.imagens?.map((img) => (
                    <div key={img.id} className="relative w-25 h-25 rounded-lg overflow-hidden border border-gray-200">
                      <img src={img.url} className="w-full h-full object-cover" alt="Galeria" />
                      <button onClick={() => handleDeleteGalleryImage(img.id)} className="absolute top-0.5 right-0.5 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-[12px] shadow-lg">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => galleryInputRef.current.click()} className="w-25 h-25 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 hover:text-[#008080] hover:border-[#008080] transition-all">
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                  <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={handleGalleryFileChange} />
                </div>
              </div>

              <div className="pt-8 flex gap-3 sticky bottom-0 bg-white pb-2">
                <ButtonForm onClick={handleSave} title="Salvar alterações" className="flex-1 shadow-lg" />
                <button onClick={handleCancel} className="px-4 font-bold text-gray-400 text-sm">Cancelar</button>
              </div>
            </form>
          </div>

          <div className="flex-1 bg-[#f4f7f9] p-4 md:p-10 overflow-y-auto flex flex-col items-center">
            <ProfileCard isPreview />
          </div>
        </div>
      ) : (
        <div className="w-full p-4 md:p-8 font-poppins relative min-h-screen bg-gray-50">
          <div className="max-w-[1100px] mx-auto pt-10">
            <div className="flex justify-between items-center mb-8 px-4">
               <h3 className="text-lg text-center font-bold text-gray-400">Assim é como as pessoas veem seu perfil:</h3>
               <ButtonForm title="Editar perfil" onClick={toggleEditMode}/>
            </div>
            
            <ProfileCard />
            
            <div className="flex justify-center mt-12 pb-20">
              <ButtonForm onClick={handleLogoutUser} title="Sair da conta" className="max-w-xs bg-white !text-gray-400 border border-gray-200 hover:!text-gray-100 py-3 text-xs" />
            </div>
          </div>
        </div>
      )}
    </Auth>
  );
};

export default PerfilGuia;