import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "../helpers/swalConfig.js";
import ButtonForm from "../components/ButtonForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faEye,
  faEyeSlash,
  faPlus,
  faTrash,
  faArrowLeft,
  faArrowRight,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import API_URL from "../config";

export default function SignInEmpresa() {
  const [preStep, setPreStep] = useState(0);
  const [tipoAtuacao, setTipoAtuacao] = useState("");
  const [rgFrente, setRgFrente] = useState("");
  const [rgVerso, setRgVerso] = useState("");
  const [categoriasOptions, setCategoriasOptions] = useState([]);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [txtPass, setTxtPass] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [txtPassConfirm, setTxtPassConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [txtName, setTxtName] = useState("");
  const [txtCnpj, setTxtCnpj] = useState("");
  const [descricao, setDescricao] = useState("");
  const [phone, setphone] = useState("");
  const [site, setSite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [multiLocation, setMultiLocation] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [imagens, setImagens] = useState([]);
  const [numero, setNumero] = useState("");
  const [txtEmail, setTxtEmail] = useState("");
  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState("");
  const [referencia, setReferencia] = useState("");
  const [semNumeroCadastur, setSemNumeroCadastur] = useState(false);
  const [txtCadastur, setTxtCadastur] = useState("");

  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImagens((prev) => [...prev, ...newFiles]);
    e.target.value = null;
  };

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const res = await fetch(`${API_URL}/categorias/sub`);
        if (!res.ok) throw new Error("Erro ao carregar categorias");
        const data = await res.json();
        const options = data.categorias.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }));
        setCategoriasOptions(options);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategorias();
  }, []);

  const removeImage = (i) => {
    setImagens((x) => x.filter((_, idx) => idx !== i));
  };
  const handleRgFrenteChange = (e) => setRgFrente(e.target.files[0]);
  const handleRgVersoChange = (e) => setRgVerso(e.target.files[0]);

  const isValidCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let digit1 = 11 - (sum % 11);
    if (digit1 === 10 || digit1 === 11) digit1 = 0;
    if (digit1 !== parseInt(cpf.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    let digit2 = 11 - (sum % 11);
    if (digit2 === 10 || digit2 === 11) digit2 = 0;
    return digit2 === parseInt(cpf.charAt(10));
  };

  const isValidCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]/g, "");
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
    let sum = 0;
    let weight = 2;
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (digit1 !== parseInt(cnpj.charAt(12))) return false;
    sum = 0;
    weight = 2;
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return digit2 === parseInt(cnpj.charAt(13));
  };

  const formatCPF = (value) => {
    const cpf = value.replace(/[^\d]/g, "");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatCNPJ = (value) => {
    const cnpj = value.replace(/[^\d]/g, "");
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  const handleCpfCnpjChange = (e) => {
    const value = e.target.value;
    if (tipoAtuacao === "autonomo") {
      const cpfOnly = value.replace(/[^\d]/g, "");
      if (cpfOnly.length <= 11) {
        setTxtCnpj(cpfOnly.length === 11 ? formatCPF(cpfOnly) : value);
      }
    } else {
      const cnpjOnly = value.replace(/[^\d]/g, "");
      if (cnpjOnly.length <= 14) {
        setTxtCnpj(cnpjOnly.length === 14 ? formatCNPJ(cnpjOnly) : value);
      }
    }
  };

  const handleCepChange = async (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    const cepLimpo = value;
    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    setCep(value);
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setEndereco(data.logradouro);
          setBairro(data.bairro);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const isValidPhone = (phone) => {
    const phoneOnly = phone.replace(/[^\d]/g, "");
    return phoneOnly.length === 10 || phoneOnly.length === 11;
  };

  const formatPhone = (value) => {
    const phone = value.replace(/[^\d]/g, "");
    if (phone.length <= 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const phoneOnly = value.replace(/[^\d]/g, "");
    if (phoneOnly.length <= 11) {
      setphone(phoneOnly.length >= 10 ? formatPhone(phoneOnly) : value);
    }
  };

  const validatePreStep = () => (tipoAtuacao === "autonomo" ? rgFrente && rgVerso : tipoAtuacao === "cnpj");

  const proceedToForm = () => {
    if (validatePreStep()) setPreStep(1);
    else Swal.fire("Atenção", "Preencha todos os campos obrigatórios.", "warning");
  };

  const validateStep = (target) => {
    if (target > step + 1) return false;
    switch (step) {
      case 1:
        const isDocValid = tipoAtuacao === "autonomo" ? isValidCPF(txtCnpj) : isValidCNPJ(txtCnpj);
        return txtName && txtCnpj && categoriasSelecionadas.length > 0 && isDocValid;
      case 2:
        return phone && isValidPhone(phone);
      case 3:
        return multiLocation ? true : endereco && numero && cep && bairro;
      case 4:
        return semNumeroCadastur ? true : txtCadastur;
      case 5:
        return imagens.length > 0;
      case 6:
        return txtPass && txtPassConfirm && txtPass === txtPassConfirm;
      default:
        return true;
    }
  };

  const goToStep = (target) => {
    if (target === step) return;
    if (target < step || validateStep(target)) setStep(target);
    else Swal.fire("Atenção", "Preencha os campos obrigatórios.", "warning");
  };

  const next = () => goToStep(step + 1);
  const back = () => setStep((s) => Math.max(s - 1, 1));
  const backToPreStep = () => setPreStep(0);

  const postEmpresa = async () => {
    if (txtPass !== txtPassConfirm) return Swal.fire("Erro", "As senhas não coincidem!", "error");
    setIsLoading(true);
    try {
      const payload = {
        name: txtName,
        tipoatuacao: tipoAtuacao,
        cpf: tipoAtuacao === "autonomo" ? txtCnpj.replace(/\D/g, "") : "",
        cnpj: tipoAtuacao === "autonomo" ? "" : txtCnpj.replace(/\D/g, ""),
        categorias: categoriasSelecionadas,
        email: txtEmail.trim(),
        senha: txtPass,
        descricao: descricao.trim() || "",
        phone: phone.replace(/\D/g, ""),
        site: site.trim() || "",
        multiLocation: multiLocation,
        endereco: endereco.trim() || "",
        numero: numero.trim() || "",
        cep: cep.trim() || "",
        bairro: bairro.trim() || "",
        referencia: referencia.trim() || "",
        cadastur: semNumeroCadastur ? "" : txtCadastur.trim() || "",
      };

      const res = await fetch(`${API_URL}/atracoes`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.success === true) {
        const isCnpj = data.atracao.tipoatuacao === "cnpj";
        Swal.fire({
          title: isCnpj ? "Quase lá!" : "Cadastro realizado!",
          text: isCnpj 
            ? "Verifique seu e-mail administrativo para confirmar o cadastro." 
            : "Seu serviço foi cadastrado e está em análise.",
          icon: isCnpj ? "info" : "success",
          confirmButtonColor: "#008080",
        }).then(() => navigate(isCnpj ? -1 : "/"));
      } else {
        throw new Error(data.error || "Erro no cadastro");
      }
    } catch (err) {
      Swal.fire("Erro", err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[600px] mx-auto mt-10 mb-20 px-4 font-poppins animate-in fade-in slide-in-from-bottom-4 duration-500">
      {preStep === 0 ? (
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#383838]">Tipo de atuação</h3>
            <p className="text-gray-500 text-sm">Selecione como você opera para personalizarmos seu cadastro.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                tipoAtuacao === "autonomo" ? "border-[#008080] bg-[#f0fdfa]" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => setTipoAtuacao("autonomo")}
            >
              <div className={`w-5 h-5 rounded-full border-2 mb-4 flex items-center justify-center ${tipoAtuacao === "autonomo" ? "border-[#008080]" : "border-gray-300"}`}>
                {tipoAtuacao === "autonomo" && <div className="w-2.5 h-2.5 rounded-full bg-[#008080]" />}
              </div>
              <h4 className="font-bold text-[#383838] mb-1">Autônomo</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">Para prestadores de serviço individuais.</p>
              <div className="flex gap-3 text-xs text-[#008080] bg-[#008080]/5 p-2 rounded-lg">
                <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5" />
                <p>Guias de turismo devem se cadastrar como usuário, não como autônomos!</p>
              </div>
            </div>

            <div
              className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                tipoAtuacao === "cnpj" ? "border-[#008080] bg-[#f0fdfa]" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => setTipoAtuacao("cnpj")}
            >
              <div className={`w-5 h-5 rounded-full border-2 mb-4 flex items-center justify-center ${tipoAtuacao === "cnpj" ? "border-[#008080]" : "border-gray-300"}`}>
                {tipoAtuacao === "cnpj" && <div className="w-2.5 h-2.5 rounded-full bg-[#008080]" />}
              </div>
              <h4 className="font-bold text-[#383838] mb-1">Pessoa jurídica</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Empresas, agências e estabelecimentos com CNPJ.</p>
            </div>
          </div>

          {tipoAtuacao === "autonomo" && (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center animate-in fade-in duration-300">
              <h4 className="font-bold text-[#383838] mb-2">Validação de identidade</h4>
              <p className="text-sm text-gray-500 mb-6">Precisamos do seu RG para garantir a segurança da plataforma.</p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "rg-frente", label: "Frente", file: rgFrente, change: handleRgFrenteChange },
                  { id: "rg-verso", label: "Verso", file: rgVerso, change: handleRgVersoChange }
                ].map((item) => (
                  <div key={item.id}>
                    <input id={item.id} type="file" accept="image/*" onChange={item.change} className="hidden" />
                    <label htmlFor={item.id} className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden bg-gray-50 ${item.file ? "border-[#008080]" : "border-gray-200 hover:bg-gray-100"}`}>
                      {item.file ? (
                        <div className="relative w-full h-full">
                          <img src={URL.createObjectURL(item.file)} alt={item.label} className="w-full h-full object-cover" />
                          <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-[#008080]">
                            <FontAwesomeIcon icon={faPencil} />
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-center">
                          <FontAwesomeIcon icon={faPlus} className="text-xl mb-2" />
                          <span className="block text-xs font-bold    tracking-wider">{item.label} do RG</span>
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <ButtonForm
              title="Continuar"
              onClick={proceedToForm}
              disabled={!validatePreStep()}
              className="bg-[#008080] text-white px-10 py-3 rounded-xl font-bold disabled:bg-gray-300"
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 p-6 md:p-10">
          <div className="h-1.5 w-full bg-gray-100 rounded-full mb-8 overflow-hidden">
            <div className="h-full bg-[#008080] transition-all duration-500" style={{ width: `${(step / 6) * 100}%` }} />
          </div>

          <div className="flex justify-between items-center mb-8">
            <button onClick={step === 1 ? backToPreStep : back} className="text-gray-400 hover:text-[#383838] transition-colors text-sm font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faArrowLeft} /> Voltar
            </button>
            <span className="text-[10px] font-black    tracking-widest text-[#008080] bg-[#008080]/10 px-3 py-1 rounded-full">
              Passo {step} de 6
            </span>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h2 className="text-2xl font-black text-[#383838]">Dados básicos</h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#383838]">
                    {tipoAtuacao === "autonomo" ? "Nome completo" : "Razão social"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                    placeholder={tipoAtuacao === "autonomo" ? "Ex: Maria Silva" : "Ex: Empresa Turística LTDA"}
                    value={txtName}
                    onChange={(e) => setTxtName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#383838]">
                    {tipoAtuacao === "autonomo" ? "CPF" : "CNPJ"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                      txtCnpj && (tipoAtuacao === "autonomo" ? !isValidCPF(txtCnpj) : !isValidCNPJ(txtCnpj))
                        ? "border-red-500" : "border-gray-200 focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080]"
                    }`}
                    placeholder={tipoAtuacao === "autonomo" ? "000.000.000-00" : "00.000.000/0000-00"}
                    value={txtCnpj}
                    onChange={handleCpfCnpjChange}
                  />
                  {txtCnpj && (tipoAtuacao === "autonomo" ? !isValidCPF(txtCnpj) : !isValidCNPJ(txtCnpj)) && (
                    <span className="text-xs text-red-500 font-medium">Documento inválido</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#383838]">Categorias <span className="text-red-500">*</span></label>
                  <Select
                    isMulti
                    options={categoriasOptions}
                    value={categoriasOptions.filter((opt) => categoriasSelecionadas.includes(opt.value))}
                    onChange={(opts) => setCategoriasSelecionadas(opts.map((o) => o.value))}
                    placeholder="Selecione as categorias..."
                    className="text-sm"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: '0.75rem',
                        padding: '2px',
                        borderColor: '#e5e7eb',
                        boxShadow: 'none',
                        '&:hover': { borderColor: '#008080' }
                      })
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#383838]">Sobre o negócio</label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl h-32 focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all resize-none"
                    placeholder="Conte um pouco sobre o que você oferece..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h2 className="text-2xl font-black text-[#383838]">Contatos</h2>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#383838]">WhatsApp / Telefone <span className="text-red-500">*</span></label>
                  <input
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${phone && !isValidPhone(phone) ? "border-red-500" : "border-gray-200 focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080]"}`}
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                </div>
                {tipoAtuacao === "autonomo" && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#383838]">E-mail profissional</label>
                    <input className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none" placeholder="contato@exemplo.com" value={txtEmail} onChange={(e) => setTxtEmail(e.target.value)} />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#383838]">Website</label>
                    <input className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none" placeholder="www.seusite.com" value={site} onChange={(e) => setSite(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#383838]">Instagram</label>
                    <input className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none" placeholder="@usuario" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h2 className="text-2xl font-black text-[#383838]">Localização</h2>
                
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={multiLocation} onChange={() => setMultiLocation(!multiLocation)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008080]"></div>
                  </label>
                  <span className="text-sm font-bold text-[#383838]">Atendo em múltiplos locais / itinerante</span>
                </div>

                {!multiLocation && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#383838]">CEP <span className="text-red-500">*</span></label>
                        <input className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none" placeholder="00000-000" value={cep} onChange={handleCepChange} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#383838]">Número <span className="text-red-500">*</span></label>
                        <input className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none" value={numero} onChange={(e) => setNumero(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#383838]">Endereço <span className="text-red-500">*</span></label>
                      <input className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none" value={endereco} readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#383838]">Bairro <span className="text-red-500">*</span></label>
                      <input className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none" value={bairro} readOnly />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#383838]">Ponto de Referência</label>
                  <input className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none" placeholder="Próximo a..." value={referencia} onChange={(e) => setReferencia(e.target.value)} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h2 className="text-2xl font-black text-[#383838]">Regularização</h2>
                <div className="space-y-3">
                  {[
                    { val: false, label: "Tenho Cadastur" },
                    { val: true, label: "Não possuo Cadastur" }
                  ].map((opt) => (
                    <div key={String(opt.val)} onClick={() => setSemNumeroCadastur(opt.val)} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${semNumeroCadastur === opt.val ? "border-[#008080] bg-[#f0fdfa]" : "border-gray-100 hover:border-gray-200"}`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${semNumeroCadastur === opt.val ? "border-[#008080]" : "border-gray-300"}`}>
                        {semNumeroCadastur === opt.val && <div className="w-2.5 h-2.5 rounded-full bg-[#008080]" />}
                      </div>
                      <span className="font-bold text-sm text-[#383838]">{opt.label}</span>
                    </div>
                  ))}
                </div>
                {!semNumeroCadastur && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-bold text-[#383838]">Número do Cadastur <span className="text-red-500">*</span></label>
                    <input className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none" value={txtCadastur} onChange={(e) => setTxtCadastur(e.target.value)} />
                  </div>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-2xl font-black text-[#383838]">Galeria de fotos</h2>
                  <p className="text-sm text-gray-500">Adicione até 10 fotos para seu perfil.</p>
                </div>
                
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {imagens.map((file, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-sm group">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      <button onClick={() => removeImage(i)} className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center text-red-500 shadow-md">
                        <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                      </button>
                    </div>
                  ))}
                  {imagens.length < 10 && (
                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-[#008080] transition-all text-gray-400 hover:text-[#008080]">
                      <input type="file" accept="image/*" multiple onChange={handleAvatarChange} className="hidden" />
                      <FontAwesomeIcon icon={faPlus} className="text-xl mb-1" />
                      <span className="text-[10px] font-bold    tracking-widest">Adicionar</span>
                    </label>
                  )}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h2 className="text-2xl font-black text-[#383838]">Segurança</h2>
                <div className="space-y-4">
                  {[
                    { label: "Senha de acesso", val: txtPass, set: setTxtPass, show: showPassword, setShow: setShowPassword },
                    { label: "Confirme a senha", val: txtPassConfirm, set: setTxtPassConfirm, show: showConfirm, setShow: setShowConfirm }
                  ].map((p, idx) => (
                    <div key={idx} className="space-y-2">
                      <label className="text-sm font-bold text-[#383838]">{p.label} <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none pr-12" type={p.show ? "text" : "password"} value={p.val} onChange={(e) => p.set(e.target.value)} />
                        <FontAwesomeIcon icon={p.show ? faEye : faEyeSlash} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" onClick={() => p.setShow(!p.show)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>

          <div className="mt-10 flex justify-end">
            {step < 6 ? (
              <ButtonForm
                title={<span>Próximo <FontAwesomeIcon icon={faArrowRight} className="ml-2" /></span>}
                onClick={next}
                className="bg-[#008080] text-white px-8 py-4 rounded-xl font-bold shadow-lg   hover:scale-[1.02] transition-all"
              />
            ) : (
              <ButtonForm
                title={isLoading ? "Finalizando..." : "Concluir cadastro"}
                onClick={postEmpresa}
                disabled={isLoading}
                className="bg-[#008080] text-white px-10 py-4 rounded-xl font-bold shadow-lg   hover:scale-[1.02] transition-all disabled:bg-gray-300 disabled:shadow-none"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}