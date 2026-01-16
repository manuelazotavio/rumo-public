import React, { useState, useEffect } from "react";
import Swal from "../../helpers/swalConfig.js";
import Auth from "../../helpers/ProtectRoute.js";
import Select from "react-select";
import ButtonForm from "../../components/ButtonForm.jsx";
import UploadImagens from "../../components/UploadImagens.jsx";
import Loading from "../../components/Loading.jsx";
import API_URL from "../../config";
import ServerAuthGuia from "../../helpers/ProtectServerRouteGuia.js";
import useUserLoggedStore from "../../stores/userLoggedStore.js";

export default function AddAttractionsGuide() {
  const guiaId = useUserLoggedStore((state) => state.guiaId);

  const [name, setName] = useState("");
  const [tipo, setTipo] = useState("cnpj");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [senha, setSenha] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [endereco, setEndereco] = useState("");
  const [googleID, setGoogleID] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState("");
  const [referencia, setReferencia] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cadastur, setCadastur] = useState("");
  const [imagens, setImagens] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoriasOptions, setCategoriasOptions] = useState([]);
  const [subcategoriasOptions, setSubcategoriasOptions] = useState([]);
  const [subcategoriasSelecionadas, setSubcategoriasSelecionadas] = useState(
    []
  );
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const res = await fetch(`${API_URL}/categorias`);
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
    const loadSubcategorias = async () => {
      try {
        const res = await fetch(`${API_URL}/categorias/sub`);
        if (!res.ok) throw new Error("Erro ao carregar subcategorias");
        const data = await res.json();
        const options = (data.categorias || data).map((sub) => ({
          value: sub.id,
          label: sub.name,
          categoriaId: sub.categoriaId || sub.categoria,
        }));
        setSubcategoriasOptions(options);
      } catch (err) {
        console.error(err);
      }
    };
    loadSubcategorias();
  }, []);

  const handleCepChange = async (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    const cepLimpo = value;
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    }
    setCep(value);

    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
        );
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

  const validateRequired = () => {
    if (!name || name.length < 3) {
      Swal.fire("Erro", "O nome é obrigatório (mínimo 3 caracteres)", "error");
      return false;
    }
    if (tipo !== "ponto") {
      if (!cpfCnpj || cpfCnpj.replace(/\D/g, "").length < 11) {
        Swal.fire("Erro", "CPF ou CNPJ inválido", "error");
        return false;
      }
      if (!senha || senha.length < 6) {
        Swal.fire(
          "Erro",
          "A senha é obrigatória (mínimo 6 caracteres)",
          "error"
        );
        return false;
      }
    }
    return true;
  };

  const tipoOptions = [
    { value: "cnpj", label: "Pessoa Jurídica (CNPJ)" },
    { value: "autonomo", label: "Autônomo (CPF)" },
    { value: "ponto", label: "Ponto Turístico" },
  ];

  const statusOptions = [
    { value: "ativo", label: "Ativo" },
    { value: "pendente", label: "Pendente" },
    { value: "inativo", label: "Inativo" },
  ];

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#fff",
      borderColor: state.isFocused ? "#008080" : "#e5e7eb",
      borderRadius: "0.75rem",
      padding: "4px",
      fontSize: "0.875rem",
      boxShadow: state.isFocused ? "0 0 0 4px rgba(0, 128, 128, 0.1)" : "none",
      "&:hover": { borderColor: "#008080" },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.75rem",
      zIndex: 99,
      overflow: "hidden",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#008080"
        : state.isFocused
        ? "#f0fdfa"
        : "#fff",
      color: state.isSelected ? "#fff" : "#383838",
      cursor: "pointer",
      fontSize: "0.875rem",
    }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateRequired()) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name,
        guiaId,
        tipoatuacao: tipo,
        descricao,
        phone: phone.replace(/\D/g, ""),
        numero,
        multiLocation: false,
        endereco,
        cep,
        bairro,
        referencia,
        site,
        cadastur,
        googleID,
        senha,
        status,
        cpfcnpj: cpfCnpj.replace(/\D/g, ""),
        email: email || undefined,
        categorias: categoriasSelecionadas,
        subcategorias: subcategoriasSelecionadas,
      };

      const res = await fetch(`${API_URL}/atracoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar atração");

      const atracaoId = data?.atracao?.id || data?.id || data?.newId;

      if (!atracaoId) {
        Swal.fire(
          "Atenção",
          "Atração criada, mas ID não retornado.",
          "warning"
        );
        setIsSubmitting(false);
        return;
      }

      if (imagens.length > 0) {
        const form = new FormData();
        imagens.forEach((img) => {
          const arquivo = img.file || img;
          form.append("imagem", arquivo);
        });
        await fetch(`${API_URL}/atracoes/${atracaoId}/imagens`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        });
      }

      Swal.fire("Sucesso", "Atração criada com sucesso.", "success");
      setName("");
      setCpfCnpj("");
      setSenha("");
      setPhone("");
      setEmail("");
      setSite("");
      setEndereco("");
      setNumero("");
      setCep("");
      setBairro("");
      setReferencia("");
      setDescricao("");
      setCadastur("");
      setImagens([]);
      setCategoriasSelecionadas([]);
      setSubcategoriasSelecionadas([]);
    } catch (err) {
      console.error(err);
      Swal.fire("Erro", err.message || "Erro ao criar atração", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) return <Loading />;

  return (
    <Auth>
      <ServerAuthGuia>
        <div className="w-full max-w-[1000px] mx-auto my-12 p-6 md:p-10 bg-white rounded-3xl shadow-xl shadow-black/5 font-poppins animate-in fade-in duration-500">
          <header className="mb-10">
            <h2 className="text-3xl font-black text-[#383838]">
              Adicionar atração
            </h2>
            <p className="text-gray-500 mt-2">
              Preencha os campos abaixo para cadastrar um novo ponto ou
              prestador.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome da atração ou empresa"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Tipo de Atuação <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="Selecione..."
                  options={tipoOptions}
                  value={tipoOptions.find((opt) => opt.value === tipo)}
                  onChange={(opt) => setTipo(opt.value)}
                  styles={customSelectStyles}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Status <span className="text-red-500">*</span>
                </label>
                <Select
                  options={statusOptions}
                  placeholder="Selecione..."
                  value={statusOptions.find((opt) => opt.value === status)}
                  onChange={(opt) => setStatus(opt.value)}
                  styles={customSelectStyles}
                />
              </div>

              {tipo !== "ponto" && (
                <>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-bold text-[#383838]">
                      {tipo === "cnpj" ? "CNPJ" : "CPF"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                      value={cpfCnpj}
                      onChange={(e) => setCpfCnpj(e.target.value)}
                      placeholder="Somente números"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-bold text-[#383838]">
                      Senha <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                      type="password"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Categoria(s) <span className="text-red-500">*</span>
                </label>
                <Select
                  isMulti
                  options={categoriasOptions}
                  value={categoriasOptions.filter((opt) =>
                    categoriasSelecionadas.includes(opt.value)
                  )}
                  onChange={(opts) =>
                    setCategoriasSelecionadas(opts.map((o) => o.value))
                  }
                  styles={customSelectStyles}
                  placeholder="Selecione..."
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Subcategoria(s)
                </label>
                <Select
                  isMulti
                  options={subcategoriasOptions.filter((s) =>
                    categoriasSelecionadas.length > 0
                      ? categoriasSelecionadas.includes(
                          s.categoriaId || s.categoria
                        )
                      : true
                  )}
                  value={subcategoriasOptions.filter((opt) =>
                    subcategoriasSelecionadas.includes(opt.value)
                  )}
                  onChange={(opts) =>
                    setSubcategoriasSelecionadas(opts.map((o) => o.value))
                  }
                  placeholder="Selecione subcategorias..."
                  styles={customSelectStyles}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  E-mail
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Telefone
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Website
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  placeholder="www.site.com.br"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Google Place ID
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={googleID}
                  onChange={(e) => setGoogleID(e.target.value)}
                  placeholder="ID do Google Maps"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">CEP</label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={cep}
                  placeholder="00000-000"
                  onChange={handleCepChange}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Endereço
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua, Avenida..."
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Número
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Bairro
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Referência
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="Perto de..."
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Cadastur
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={cadastur}
                  onChange={(e) => setCadastur(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-[#383838]">
                Descrição
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-xl h-32 focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all resize-none"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Detalhes sobre a atração..."
              />
            </div>

            <div className="pt-4">
              <label className="text-sm font-bold text-[#383838] mb-4 block">
                Imagens da Atração
              </label>
              <UploadImagens imagensExistentes={[]} onChange={setImagens} />
            </div>

            <div className="flex justify-center pt-8 border-t border-gray-50">
              <ButtonForm
                className="w-full md:w-[300px] py-4 bg-[#008080] text-white rounded-xl font-bold shadow-lg   hover:scale-[1.02] active:scale-[0.98] transition-all"
                type="submit"
                disabled={isSubmitting}
                title="Adicionar atração"
              />
            </div>
          </form>
        </div>
      </ServerAuthGuia>
    </Auth>
  );
}
