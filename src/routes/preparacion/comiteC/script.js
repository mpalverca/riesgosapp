import { useState, useCallback } from 'react';

/* export const useDetailSector = () => {
  const [sectorData, setSectorData] = useState(null);
  const [sectorLoading, setLoading] = useState(false);
  const [sectorError, setError] = useState(null);

  const detailSector = useCallback(async (barrio) => {
    // Validación inicial
    if (!barrio || barrio.trim() === '') {
      setError('El barrio no puede estar vacío');
      setSectorData(null);
      return null;
    }

    setLoading(true);
    setError(null);
    setSectorData(null);

    try {
      const url = `${sector_info}?barrio=${encodeURIComponent(barrio)}`;
      console.log('🔍 Buscando sector:', barrio);
      console.log('📡 URL:', url);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('📦 Resultado:', result);

      // Verificar la estructura de la respuesta
      if (result.error) {
        throw new Error(result.error);
      }

      // Si tu API usa "status": "success", verificar
      if (result.status && result.status !== "success") {
        throw new Error(`Error del servidor: ${result.message || 'Estado no exitoso'}`);
      }

      setSectorData(result);
      return result;

    } catch (error) {
      console.error('❌ Error en detailSector:', error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // sector_info debe estar definida en el scope

  // Función para limpiar datos
  const clearSectorData = useCallback(() => {
    setSectorData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    sectorData,     // Datos del sector
    sectorLoading,  // Estado de carga (true/false)
    sectorError,    // Error si ocurre
    detailSector,   // Función para buscar
    clearSectorData // Función para limpiar
  };
}; */

/* export const useComitData=()=>{
   const [comiteData, setComData] = useState(null);
  const [comLoading, setComLoading] = useState(false);
  const [comError, setComError] = useState(null);

  const detailSector = useCallback(async (sector) => {
    // Validación inicial
    if (!sector || sector.trim() === '') {
      setComError('El barrio no puede estar vacío');
      setComData(null);
      return null;
    }

    setComLoading(true);
    setComError(null);
    setComData(null);

    try {
      const url = `${sector_info}?barrio=${encodeURIComponent(sector)}`;
      console.log('🔍 Buscando sector:', sector);
      console.log('📡 URL:', url);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('📦 Resultado:', result);

      // Verificar la estructura de la respuesta
      if (result.error) {
        throw new Error(result.error);
      }

      // Si tu API usa "status": "success", verificar
      if (result.status && result.status !== "success") {
        throw new Error(`Error del servidor: ${result.message || 'Estado no exitoso'}`);
      }

      setComData(result);
      return result;

    } catch (error) {
      console.error('❌ Error en detailSector:', error);
      setComError(error.message);
      return null;
    } finally {
      setComLoading(false);
    }
  }, []); // sector_info debe estar definida en el scope

  // Función para limpiar datos
  const clearSectorData = useCallback(() => {
    setComData(null);
    setComError(null);
    setComLoading(false);
  }, []);

  return {
    sectorData: comiteData,     // Datos del sector
    sectorLoading: comLoading,  // Estado de carga (true/false)
    sectorError: comError,    // Error si ocurre
    detailSector,   // Función para buscar
    clearSectorData // Función para limpiar
  };
} */


export const useDetailSector = () => {
  const [sectorD, setSectorData] = useState(null);
  const [sLoading, setLoading] = useState(false);
  const [sError, setError] = useState(null);
  const sector_info =
    "https://script.google.com/macros/s/AKfycbw7vtu_OvQBjpIkqpBqm-X4cG2PMfkkRCQRHQPyIENrn3za_BAdBwoWqLBZSAJWuFo7/exec";

  const detailSector = async (barrio) => {
    if (!barrio || barrio.trim() === "") {
      setError("El barrio no puede estar vacío");
      return null;
    }

    setLoading(true);
    setError(null);
    setSectorData(null);

    try {
      const url = `${sector_info}?barrio=${encodeURIComponent(barrio)}`;
      //console.log("🔍 Buscando datos para barrio:", barrio);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
     // console.log("📦 Datos recibidos:", result);

      if (result.error) {
        throw new Error(result.error);
      }

      setSectorData(result);
      return result;
    } catch (err) {
      // console.error("❌ Error en detailSector:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearSectorData = () => {
    setSectorData(null);
    setError(null);
    setLoading(false);
  };

  return {
    sectorD,
    sLoading,
     sError,
    detailSector,
    clearSectorData,
  };
};