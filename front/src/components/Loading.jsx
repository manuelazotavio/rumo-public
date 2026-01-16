import React, { useState, useEffect, useRef } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const loadingRef = useRef(null);

  useEffect(() => {
    if (loadingRef.current) loadingRef.current.focus();

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={loadingRef} 
      tabIndex={-1} 
      className="w-full min-h-[200px] flex flex-col justify-center items-center gap-4 outline-none font-poppins"
    >
      <p className="text-[#383838] font-semibold text-lg animate-pulse">
        Aguarde um momento...
      </p>
      
      <div className="w-full max-w-[300px] h-2 bg-gray-200 rounded-full overflow-hidden shadow-sm">
        <div
          className="h-full bg-[#008080] transition-[width] duration-100 ease-linear rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}