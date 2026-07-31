"use client";

import { useEffect, useState } from "react";
import { getRole } from "./session";

export default function useRole() {

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadRole = () => {
      setRole(getRole() || "");
      setLoading(false);
    };

    loadRole();

    window.addEventListener("focus", loadRole);

    return () => {
      window.removeEventListener("focus", loadRole);
    };

  }, []);

  return {
    role,
    loading,
  };

}