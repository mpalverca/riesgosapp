import { useCallback, useState } from "react";

const url_afec =
  "https://script.google.com/macros/s/AKfycbweMHL4h6Umb6DcsdksJHOOrVBPDiFiJg7ioa9DvqYx5brYnkG6_AOk5eX_D1s0N838oA/exec";
const url_acciones =
  "https://script.google.com/macros/s/AKfycbwuJw9VVDjpJH5z2NATNCezVSanYKmVj2FaCIsDbKnqo9Wk9dplYEh3enSRUsF7P4rmpA/exec";
const url_recursos =
  "https://script.google.com/macros/s/AKfycbzSNBm33QUUvS9gGctYCupQRm_w-K5XoXXh8npurlXUKK7cIdPd577I2GasY_ElcMkeWA/exec";

export const useAfectaciones = () => {
  const [loadingAF, setLoading] = useState(false);
  const [errorAF, setError] = useState(null);
  const [dataAF, setDataAF] = useState(null);
  const [countAF, setCount] = useState(0);

  const searchAF = useCallback(async (mtt) => {
    // Validaciones
    if (!mtt) {
      setError("Ingrese un número de MTT");
      return;
    }

    console.log("Buscando MTT:", mtt);

    setLoading(true);
    setError(null);
    setDataAF(null);

    try {
      // Primer fetch para buscar el MTT
      const response = await fetch(`${url_afec}?mtt=${mtt}`);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Error en la consulta");
      }

      if (data.data && data.data.length > 0) {
        // Tomar el primer elemento del array
        const memberData = data.data;
        setCount(data.count);
        // Por ahora, usamos los datos del primer fetch
        setDataAF(memberData);
      } else {
        setError(data.message || "MTT no encontrado");
      }
    } catch (err) {
      console.error("Error en searchAF:", err);
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setDataAF(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loadingAF,
    errorAF,
    dataAF,
    countAF,
    searchAF,
    clear,
  };
};

export const useAcciones = () => {
  const [loadingAC, setLoading] = useState(false);
  const [errorAC, setError] = useState(null);
  const [dataAC, setDataAC] = useState(null);
  const [countAC, setCount] = useState(0);

  const searchAC = useCallback(async (mtt, type) => {
    // Validaciones
    if (!mtt) {
      setError("Ingrese un número de MTT");
      return;
    }
    setLoading(true);
    setError(null);
    setDataAC(null);

    try {
      // Primer fetch para buscar el MTT
      const response = await fetch(`${url_acciones}?mtt=${mtt}&tipo=${type}`);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error en la consulta");
      }

      if (data.data && data.data.length > 0) {
        // Tomar el primer elemento del array
        const memberData = data.data;
        setCount(data.count);
        // Por ahora, usamos los datos del primer fetch
        setDataAC(memberData);
      } else {
        setError(data.message || "MTT no encontrado");
      }
    } catch (err) {
      console.error("Error en searchAF:", err);
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setDataAC(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loadingAC,
    errorAC,
     dataAC,
   countAC,
    searchAC,
    clear,
  };
};

export const useRecursos = () => {
  const [loadingRE, setLoading] = useState(false);
  const [errorRE, setError] = useState(null);
  const [dataRE, setDataAC] = useState(null);
  const [countRE, setCount] = useState(0);

  const searchRE = useCallback(async (mtt, type) => {
    // Validaciones
    if (!mtt) {
      setError("Ingrese un número de MTT");
      return;
    }
    setLoading(true);
    setError(null);
    setDataAC(null);

    try {
      // Primer fetch para buscar el MTT
      const response = await fetch(`${url_recursos}?mtt=${mtt}&tipo=${type}`);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Error en la consulta");
      }

      if (data.data && data.data.length > 0) {
        // Tomar el primer elemento del array
        const memberData = data.data;
        setCount(data.count);
        // Por ahora, usamos los datos del primer fetch
        setDataAC(memberData);
      } else {
        setError(data.message || "MTT no encontrado");
      }
    } catch (err) {
      console.error("Error en searchAF:", err);
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setDataAC(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
     loadingRE,
     errorRE,
     dataRE,
   countRE,
    searchRE,
    clear,
  };
};