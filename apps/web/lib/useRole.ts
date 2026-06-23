"use client"; 
import { useEffect, useState } from "react"; 
export default function useRole() {
    const [role, setRole] = useState("");
     const [loading, setLoading] = useState(true); 
     useEffect(() => {
        const savedRole = localStorage.getItem("role");
        setRole(savedRole || "");
        setLoading(false); 
    }, []); 
    return {
         role, 
         loading,
         }; 
        }