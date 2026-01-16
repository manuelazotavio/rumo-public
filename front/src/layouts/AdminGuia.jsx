import React, { useState, useEffect } from "react";
import SidebarGuia from "../components/SidebarGuia.jsx";
import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";

const AdminGuia = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen w-full font-poppins overflow-hidden bg-white">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 relative overflow-hidden h-[calc(100vh-80px)]">
        <SidebarGuia 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
          isMobile={isMobile}
        />
        
        <main className="flex-1 overflow-auto scrollbar-hide">
          <Outlet context={{ sidebarOpen, setSidebarOpen }} />
        </main>
      </div>
    </div>
  );
};

export default AdminGuia;