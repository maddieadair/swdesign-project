// by Hung Trinh

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./modal.js";

export const useSessionExpirationChecker = () => {
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleUserInteractions = () => {
    setLastInteraction(Date.now());
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleUserInteractions);
    document.addEventListener("click", handleUserInteractions);
    document.addEventListener("keydown", handleUserInteractions);

    return () => {
      document.removeEventListener("mousemove", handleUserInteractions);
      document.removeEventListener("click", handleUserInteractions);
      document.removeEventListener("keydown", handleUserInteractions);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkSessionExpiration = async () => {
      const currentTime = Date.now();
      const inactivityDuration = currentTime - lastInteraction;
      const sessionTimeout = 1 * 60 * 1000; // 1 minutes in milliseconds

      if (inactivityDuration >= sessionTimeout && isMounted) {
        console.log("Session Timed out!");
        //fetch logout api
        try {
          const response = await fetch("http://localhost:3001/api/logout", {
            method: "POST",
            credentials: "include",
          });

        //   //display modal message
        //   setModalMessage("Session timed out!");
        //   setOpenModal(true);

          if (!response.ok) {
            throw new Error("There was a network error!");
          }

          //navigate to login page
          navigate("/?showModal=true");
        } catch (error) {
          console.log("There was an error fetching:", error);
        }
      } else {
        const timer = setTimeout(
          checkSessionExpiration,
          sessionTimeout - inactivityDuration
        );
        return () => clearTimeout(timer);
      }
    };

    checkSessionExpiration();

    return () => {
      isMounted = false;
    };
  }, [lastInteraction, navigate]);
};
