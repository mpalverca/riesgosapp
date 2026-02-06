import { useCallback, useState } from "react";

const url_recursos =
  "https://script.google.com/macros/s/AKfycbwzwffNvIYBtBgEMraYIbQ9hfWxVLdX488Y3Hle0INk9exQHgUYRu8Uwa6ou4H1s4Vl/exec";

export const useRecursos = () => {
  const [loadingRE, setLoading] = useState(false);
  const [errorRE, setError] = useState(null);
  const [dataRE, setData] = useState(null);
  const [countRE, setCount] = useState(0);

  const searchRE = useCallback(async (mtt, recursos) => {
   
    // Validaciones
    if (!mtt) {
      setError("Ingrese un número de MTT");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Primer fetch para buscar el MTT
      const response = await fetch(
        `${url_recursos}?MTT=${mtt}&hoja=${recursos}`,
      );
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
       console.log("Iniciando búsqueda de recursos con MTT:", mtt, recursos);
      if (data && data.data.length > 0) {
        // Tomar el primer elemento del array
        setCount(data.count);
        // Por ahora, usamos los datos del primer fetch
        setData(data.data);
      } else {
        setError(data.message || "MTT no encontrado");
      }
    } catch (err) {
      console.error("Error en searchRE:", err);
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setData(null);
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
