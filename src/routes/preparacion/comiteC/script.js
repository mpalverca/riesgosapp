import { useState, useCallback } from 'react';

export const useDetailSector = () => {
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
};