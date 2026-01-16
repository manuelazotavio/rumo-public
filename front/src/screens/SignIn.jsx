import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const SignIn = () => {
  const navigate = useNavigate();

  return (
    <div className="font-poppins flex flex-col min-h-screen bg-white">
      <div className="w-full h-36 flex items-center justify-center px-4 bg-[#008080] shadow-md text-center">
        <h3 className="text-white text-xl md:text-2xl font-bold leading-tight">
          Salve seus destinos ou promova seu negócio.
        </h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-5 gap-12">
        <div className="text-center space-y-2">
          <h2 className="text-[#383838] text-2xl font-bold">Boas-vindas ao Rumo</h2>
          <p className="text-gray-500">Escolha como deseja criar sua conta abaixo:</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
          <div className="flex-1 group">
            <div className="p-1 rounded-2xl transition-all duration-300 group-hover:bg-[#008080]/10">
              <Button
                title="Cadastrar Usuário"
                onClick={() => navigate("/cadastro/usuario")}
                className="w-full h-20 text-lg shadow-sm"
              />
              <p className="text-xs text-center mt-3 text-gray-400">
                Para turistas que desejam criar roteiros e explorar.
              </p>
            </div>
          </div>

          <div className="flex-1 group">
            <div className="p-1 rounded-2xl transition-all duration-300 group-hover:bg-[#008080]/10">
              <Button
                title="Cadastrar Empresa"
                onClick={() => navigate("/cadastro/empresa")}
                className="w-full h-20 text-lg shadow-sm"
              />
              <p className="text-xs text-center mt-3 text-gray-400">
                Para guias e estabelecimentos locais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;