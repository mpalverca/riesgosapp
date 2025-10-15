import { useState, useEffect } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbx4E9blUYb95cTL5SeN4BXOnsiwJmCDSHONCiJMtPEd7KGIf_V9AhEKvd2WCoE7RMnj/exec";
const predio_url ="https://script.google.com/macros/s/AKfycbytTtS5g25PCnGLqfTgV_iFPCyur5FqEVGk2FV0s7x-UW6iV7ue-BcI0rGiWDRMPrNL/exec"
const sector_url = `https://script.google.com/macros/s/AKfycbzj8eXN23mkkdZypf8yBayEMBA7Bt-MM0D_6Jp-34JxQCsg-8UkjZqM9nBoI6dw8nrK/exec`;
const aass_url= "https://script.google.com/macros/s/AKfycbw8zQDRv3etsFHzVuo6Sjcy4gr5h-beXg4iythHK3z6F5gxLNq2PKUdKJrQK6Nc0P6M/exec"
const vial_url="https://script.google.com/macros/s/AKfycbw7Z13dAukJfnOiMy5rArb7sOkV9f2p2FEQkPTEiYm7bhB0b83mQXHb8FenYr5ILtxQ/exec"

export const useApConst = (parroquia, sector = "") => {
  const [aptcData, setData] = useState(null);
  const [aptcL, setLoading] = useState(false);
  const [aptcE, setError] = useState(null);

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

  return { aptcData,  aptcL, aptcE };
};

export const useClaveData = (parroquia, sector = "", clave) => {
  const [claveData, setData] = useState(null);
  const [claveL, setLoading] = useState(false);
  const [claveE, setError] = useState(null);

  useEffect(() => {
    // Validar que tengamos parroquia Y clave
    if (!parroquia || parroquia.trim() === "" || !clave || clave.trim() === "") {
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
        params.append("parroquia", parroquia);
        if (sector && sector.trim() !== "") {
          params.append("sector", sector);
        }
        params.append("clave_cata", clave);

        const url = `${predio_url}?${params.toString()}`;
  
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        
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
  }, [parroquia, sector, clave]);

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
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
   
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

export const useAASS = (parroquia, sector = "") => {
  const [aassData, setData] = useState(null);
  const [aassL, setLoading] = useState(false);
  const [aassE, setError] = useState(null);

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
        params.append("sector", sector);

        const url = `${aass_url}?${params.toString()}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
   
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
    aassData,
    aassL,
    aassE,
  };
};

export const useVial= (parroquia, sector = "") => {
  const [vialData, setData] = useState(null);
  const [vialL, setLoading] = useState(false);
  const [vialE, setError] = useState(null);

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
        params.append("sector", sector);

        const url = `${vial_url}?${params.toString()}`;
        
        const response = await fetch(url);
        console.log("url",url)
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
   
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
    vialData,
    vialL,
    vialE,
  };
};