import { useCallback, useState } from "react";

const url_GetAll =
  "https://script.google.com/macros/s/AKfycbxvUNmwpdsC6f6x8KAWXMiTH1TtR0OcS9z3Ps1OyqkLOPeRzEmDl1E-p4Gg-IJJkkBT/exec"
  
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzj8eXN23mkkdZypf8yBayEMBA7Bt-MM0D_6Jp-34JxQCsg-8UkjZqM9nBoI6dw8nrK/exec";

  export const useGetUmapal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataU, setData] = useState(null);

  const get = useCallback(async (parroq, sector, tipe) => {
   
    // Validaciones
    if (!parroq) {
      setError("Ingrese una parroquia");
      return;
    }
    if (!sector) {
      setError("Ingrese un sector");
      return;
    }
    if (!tipe) {
      setError("Ingrese el tipo de consulta");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch(
        `${url_GetAll}?operation=read&filterBy=${parroq}&filterValue=${sector}`,
      );
      const data = await response.json();
      console.log("Datos MTT:", data);
      setData(data);
      //console.log("Datos MTT:", dataMtt);
    } catch (err) {
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);
const getAll = useCallback(async () => {
    // Validaciones
    
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch(
        `${url_GetAll}?operation=read`,
      );
      const data = await response.json();

      setData(data);
      //console.log("Datos MTT:", dataMtt);
    } catch (err) {
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  const post = useCallback(async (mtt, tipe, dPost) => {
    // Validaciones
    if (!mtt) {
      setError("Ingrese un mesa o grupo de trabajo");
      return;
    }
    if (!tipe) {
      setError("Ingrese el tipo de consulta");
      return;
    }
    if (!dPost) {
      setError("No existe información");
      return;
    }
  //  console.log(dPost)
    console.log("is print");
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch(
        `${url_GetAll}?mtt=${mtt}&sheet=${tipe}&tipo=post&data=${JSON.stringify(dPost)}`,
      );
      const data = await response.json();
      setData(data);

      //const data = await response.json();
      //setData(data);
      //console.log("Datos MTT:", dataMtt);
    } catch (err) {
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  const edit = useCallback(async (mtt, tipe, row, dEdit) => {
    // Validaciones
    if (!mtt) {
      setError("Ingrese un mesa o grupo de trabajo");
      return;
    }
    if (!tipe) {
      setError("Ingrese el tipo de consulta");
      return;
    }
    if (!dEdit) {
      setError("No existe información");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch(
        `${url_GetAll}?mtt=${mtt}&sheet=${tipe}&tipo=edit&row=${row}&data=${JSON.stringify(dEdit)}`,
      );
      const data = await response.json();
      setData(data);
      console.log("Datos MTT:", data);
    } catch (err) {
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);
  const deleteRow = useCallback(async (mtt, tipe, row) => {
    // Validaciones
    if (!mtt) {
      setError("Ingrese un mesa o grupo de trabajo");
      return;
    }
    if (!tipe) {
      setError("Ingrese el tipo de consulta");
      return;
    }
    if (!row) {
      setError("Ingrese Fila");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch(
        `${url_GetAll}?mtt=${mtt}&sheet=${tipe}&tipo=delete&row=${row}`,
      );
      
    } catch (err) {
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
   loading,
    error,
   dataU,
     get,
     getAll,
   clear,
    post,
    edit,
    deleteRow,
  };
};

// https://script.google.com/macros/s/AKfycbw21IFT6ijZNQocKRE-00-td6goh0fp2fDhmbzwXMwuyyptuXCQOm7JTbeNxB0y4lf0Fg/exec?mtt=MTT4&sheet=Afectaciones&tipo=post&data="{"detalle":"10/02/2026","desc":"Falla de fibra"}";
// https://script.google.com/macros/s/AKfycbw21IFT6ijZNQocKRE-00-td6goh0fp2fDhmbzwXMwuyyptuXCQOm7JTbeNxB0y4lf0Fg/exec?mtt=MTT1&sheet=Acciones&tipo=edit&row=6&data={"sector":"aqui se prueba el estado","event":"dos ojos","ubi":"[-fdffsf,fsfsfsf]"}
// https://script.google.com/macros/s/AKfycbw21IFT6ijZNQocKRE-00-td6goh0fp2fDhmbzwXMwuyyptuXCQOm7JTbeNxB0y4lf0Fg/exec?mtt=MTT4&sheet=Afectaciones&tipo=post&data={"sector":"aqui se prueba el estado","event":"dos ojos","ubi":"[-fdffsf,fsfsfsf]"}



export const parseCoordinates = (coordString, type = 'point') => {
  if (!coordString || typeof coordString !== 'string') {
    return null;
  }

  // Limpiar y dividir el string
  const cleanStr = coordString.trim().replace(/\s+/g, '');
  const values = cleanStr.split(',').map(Number);
  
  // Filtrar valores inválidos
  const validValues = values.filter(v => !isNaN(v) && isFinite(v));
  
  if (validValues.length === 0) return null;
  
  // Agrupar en pares [lat, lng]
  const coords = [];
  for (let i = 0; i < validValues.length; i += 2) {
    if (i + 1 < validValues.length) {
      coords.push([validValues[i], validValues[i + 1]]);
    }
  }
  
  if (coords.length === 0) return null;
  
  // Si es tipo punto y solo hay un par de coordenadas, devolver el punto
  if (type === 'point' && coords.length === 1) {
    return coords[0]; // [lat, lng]
  }
  
  // Si es tipo línea o múltiples puntos
  if (type === 'line' && coords.length > 1) {
    return coords; // [[lat1,lng1], [lat2,lng2], ...]
  }
  
  // Por defecto, devolver el primer punto si solo hay uno
  return coords.length === 1 ? coords[0] : coords;
};


export const dataSector = async () => {
  try {
    // setLoading(true);
    let url = `${SCRIPT_URL}?action=getData`;
    const response = await fetch(url);
    const result = await response.json();
    if (result.status === "success") {
    } else {
      console.error("Error al obtener datos");
    }
    return result.features;
  } catch (error) {
    console.error("Error:", error);
    alert(`error: `, error);
  } finally {
    // setLoading(false);
  }
};