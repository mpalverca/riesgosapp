import { useCallback, useState } from "react";

const url_members =
  "https://script.google.com/macros/s/AKfycbweMHL4h6Umb6DcsdksJHOOrVBPDiFiJg7ioa9DvqYx5brYnkG6_AOk5eX_D1s0N838oA/exec";

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
      const response = await fetch(`${url_members}?mtt=${mtt}`);

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
