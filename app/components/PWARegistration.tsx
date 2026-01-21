"use client";

import { useEffect } from "react";

export default function PWARegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const register = () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration.scope);
          })
          .catch((error) => {
            console.error("SW registration failed: ", error);
          });
      };

      if (document.readyState === "complete") {
        register();
      } else {
        window.addEventListener("load", register);
        return () => window.removeEventListener("load", register);
      }
    }
  }, []);

  return null;
}
