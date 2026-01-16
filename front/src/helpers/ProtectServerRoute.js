import { useState } from "react";
import useUserLoggedStore from "../stores/userLoggedStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ServerAuth({children}) {
  const navigate = useNavigate();

  const admin = useUserLoggedStore((state) => state.admin);

  useEffect(() => {
    if (!admin) {
      navigate("/login-user");
    }
  }, [admin]);

  return children;
}