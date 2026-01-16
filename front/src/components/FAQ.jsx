import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import Subtitle from "./Subtitle";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "O que é a plataforma Rumo?",
      answer:
        "O Rumo é o seu guia digital completo para explorar Caraguatatuba. Conectamos turistas às melhores atrações, guias credenciados, eventos e gastronomia local, tudo em um só lugar para facilitar sua viagem.",
    },
    {
      question: "Como funcionam os roteiros automáticos?",
      answer:
        "Nossa inteligência cria itinerários personalizados baseados nos seus interesses (como praias, aventura, cultura ou gastronomia). Basta selecionar o que você gosta e geramos um plano de viagem ideal para você em segundos.",
    },
    {
      question: "Preciso pagar para usar o Rumo?",
      answer:
        "Não! O uso da plataforma para buscar atrações, criar roteiros e encontrar guias é totalmente gratuito para turistas e visitantes.",
    },
    {
      question: "Os guias turísticos são verificados?",
      answer:
        "Sim. Prezamos pela segurança e qualidade. Todos os guias cadastrados na plataforma passam por uma verificação de Cadastur e antecedentes para garantir uma experiência segura e profissional.",
    },
    {
      question: "Tenho um negócio ou sou guia, como posso me cadastrar?",
      answer:
        "É simples! Clique em 'Fazer Login' no topo da página, selecione a opção de cadastro e escolha entre 'Prestador de Serviço' ou 'Empresa'. Após o envio dos documentos, nossa equipe fará a validação do seu perfil.",
    },
  ];

  return (
    <section className="w-full py-20 px-5 flex justify-center bg-transparent font-poppins sm:py-10">
      <div className="w-full max-w-[800px] flex flex-col gap-10">
        <div className="text-left">
          <Subtitle className="underline font-semibold leading-tight text-[50px]">
            Dúvidas sobre o Rumo
          </Subtitle>
          <p className="text-[#64748b] mt-[30px] text-[1.1rem]">
            Entenda como podemos transformar sua experiência em Caraguatatuba.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`bg-white border rounded-[12px] overflow-hidden transition-all duration-300 cursor-pointer hover:border-[#cbd5e1] hover:shadow-sm ${
                activeIndex === index 
                ? "border-[#008080] shadow-[0_4px_12px_rgba(0,128,128,0.08)]" 
                : "border-[#e2e8f0]"
              }`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="p-6 flex justify-between items-center sm:p-5">
                <h3 className="text-[1.1rem] font-semibold text-[#1e293b] pr-5 leading-[1.5] sm:text-[1rem]">
                  {item.question}
                </h3>
                <span className={`text-[1rem] text-[#008080] transition-transform duration-300 flex items-center justify-center min-w-[24px] ${
                  activeIndex === index ? "rotate-45" : "rotate-0"
                }`}>
                  <FaPlus />
                </span>
              </div>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out sm:px-5 ${
                  activeIndex === index ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-[#475569] leading-[1.6] pb-6 m-0 text-[1rem]">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;