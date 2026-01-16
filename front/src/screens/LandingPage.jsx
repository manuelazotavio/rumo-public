import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import FilterModal from "../components/FilterModal";
import Title from "../components/Title";
import API_URL from "../config";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);


  const openFilters = () => setShowFilters(true);
  const closeFilters = () => setShowFilters(false);

  const handleSaveFilters = (filters) => {
    navigate("/filtrados", { state: { filters } });
  };

  return (
    <>
      <div className="flex-1 flex flex-col justify-between items-center w-full py-10 box-border font-poppins">
        <div className="flex flex-col justify-center items-center flex-1">
          <Title className="text-white mb-4 text-8xl md:text-9xl max-[600px]:!text-[40px]">
            Caraguatatuba
          </Title>
          <Button
            onClick={openFilters}
            variant="button-lg"
            title="Monte seu roteiro"
            others="w-full mt-2.5 !bg-white !text-[#008080] font-bold !py-4 rounded-2xl shadow-lg !text-[25px] max-[600px]:max-w-[300px] max-[600px]:!text-[22px] hover:!bg-gray-100 transition-colors"
          />
        </div>
      </div>

      {showFilters && (
        <FilterModal onClose={closeFilters} onSave={handleSaveFilters} />
      )}
    </>
  );
};

export default LandingPage;
