import React, { useState, useEffect } from "react";
import API_URL from "../config";

export default function UploadImagens({ imagensExistentes = [], onChange, atracaoId }) {
  const [previews, setPreviews] = useState(imagensExistentes);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const novas = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      nova: true,
    }));

    if (previews.length + novas.length > 10) {
      alert("Máximo de 10 imagens!");
      return;
    }

    const atualizadas = [...previews, ...novas];
    setPreviews(atualizadas);
    onChange?.(atualizadas);
  };

  const removerImagem = async (index) => {
    const imagem = previews[index];

    if (imagem.id) {
      const confirmar = window.confirm("Remover imagem permanentemente?");
      if (!confirmar) return;

      try {
        const res = await fetch(
          `${API_URL}/atracoes/${atracaoId}/imagens/${imagem.id}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Erro ao remover imagem");
      } catch (err) {
        console.error(err);
        alert("Falha ao remover imagem do servidor");
        return;
      }
    }

    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      previews.forEach((p) => p.nova && URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  return (
    <div className="w-full mb-4 font-poppins">
      <label className="block text-[#383838] font-bold text-sm mb-2    tracking-wide">
        Imagens (até 10)
      </label>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        id="file"
        className="hidden"
      />

      <label
        htmlFor="file"
        className="flex items-center justify-center border-2 border-dashed border-[#008080] p-6 rounded-xl text-[#008080] font-bold cursor-pointer text-center transition-all duration-200 hover:bg-[#008080]/10"
      >
        Escolher imagens
      </label>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3 mt-4">
        {previews.map((img, i) => (
          <div
            key={i}
            className="relative w-full h-[100px] overflow-hidden rounded-xl shadow-sm group"
          >
            <img
              src={img.url || img.imagem}
              alt="preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <button
              type="button"
              onClick={() => removerImagem(i)}
              className="absolute top-1.5 right-1.5 bg-black/60 text-white border-none rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors hover:bg-black/80"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}