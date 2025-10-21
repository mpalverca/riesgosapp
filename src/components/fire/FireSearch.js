// URL de tu Apps Script (reemplaza con tu URL)
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzN2dLE1_DmwRZpnjXMUJ2S3jdVwvGdA4p_9Wq_fX7KqvDhgFT_Y_T8_EaZVJUxpEr5/exec";
// Obtener datos del spreadsheet
export const fetchData = async (parroq = "", setData) => {
  try {
    // setLoading(true);
    let url = `${SCRIPT_URL}?action=getData`;

    if (parroq) {
      url += `&parroq=${encodeURIComponent(parroq)}`;
    }

    const response = await fetch(url);
    
    const result = await response.json();
    console.log(result);

    if (result.status === "success") {
      setData(result.data);
      //setLoading(true);
    } else {
      console.error("Error al obtener datos:", result.data);
    }
  } catch (error) {
    console.error("Error:", error);
    alert(`el Tramite ${parroq} no existe, `);
  } finally {
    // setLoading(false);
  }
};
