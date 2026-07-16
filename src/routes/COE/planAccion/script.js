import { useCallback, useState } from "react";

/*  const url_GetAll =
  "https://script.google.com/macros/s/AKfycbyXoPBBzKzTTRRCV6OeJ2bR155nlgoWXhLUIRsBXLm1rmpd1I6mZAq1Eg0oKYD874YI/exec"; 
  */ /*   const url_GetAll =
  "https://script.google.com/macros/s/AKfycbyGlB5jz0VOKql4P4rpcalO1Lny8BswgU7KFo9b_8jAyXm0_Li7Eq4ceL7V84cDl_86/exec"
  */
const url_GetAll =
  "https://script.google.com/macros/s/AKfycbwXwx6kcuGTwtx-yrPBukM0FmKwGB8ME3X9y5NzxpANOoPT9pPysYYl1TBwe0Xv121F/exec";

/*  const url_GetAll ="https://script.google.com/macros/s/AKfycbzrK22S5XWDNinm7_wBNL6tzf7cAiO0eND6KTtaC08goiiWof3-BCA6-Q3-8OMCA_fF/exec"
 */ 
export const usePlanA = () => {
  const [loadingGet, setLoading] = useState(false);
  const [errorGet, setError] = useState(null);
  const [dataGet, setData] = useState(null);

  const searchAccion = useCallback(async (tipe) => {

    // Validaciones

    if (!tipe) {
      setError("Ingrese el tipo de consulta");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch(`${url_GetAll}?tipo=get&sheet=${tipe}`);
      const data = await response.json();
      //console.log(data);
      setData(data);
      //console.log("Datos MTT:", dataMtt);
    } catch (err) {
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  const searchGet = useCallback(async (mtt, tipe) => {
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
        `${url_GetAll}?tipo=get&sheet=${tipe}&mtt=${mtt}`,
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

  const post = useCallback(async (tipe, dPost) => {
    // Validaciones
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
        `${url_GetAll}?tipo=post&sheet=${tipe}&data=${JSON.stringify(dPost)}`,
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

  const edit = useCallback(async (tipe, row, dEdit) => {
    // Validaciones

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
        `${url_GetAll}?tipo=edit&row=${row}&data=${JSON.stringify(dEdit)}`,
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
  const deleteRow = useCallback(async (sheet, row) => {
  console.log("delete", sheet, row+6);
  if (!sheet || !row) {
    setError("Faltan datos para eliminar");
    return;
  }
  setLoading(true);
  setError(null);
  try {
    // ✅ No sumar +6 a menos que sea necesario (verifica el origen del row)
    const response = await fetch(
      
      `${url_GetAll}?tipo=delete&sheet=${sheet}&data=${JSON.stringify({fila:row})}`
    );
    const result = await response.json(); // ✅ Esperar la respuesta JSON
    console.log("Resultado eliminación:", result);
    // Puedes setear el resultado en data si quieres
    setData(result);
    return result; // Devolver el resultado para que el llamador pueda usarlo
  } catch (err) {
    setError(err.message || "Error de conexión");
    throw err; // Re-lanzar para manejar en el componente
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
    searchAccion,
    searchGet,
    clearGet,
    post,
    edit,
    deleteRow,
  };
};

// https://script.google.com/macros/s/AKfycbw21IFT6ijZNQocKRE-00-td6goh0fp2fDhmbzwXMwuyyptuXCQOm7JTbeNxB0y4lf0Fg/exec?mtt=MTT4&sheet=Afectaciones&tipo=post&data="{"detalle":"10/02/2026","desc":"Falla de fibra"}";
// https://script.google.com/macros/s/AKfycbw21IFT6ijZNQocKRE-00-td6goh0fp2fDhmbzwXMwuyyptuXCQOm7JTbeNxB0y4lf0Fg/exec?mtt=MTT1&sheet=Acciones&tipo=edit&row=6&data={"sector":"aqui se prueba el estado","event":"dos ojos","ubi":"[-fdffsf,fsfsfsf]"}
// https://script.google.com/macros/s/AKfycbw21IFT6ijZNQocKRE-00-td6goh0fp2fDhmbzwXMwuyyptuXCQOm7JTbeNxB0y4lf0Fg/exec?mtt=MTT4&sheet=Afectaciones&tipo=post&data={"sector":"aqui se prueba el estado","event":"dos ojos","ubi":"[-fdffsf,fsfsfsf]"}
