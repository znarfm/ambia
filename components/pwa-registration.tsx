"use client";

import { useEffect } from "react";

export function PWARegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Serwist SW registered:", registration.scope);
        })
        .catch((error) => {
          console.error("Serwist SW registration failed:", error);
        });
    }
  }, []);

  return null;
}
