import { useState, useCallback } from "react";

const URL_COE =
  "https://script.google.com/macros/s/AKfycbywI8U5EadQCy4-5m4v7hDnCzbLI1rUYNuzd2eDobYrr66rRTqef6zZYNzzQfb2HAENFA/exec";
const url_members =
  "https://script.google.com/macros/s/AKfycbxl5aKBsOJ5J3XlAjUGcCSZtmFDTTavkJWVOBuwp-a8op3k8u9I2Aa_uXU28fGVjNIKNA/exec";
export const useCoeData = () => {
  const [coeData, setCoeData] = useState(null);
  const [coeLoading, setLoading] = useState(false);
  const [coeError, setError] = useState(null);
  const [coeSheets, setSheets] = useState([]);

  // 1. Obtener lista de todas las hojas disponibles
  const getSheets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `${URL_COE}?action=getSheets`;
      console.log("📡 Obteniendo lista de hojas...");
      console.log("URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("📦 Resultado getSheets:", result);

      if (!result.success) {
        throw new Error(result.error || "Error al obtener hojas");
      }

      setSheets(result.data.sheets || []);
      return result.data.sheets || [];
    } catch (error) {
      console.error("❌ Error en getSheets:", error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Buscar datos en una hoja específica
  const getSheetData = useCallback(async (sheetName, filters = {}) => {
    if (!sheetName || sheetName.trim() === "") {
      setError("El nombre de la hoja no puede estar vacío");
      return null;
    }

    setLoading(true);
    setError(null);
    setCoeData(null);

    try {
      // Construir URL con parámetros
      const params = new URLSearchParams();
      params.append("action", "getSheetData");
      params.append("sheetName", sheetName);

      // Agregar filtros si existen
      if (filters.search) {
        params.append("search", filters.search);
      }
      if (filters.column) {
        params.append("column", filters.column);
      }

      const url = `${URL_COE}?${params.toString()}`;
      console.log("🔍 Buscando en hoja:", sheetName);
      console.log("📡 URL:", url);
      console.log("🔎 Filtros:", filters);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("📦 Resultado getSheetData:", result);

      if (!result.success) {
        throw new Error(result.error || "Error al obtener datos");
      }

      setCoeData(result.data);
      return result.data;
    } catch (error) {
      console.error("❌ Error en getSheetData:", error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Buscar por término en todas las hojas MTT/GT
  const searchInAllSheets = useCallback(async (searchTerm, sheetTypes = []) => {
    if (!searchTerm || searchTerm.trim() === "") {
      setError("El término de búsqueda no puede estar vacío");
      return [];
    }

    setLoading(true);
    setError(null);
    setCoeData(null);

    try {
      const url = `${URL_COE}?action=search&term=${encodeURIComponent(searchTerm)}`;
      console.log("🔍 Buscando en todas las hojas:", searchTerm);
      console.log("📡 URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("📦 Resultado búsqueda:", result);

      if (!result.success) {
        throw new Error(result.error || "Error en la búsqueda");
      }

      setCoeData(result.data);
      return result.data;
    } catch (error) {
      console.error("❌ Error en searchInAllSheets:", error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. Agregar nueva fila
  const addRow = useCallback(async (sheetName, rowData) => {
    if (!sheetName || !rowData) {
      setError("Datos incompletos");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const url = URL_COE;
      console.log("➕ Agregando fila a:", sheetName);
      console.log("📝 Datos:", rowData);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "addRow",
          sheetName: sheetName,
          rowData: JSON.stringify(rowData),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("📦 Resultado addRow:", result);

      if (!result.success) {
        throw new Error(result.error || "Error al agregar fila");
      }

      return result.data;
    } catch (error) {
      console.error("❌ Error en addRow:", error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 5. Actualizar fila existente
  const updateRow = useCallback(async (sheetName, rowId, rowData) => {
    if (!sheetName || !rowId || !rowData) {
      setError("Datos incompletos");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const url = URL_COE;
      console.log("✏️ Actualizando fila:", rowId, "en", sheetName);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "updateRow",
          sheetName: sheetName,
          rowId: rowId,
          rowData: JSON.stringify(rowData),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("📦 Resultado updateRow:", result);

      if (!result.success) {
        throw new Error(result.error || "Error al actualizar fila");
      }

      return result.data;
    } catch (error) {
      console.error("❌ Error en updateRow:", error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 6. Filtrar hojas por tipo
  const filterSheetsByType = useCallback(
    (typeFilter = "") => {
      if (!typeFilter) return coeSheets;

      const filterLower = typeFilter.toLowerCase();

      return coeSheets.filter((sheet) => {
        const sheetName = sheet.name.toLowerCase();

        if (filterLower === "mtt") {
          return sheetName.includes("mtt");
        } else if (filterLower === "gt") {
          return sheetName.includes("gt");
        } else if (filterLower === "afectaciones") {
          return sheetName.includes("afectaciones");
        } else if (filterLower === "acciones") {
          return sheetName.includes("acciones");
        } else if (filterLower === "todas") {
          return true;
        } else {
          return sheetName.includes(filterLower);
        }
      });
    },
    [coeSheets],
  );

  // 7. Limpiar datos
  const clearData = useCallback(() => {
    setCoeData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    // Estados
    coeData,
    coeLoading,
    coeError,
    coeSheets,

    // Funciones principales
    getSheets,
    getSheetData,
    searchInAllSheets,
    addRow,
    updateRow,
    filterSheetsByType,
    clearData,

    // Funciones de conveniencia
    getMTTAfectaciones: () => filterSheetsByType("MTTAfectaciones"),
    getMTTAcciones: () => filterSheetsByType("MTTAcciones"),
    getGTAfectaciones: () => filterSheetsByType("GTAfectaciones"),
    getGTAcciones: () => filterSheetsByType("GTAcciones"),
  };
};

export const useSearchMembers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [member, setMember] = useState(null);
  const [apoyo, setApoyo] = useState(null);

  const search = useCallback(async (ci) => {
    // Validaciones
    if (!ci) {
      setError("Ingrese un número de cédula");
      return;
    }
    console.log("Buscando CI:", ci);

    const ciNumber = ci.toString().trim();
    if (ciNumber.length < 6) {
      setError("El CI debe tener al menos 6 dígitos");
      return;
    }

    setLoading(true);
    setError(null);
    setMember(null);

    try {
      const response = await fetch(`${url_members}?ci=${ciNumber}`);

      const data = await response.json();

      const responseMtt = await fetch(`${url_members}?mtt=${data.data[0].mtt}`);
      const dataMtt = await responseMtt.json();

      //console.log("Datos MTT:", dataMtt);

      if (!response.ok) {
        throw new Error(data.error || "Error en la consulta");
      }

      if (data.success && data.found && data.data) {
        // Si data es array, tomar el primer elemento
        const memberData = Array.isArray(data.data) ? data.data[0] : data.data;
        setMember(memberData);
        setApoyo(dataMtt.data)
      } else if (data.success && !data.found) {
        setError(data.message || "CI no encontrado");
      } else {
        setError(data.message || "Error desconocido");
      }
    } catch (err) {
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setMember(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    member,
    apoyo,
    search,
    clear,
    found: !!member,
    nombre: member?.miembros || member?.nombre,
    cargo: member?.cargo_COE || member?.cargo,
    mtt: member?.mtt,
  };
};
