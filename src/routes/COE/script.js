import { useState, useCallback } from "react";
const url_members =
  "https://script.google.com/macros/s/AKfycbxl5aKBsOJ5J3XlAjUGcCSZtmFDTTavkJWVOBuwp-a8op3k8u9I2Aa_uXU28fGVjNIKNA/exec";

const url_GetAll =
  "https://script.google.com/macros/s/AKfycbw21IFT6ijZNQocKRE-00-td6goh0fp2fDhmbzwXMwuyyptuXCQOm7JTbeNxB0y4lf0Fg/exec";

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
        setApoyo(dataMtt.data);
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

export const useGetInfo = () => {
  const [loadingGet, setLoading] = useState(false);
  const [errorGet, setError] = useState(null);
  const [dataGet, setData] = useState(null);

  const searchGet = useCallback(async (mtt, tipe) => {
    console.log(mtt,tipe)
    // Validaciones
    if (!mtt) {
      setError("Ingrese un mesa o grupo de trabajo");
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
        `${url_GetAll}?mtt=${mtt}&sheet=${tipe}&tipo=read`,
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

  const clearGet = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loadingGet,
    errorGet,
    dataGet,
    searchGet,
    clearGet,
  };
};
