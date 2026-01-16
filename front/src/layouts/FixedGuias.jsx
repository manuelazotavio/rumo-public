import Header from "../components/Header";
import Footer from "../components/Footer";
import Title from "../components/Title";
import fixedBG from "../img/fixed-bg.png";

const FixedGuias = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full font-poppins">
      <div className="relative h-[220px] md:h-[280px] w-full overflow-hidden flex flex-col">
        <img 
          src={fixedBG} 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ zIndex: 0 }} 
          alt="Background" 
        />
        
        <div className="absolute inset-0 bg-black/10" style={{ zIndex: 1 }}></div>

        <div className="relative" style={{ zIndex: 30 }}>
          <Header className="!bg-transparent" />
        </div>

        <div className="absolute bottom-8 left-10 md:left-100 w-full z-20" style={{ zIndex: 20 }}>
          <Title className="!text-white !m-0 !text-4xl md:!text-6xl !text-left drop-shadow-md">
            Encontre seu guia
          </Title>
        </div>
      </div>

      <main className="flex-1 relative bg-white">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default FixedGuias;