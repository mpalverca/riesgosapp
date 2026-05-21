import { useCallback, useState } from "react";

const url_GetAll =
  "https://script.google.com/macros/s/AKfycbwsamRvF6jmepai_hZgTG4EKCiYKRSM1-8CShXwNdkV1A34fROSHQsthDoYadD0duo/exec"

export const useGetEvent = () => {
  const [loadingEv, setLoading] = useState(false);
  const [errorEv, setError] = useState(null);
  const [dataEv, setData] = useState(null);  
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(null);

  const read = useCallback(async (sheet,status) => {
    // Validaciones
    if (!sheet) {
      setError("Ingrese un mesa o grupo de trabajo");
      return;
    }
    
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch(
        `${url_GetAll}?tipo=read&sheet=${sheet}`,
      );
      const data = await response.json();
      console.log(data)
      setData(data.data);
      setMessage(data.message);
      setSuccess(data.success);
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

  const clearGet = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
     loadingEv,
    errorEv,
    dataEv,
    message,
    success,
    read,
    clearGet,
    post,
    edit,
    deleteRow,
  };
};

// https://script.google.com/macros/s/AKfycbw21IFT6ijZNQocKRE-00-td6goh0fp2fDhmbzwXMwuyyptuXCQOm7JTbeNxB0y4lf0Fg/exec?mtt=MTT4&sheet=Afectaciones&tipo=post&data="{"detalle":"10/02/2026","desc":"Falla de fibra"}";
// https://script.google.com/macros/s/AKfycbw21IFT6ijZNQocKRE-00-td6goh0fp2fDhmbzwXMwuyyptuXCQOm7JTbeNxB0y4lf0Fg/exec?mtt=MTT1&sheet=Acciones&tipo=edit&row=6&data={"sector":"aqui se prueba el estado","event":"dos ojos","ubi":"[-fdffsf,fsfsfsf]"}
// https://script.google.com/macros/s/AKfycbw21IFT6ijZNQocKRE-00-td6goh0fp2fDhmbzwXMwuyyptuXCQOm7JTbeNxB0y4lf0Fg/exec?mtt=MTT4&sheet=Afectaciones&tipo=post&data={"sector":"aqui se prueba el estado","event":"dos ojos","ubi":"[-fdffsf,fsfsfsf]"}
