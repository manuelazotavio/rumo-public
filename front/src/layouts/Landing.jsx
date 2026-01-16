import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import layer1 from "../img/layer1-lp.png";
import layer2 from "../img/layer2-lp.png";
import Steps from "../components/Steps";
import stoAntonio from "../img/santo-antonio.png";
import Subtitle from "../components/Subtitle";
import ExploreCity from "../components/ExploreCity";
import Parceiros from "../components/Parceiros";
import img1 from "../img/carrossel-1.png";
import img2 from "../img/carrossel-2.png";
import img3 from "../img/carrossel-3.png";
import img4 from "../img/carrossel-4.png";
import img5 from "../img/carrossel-5.png";
import img6 from "../img/carrossel-6.png";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import PartnershipSection from "../components/PartnershipSection";

const Landing = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [img1, img2, img3, img4, img5, img6];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="font-poppins overflow-x-hidden">
      <div className="relative w-full h-[118vh] max-[600px]:h-[92vh] overflow-hidden flex flex-col justify-center">
        <Header className="bg-transparent absolute w-full z-20" />

        <div className="absolute top-0 left-0 w-full h-full z-0">
          <div
            className="flex h-full transition-transform duration-1000 ease-in-out"
            style={{
              width: `${images.length * 100}%`,
              transform: `translateX(-${
                currentIndex * (100 / images.length)
              }%)`,
            }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="h-full bg-cover bg-center"
                style={{
                  flex: `0 0 ${100 / images.length}%`,
                  backgroundImage: `url(${img})`,
                }}
              />
            ))}
          </div>
        </div>

        <main className="relative z-10 flex flex-col items-center justify-center h-full">
          {children}
        </main>

        <Steps
          className="mb-10 relative z-10"
          totalSteps={images.length}
          currentStep={currentIndex + 1}
          color="#fff"
          onStepClick={(step) => setCurrentIndex(step - 1)}
        />

        <img src={layer1} className="relative block w-full -mb-[1px]" alt="" />
      </div>

      <div
        style={{ "--bg-layer2": `url(${layer2})` }}
        className="relative w-full flex justify-center py-10 px-5 bg-transparent before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[image:var(--bg-layer2)] before:bg-cover before:z-[1]"
      >
        <div className="relative flex flex-row max-[1350px]:flex-col w-full max-w-[1200px] min-h-[450px] mt-[27px] bg-white z-[2] items-start">
          <div className="flex-1 p-8 flex flex-col justify-center z-[3]">
            <Subtitle className="underline text-[50px] font-semibold">
              Sobre a cidade
            </Subtitle>
            <p className="text-[24px] max-[600px]:text-[18px] mt-[1.2rem] text-text-dark leading-relaxed">
              Caraguatatuba é o destino perfeito para quem busca natureza,
              cultura e alegria em um só lugar! Entre o mar e a serra, a cidade
              encanta com suas praias paradisíacas, cachoeiras revigorantes e
              trilhas que levam ao paraíso. É o equilíbrio ideal entre descanso
              e diversão. Viva a energia caiçara, sinta o encanto e venha ser
              feliz em Caraguá!
            </p>
          </div>
          <div className="flex-1 w-full h-full max-[1350px]:h-[300px] overflow-hidden min-[1351px]:mt-[80px]">
            <img
              src={stoAntonio}
              alt="Santo Antônio Caraguatatuba"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <ExploreCity />
      <PartnershipSection />
      <Testimonials />
      <FAQ />
      <Parceiros />
      <Footer />
    </div>
  );
};

export default Landing;
