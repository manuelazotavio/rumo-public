import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FilterContainer from "../components/FilterContainer.jsx";
import AttractionSection from "../components/AttractionSection.jsx";
import ModalRoteiroAutomatico from "../components/ModalRoteiroAutomatico.jsx";
import { createPortal } from "react-dom";
import API_URL from "../config";
import { FaSearchMinus } from "react-icons/fa";

export default function Filtrados() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const initialFilters = state?.filters || {};

  const [filters, setFilters] = useState(initialFilters);
  const [selectedRoteiro, setSelectedRoteiro] = useState(null);
  const [roteirosGerados, setRoteirosGerados] = useState([]);
  const [atracoesGerais, setAtracoesGerais] = useState([]);
  const [atracoesByFilter, setAtracoesByFilter] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dynamicFilterKeys = [
    "praias",
    "trilhas",
    "cachoeiras",
    "turismoNautico",
    "restaurantesBares",
    "shopping",
    "culinariaRegional",
    "fastFood",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const activeFilters = Object.entries(filters)
        .filter(([_, v]) => v === true)
        .map(([k]) => k);
      const params = new URLSearchParams();
      activeFilters.forEach((k) => params.append(k, "true"));
      const queryString = params.toString() ? `?${params.toString()}` : "";

      try {
        const [dataRoteiros, dataAtracoesGerais] = await Promise.all([
          fetch(`${API_URL}/roteiro/automatico${queryString}`).then((res) =>
            res.json()
          ),
          fetch(`${API_URL}/atracoes/filter${queryString}`).then((res) =>
            res.json()
          ),
        ]);

        const filterPromises = activeFilters
          .filter((key) => dynamicFilterKeys.includes(key))
          .map(async (filterKey) => {
            const res = await fetch(
              `${API_URL}/atracoes/filter?${filterKey}=true`
            );
            return { key: filterKey, data: await res.json() };
          });

        const filtersResults = await Promise.all(filterPromises);

        setRoteirosGerados(Array.isArray(dataRoteiros) ? dataRoteiros : []);
        setAtracoesGerais(
          Array.isArray(dataAtracoesGerais.atracoes)
            ? dataAtracoesGerais.atracoes
            : []
        );

        const newAtracoesByFilter = {};
        filtersResults.forEach(({ key, data }) => {
          newAtracoesByFilter[key] = Array.isArray(data.atracoes)
            ? data.atracoes
            : [];
        });
        setAtracoesByFilter(newAtracoesByFilter);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const getFilterDisplayName = (filterKey) => {
    const names = {
      praias: "Praias",
      trilhas: "Trilhas",
      cachoeiras: "Cachoeiras",
      turismoNautico: "Turismo náutico",
      restaurantesBares: "Restaurantes e bares",
      turismoCultural: "Turismo cultural",
      centroCultural: "Centro cultural",
      ecoturismo: "Ecoturismo",
      shopping: "Shoppings e lojas",
      culinariaRegional: "Culinária regional",
      fastFood: "Fast-food",
    };
    return names[filterKey] || filterKey;
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const activeFiltersKeys = Object.keys(filters).filter(
    (k) => filters[k] === true
  );
  const firstActiveFilterKey = activeFiltersKeys[0];
  const mainSectionTitle =
    filters.hospedagemSim || filters.hospedagemNao
      ? "Próximos da sua hospedagem"
      : firstActiveFilterKey
      ? getFilterDisplayName(firstActiveFilterKey)
      : "Atrações em destaque";

  const noAttractionsFound = !loading && atracoesGerais.length === 0;

  const RoteirosSection = (
    <section className="mb-16 mt-6 md:mt-0">
      <h3 className="text-[28px] md:text-[34px] font-medium text-[#383838] mb-6 px-4 md:px-2">
        Roteiros sugeridos
      </h3>
      <div className="flex overflow-x-auto gap-6 pb-10 px-4 md:px-2 scrollbar-hide snap-x snap-mandatory">
        {roteirosGerados.map((roteiro) => (
          <article
            key={roteiro.id}
            className="flex-none w-[280px] bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-100 flex flex-col snap-start shadow-sm hover:shadow-xl transition-all"
            onClick={() => setSelectedRoteiro(roteiro)}
          >
            <div className="h-[140px] bg-[#008080] flex items-center justify-center text-white font-bold text-lg">
              {roteiro.atracoes?.length || 0} atrações
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h4 className="text-lg font-bold text-[#383838] mb-2 truncate">
                {roteiro.name}
              </h4>
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
                {roteiro.descricao}
              </p>
              <button className="mt-auto w-full py-2 border cursor-pointer border-[#008080] text-[#008080] rounded-xl font-semibold hover:bg-[#e6f2f2] transition-all">
                Abrir
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen flex flex-col w-full font-poppins text-[#383838] bg-white overflow-x-hidden">
      {error && (
        <p className="text-red-600 p-4 text-center bg-red-50">Erro: {error}</p>
      )}

      {selectedRoteiro &&
        createPortal(
          <ModalRoteiroAutomatico
            onClose={() => setSelectedRoteiro(null)}
            selectedRoteiro={selectedRoteiro}
          />,
          document.body
        )}

      <div className="flex flex-col md:flex-row gap-0 md:gap-12 py-0 md:py-10 px-5 md:px-16 lg:px-24 mx-auto items-start max-w-[1800px] w-full">
        <aside className="w-full md:w-[280px] shrink-0 md:sticky md:top-24 z-30">
          <FilterContainer
            savedFilters={filters}
            onSearch={(f) => setFilters(f)}
          />
        </aside>

        <main className="flex-1 min-w-0 w-full z-10">
          {noAttractionsFound && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
              <div className="bg-gray-50 p-8 rounded-full mb-6">
                <FaSearchMinus className="text-5xl text-gray-300" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#383838] mb-3">
                Ops! Não encontramos atrações.
              </h3>
              <p className="text-gray-500 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
                Não encontramos atrações com esses filtros. Tente novamente ou
                confira os roteiros queridinhos pelos viajantes.
              </p>

              {!loading && roteirosGerados.length > 0 && RoteirosSection}
            </div>
          )}

          {!loading && !noAttractionsFound && (
            <>
              {!loading && roteirosGerados.length > 0 && RoteirosSection}

              {atracoesGerais.length > 0 && (
                <AttractionSection
                  title={mainSectionTitle}
                  atracoes={atracoesGerais}
                  loading={loading}
                  filterKey={firstActiveFilterKey || "todas"}
                  filterName={mainSectionTitle}
                  navigate={navigate}
                />
              )}

              {Object.keys(atracoesByFilter).map((key) => {
                if (
                  key === firstActiveFilterKey ||
                  atracoesByFilter[key].length === 0
                )
                  return null;
                return (
                  <div key={key} className="mt-5">
                    <AttractionSection
                      title={getFilterDisplayName(key)}
                      atracoes={atracoesByFilter[key]}
                      loading={loading}
                      filterKey={key}
                      filterName={getFilterDisplayName(key)}
                      navigate={navigate}
                    />
                  </div>
                );
              })}
            </>
          )}
        </main>
      </div>
    </div>
  );
}