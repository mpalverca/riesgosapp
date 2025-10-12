import { useState, useEffect } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbx4E9blUYb95cTL5SeN4BXOnsiwJmCDSHONCiJMtPEd7KGIf_V9AhEKvd2WCoE7RMnj/exec";
const API_pugs =
  "https://script.google.com/macros/s/AKfycbxQgMzvnEs5LBykZAqSfXv8opFSY9z8HSbiuEjlzh6gzOVpNO9jEQesSs6R6ezUtRij/exec";
const sector_url = `https://script.google.com/macros/s/AKfycbzj8eXN23mkkdZypf8yBayEMBA7Bt-MM0D_6Jp-34JxQCsg-8UkjZqM9nBoI6dw8nrK/exec`;

export const useApConst = (parroquia, sector = "") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // No hacer nada si no hay parroquia seleccionada
    if (!parroquia || parroquia.trim() === "") {
      setData(null);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null); // Limpiar datos anteriores

      try {
        console.log("🔍 Fetching data for:", { parroquia, sector });

        const params = new URLSearchParams();
        params.append("parroquia", parroquia);
        if (sector && sector.trim() !== "") {
          params.append("sector", sector);
        }

        const url = `${API_URL}?${params.toString()}`;
        console.log("📡 URL:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log("📦 Response data:", result);

        if (result.error) {
          throw new Error(result.error);
        }

        setData(result);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parroquia, sector]);

  return { data, loading, error };
};

export const useClaveData = (parroquia, sector = "", clave) => {
  const [claveData, setData] = useState(null);
  const [claveL, setLoading] = useState(false);
  const [claveE, setError] = useState(null);

  useEffect(() => {
    // No hacer nada si no hay parroquia seleccionada
    if (!parroquia || parroquia.trim() === "") {
      setData(null);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null); // Limpiar datos anteriores

      try {
        console.log("🔍 Fetching data for:", { parroquia, sector, clave });

        const params = new URLSearchParams();
        params.append("parroquia", parroquia);
       /*  if (sector && sector.trim() !== "") {
          params.append("sector", sector);
        } */
        params.append("clave_cata", clave);
        const url = `${API_pugs}?${params.toString()}`;
        const response = await fetch(url);
        console.log(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log("📦 Response data:", result);

        if (result.error) {
          throw new Error(result.error);
        }

        setData(result);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parroquia, sector]);

  return { claveData, claveL, claveE };
};

// Cargar datos GeoJSON solo cuando se solicite
export const useSector = (parroquia, sector = "") => {
  const [sectorData, setData] = useState(null);
  const [sectorL, setLoading] = useState(false);
  const [sectorE, setError] = useState(null);

  useEffect(() => {
    // Si tu API solo usa SECTOR, entonces solo validamos sector
    if (!sector || sector.trim() === "") {
      setData(null);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const params = new URLSearchParams();

        // Solo el parámetro que necesita tu API
        params.append("SECTOR", sector);

        const url = `${sector_url}?${params.toString()}`;
        console.log("📡 Fetching from:", url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log("📦 Datos recibidos:", result);

        if (result.error) {
          throw new Error(result.error);
        }

        if (!result || typeof result !== "object") {
          throw new Error("Formato de respuesta inválido");
        }

        setData(result);
      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sector]); // Solo dependemos de sector

  return {
    sectorData,
    sectorL,
    sectorE,
  };
};
