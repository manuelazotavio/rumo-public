import { useState } from "react";
import useUserLoggedStore from "../stores/userLoggedStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Auth({children}) {
  const navigate = useNavigate();

  const { isLogged } = useUserLoggedStore.getState();


  useEffect(() => {
    if (!isLogged) {
      navigate("/login-user");
    }
  }, [isLogged]);

  return children;
}
