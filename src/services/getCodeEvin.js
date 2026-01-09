// URL de tu Apps Script (reemplaza con tu URL)
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzJDtiHiQHrSJXsNe7-TrELrujK86RYcdBXkDyYMu9c3_qbsvokwFcmL_5HKnaGPAVc/exec"
// Obtener datos del spreadsheet
export const fetchCodeEvin = async (code = "SCPL2026", setData,setValidar) => {
  try {
    // setLoading(true);
    let url = `${SCRIPT_URL}?action=getData`;
    console.log(code)

    if (code) {
      url += `&code=${encodeURIComponent(code)}`;
    }
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);
    if (result.status === "success") {
      setData(result.data);
      setValidar(true)
    } else {
      console.error("Error al obtener datos:", result.data);
    }
  } catch (error) {
    console.error("Error:", error);
    alert(`el Tramite ${code} no existe, `);
  } finally {
    // setLoading(false);
  }
};