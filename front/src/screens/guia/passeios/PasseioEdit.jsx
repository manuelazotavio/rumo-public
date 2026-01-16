import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "../../../helpers/swalConfig.js";
import Auth from "../../../helpers/ProtectRoute.js";
import ServerAuthGuia from "../../../helpers/ProtectServerRouteGuia.js";
import Select from "react-select";
import Button from "../../../components/Button.jsx";
import UploadImagens from "../../../components/UploadImagens.jsx";
import Loading from "../../../components/Loading.jsx";
import API_URL from "../../../config";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from "date-fns/locale/pt-BR";
import { format, parseISO } from "date-fns";

registerLocale("pt-BR", ptBR);

export default function PasseioEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaFim, setHoraFim] = useState(null);

  const [capacity, setCapacity] = useState("");
  const [active, setActive] = useState("true");
  const [imagens, setImagens] = useState([]);
  const [imagensExistentes, setImagensExistentes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [atracoesOptions, setAtracoesOptions] = useState([]);
  const [atracoesSelecionadas, setAtracoesSelecionadas] = useState([]);
  const [guiasOptions, setGuiasOptions] = useState([]);
  const [guiasSelecionados, setGuiasSelecionados] = useState([]);

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

  const statusOptions = [
    { value: "true", label: "Ativo" },
    { value: "false", label: "Inativo" },
  ];

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [resAtracoes, resGuias, resPasseio] = await Promise.all([
          fetch(`${API_URL}/atracoes/panel?limit=100&all=true`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/guide/panel?limit=100`),
          fetch(`${API_URL}/passeios/${id}`),
        ]);

        if (resAtracoes.ok) {
          const data = await resAtracoes.json();
          const lista = data.data || data;
          setAtracoesOptions(
            lista.map((a) => ({ value: a.id, label: a.name }))
          );
        }

        if (resGuias.ok) {
          const data = await resGuias.json();
          const lista = data.data || data.guias || data;
          setGuiasOptions(lista.map((g) => ({ value: g.id, label: g.name })));
        }

        if (resPasseio.ok) {
          const data = await resPasseio.json();
          setName(data.name || "");
          setDescription(data.description || "");
          setPrice(data.price || "");
          setDuration(data.duration || "");
          setCapacity(data.capacity || "");
          setActive(data.active ? "true" : "false");

          if (data.startDate) setDataInicio(new Date(data.startDate));
          if (data.endDate) setDataFim(new Date(data.endDate));

          if (data.startTime) {
            setDataInicio((prev) => {
               const d = new Date(data.startTime);
               setHoraInicio(d);
               return prev;
            });
             setHoraInicio(new Date(data.startTime));
          }
          if (data.endTime) {
            setHoraFim(new Date(data.endTime));
          }

          if (data.atracoes) {
            setAtracoesSelecionadas(
              data.atracoes.map((item) => item.atracao?.id || item.id)
            );
          }

          if (data.guias) {
            setGuiasSelecionados(
              data.guias.map((item) => item.guia?.id || item.id)
            );
          }

          if (data.imagens) {
            setImagensExistentes(data.imagens);
          }
        } else {
          Swal.fire("Erro", "Passeio não encontrado", "error");
          navigate("/guia/panel/passeios");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Erro", "Falha ao carregar dados", "error");
      } finally {
        setLoadingData(false);
      }
    };

    loadAllData();
  }, [id, navigate]);

  const validateRequired = () => {
    if (!name || name.length < 3) {
      Swal.fire("Erro", "O nome é obrigatório (mínimo 3 caracteres)", "error");
      return false;
    }
    if (!dataInicio || !horaInicio) {
      Swal.fire("Erro", "Data e Hora de início são obrigatórios", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateRequired()) return;
    setIsSubmitting(true);

    try {
      const payload = {
        name,
        description,
        price,
        duration: parseInt(duration),
        capacity: capacity ? parseInt(capacity) : undefined,
        active: active === "true",
        atracaoIds: atracoesSelecionadas,
        guiaIds: guiasSelecionados,
        startDate: dataInicio ? format(dataInicio, "yyyy-MM-dd") : null,
        endDate: dataFim ? format(dataFim, "yyyy-MM-dd") : null,
        startTime: horaInicio ? format(horaInicio, "HH:mm") : null,
        endTime: horaFim ? format(horaFim, "HH:mm") : null,
      };

      const res = await fetch(`${API_URL}/passeios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao atualizar passeio");

      if (imagens.length > 0) {
        const form = new FormData();
        imagens.forEach((img) => {
          const arquivo = img.file || img;
          form.append("image", arquivo);
        });
        await fetch(`${API_URL}/passeios/${id}/imagens`, {
          method: "POST",
          body: form,
        });
      }

      Swal.fire("Sucesso", "Passeio atualizado com sucesso!", "success");
      navigate("/guia/panel/passeios");
    } catch (err) {
      console.error(err);
      Swal.fire("Erro", err.message || "Erro ao atualizar passeio", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData || isSubmitting) return <Loading />;

  return (
    <Auth>
      <ServerAuthGuia>
        <div className="w-full max-w-[900px] mx-auto my-12 p-6 md:p-10 bg-white rounded-2xl shadow-xl shadow-black/5 font-poppins">
          <header className="mb-10">
            <h2 className="text-3xl font-black text-[#383838]">
              Editar passeio
            </h2>
            <p className="text-gray-500 mt-2">
              Atualize as informações do passeio.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Nome do Passeio <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Mergulho na Ilha"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Preço por pessoa
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex: R$ 120,00"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Duração (minutos) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 180"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Capacidade máxima
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Ex: 20"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Data de início <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={dataInicio}
                  onChange={(date) => setDataInicio(date)}
                  locale="pt-BR"
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  placeholderText="Selecione o dia"
                  wrapperClassName="w-full"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Data final
                </label>
                <DatePicker
                  selected={dataFim}
                  onChange={(date) => setDataFim(date)}
                  locale="pt-BR"
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  placeholderText="Selecione o dia"
                  wrapperClassName="w-full"
                  minDate={dataInicio}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Horário de início <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={horaInicio}
                  onChange={(date) => setHoraInicio(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Hora"
                  dateFormat="HH:mm"
                  locale="pt-BR"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  placeholderText="00:00"
                  wrapperClassName="w-full"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Horário final
                </label>
                <DatePicker
                  selected={horaFim}
                  onChange={(date) => setHoraFim(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Hora"
                  dateFormat="HH:mm"
                  locale="pt-BR"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
                  placeholderText="00:00"
                  wrapperClassName="w-full"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Status
                </label>
                <Select
                  options={statusOptions}
                  value={statusOptions.find((opt) => opt.value === active)}
                  onChange={(opt) => setActive(opt.value)}
                  styles={customSelectStyles}
                  placeholder="Selecione o status"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-[#383838]">
                  Atrações inclusas
                </label>
                <Select
                  isMulti
                  options={atracoesOptions}
                  value={atracoesOptions.filter((opt) =>
                    atracoesSelecionadas.includes(opt.value)
                  )}
                  onChange={(opts) =>
                    setAtracoesSelecionadas(opts.map((o) => o.value))
                  }
                  styles={customSelectStyles}
                  placeholder="Selecione as atrações"
                />
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-[#383838]">
                  Guias responsáveis
                </label>
                <Select
                  isMulti
                  options={guiasOptions}
                  value={guiasOptions.filter((opt) =>
                    guiasSelecionados.includes(opt.value)
                  )}
                  onChange={(opts) =>
                    setGuiasSelecionados(opts.map((o) => o.value))
                  }
                  styles={customSelectStyles}
                  placeholder="Selecione os guias"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-[#383838]">
                Descrição detalhada
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-xl h-32 focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o itinerário, o que está incluso e recomendações..."
              />
            </div>

            <div className="pt-4">
              <label className="text-sm font-bold text-[#383838] mb-4 block">
                Galeria de Fotos
              </label>
              <UploadImagens
                imagensExistentes={imagensExistentes}
                onChange={setImagens}
              />
            </div>

            <div className="flex justify-center pt-8">
              <Button
                className="w-full md:w-[300px] py-4 bg-[#008080] text-white rounded-xl font-bold shadow-lg   hover:scale-[1.02] active:scale-[0.98] transition-all disabled:bg-gray-300"
                type="submit"
                disabled={isSubmitting}
                title="Salvar Alterações"
              />
            </div>
          </form>
        </div>
      </ServerAuthGuia>
    </Auth>
  );
}