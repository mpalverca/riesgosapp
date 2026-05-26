import { useCallback, useState } from "react";

const url_GetAll =
  "https://script.google.com/macros/s/AKfycbx1UVVYS_W1vQWpFegqOSrQZQqWySeiaFZLTciFbRZYGE2uBOBR7OoTLVFesa4Jomfm/exec";

export const useInforComite = () => {
  const [loadingGet, setLoading] = useState(false);
  const [errorGet, setError] = useState(null);
  const [dataC, setData] = useState(null);

  const read = useCallback(async (tipo, sheet, comite) => {
    // Validaciones
    if (!tipo) {
      setError("Ingrese el tipo de busqueda");
      return;
    }
    if (!sheet) {
      setError("Ingrese un de hoja");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      let response = null;
      console.log(sheet)
      if (sheet === "comite") {
        console.log(sheet)
        console.log("is print");
        response = await fetch(
          `${url_GetAll}?tipo=${tipo}&sheet=${sheet}&comite=${comite}`,
        );
      }

      const data = await response.json();
      console.log("Datos MTT:", data);
      setData(data);
      //console.log("Datos MTT:", dataMtt);
    } catch (err) {
      console.log(err.menssage);
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
        `${url_GetAll}?mtt=${mtt}&sheet=${tipe}&tipo=edit&row=${row}$data=${dEdit}`,
      );
      //const data = await response.json();
      //setData(data);
      //console.log("Datos MTT:", dataMtt);
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

  const clearC = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loadingGet,
    errorGet,
    dataC,
    read,
   clearC,
    post,
    edit,
    deleteRow,
  };
};

// https://script.google.com/macros/s/AKfycbw21IFT6ijZNQocKRE-00-td6goh0fp2fDhmbzwXMwuyyptuXCQOm7JTbeNxB0y4lf0Fg/exec?mtt=MTT4&sheet=Afectaciones&tipo=post&data="{"detalle":"10/02/2026","desc":"Falla de fibra"}";
// https://script.google.com/macros/s/AKfycbw21IFT6ijZNQocKRE-00-td6goh0fp2fDhmbzwXMwuyyptuXCQOm7JTbeNxB0y4lf0Fg/exec?mtt=MTT1&sheet=Acciones&tipo=edit&row=6&data={"sector":"aqui se prueba el estado","event":"dos ojos","ubi":"[-fdffsf,fsfsfsf]"}
// https://script.google.com/macros/s/AKfycbw21IFT6ijZNQocKRE-00-td6goh0fp2fDhmbzwXMwuyyptuXCQOm7JTbeNxB0y4lf0Fg/exec?mtt=MTT4&sheet=Afectaciones&tipo=post&data={"sector":"aqui se prueba el estado","event":"dos ojos","ubi":"[-fdffsf,fsfsfsf]"}
