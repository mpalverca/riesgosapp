SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyj_AoSImfbZzgvtXrHUdQlGL-ttZWSWAIMSqi0YlxmKxi4NG7qHZt_ehpgpCSAKJA/exec";

// Obtener datos del spreadsheet
export const fetchData = async (sector,setData) => {
  try {
    // setLoading(true);
    let url = `${SCRIPT_URL}?action=getData`;

    if (tramite) {
      url += `&tramite=${encodeURIComponent(tramite)}`;
    }
    const response = await fetch(url);
    console.log(response);
    const result = await response.json();
    console.log(result);

    if (result.status === "success") {
      setData(result.data[0]);
   
    } else {
      console.error("Error al obtener datos:", result.data);
    }
  } catch (error) {
    console.error("Error:", error);
    alert(`el Tramite ${tramite} no existe, `);
  } finally {
    // setLoading(false);
  }
};

export const insertData = async (e) => {
  e.preventDefault();

  try {
    //setLoading(true);

    const formDataToSend = new URLSearchParams();
    //formDataToSend.append("action", "insertData");
    //formDataToSend.append("parroq", formData.parroq);
    //formDataToSend.append("sector", formData.sector);
    // formDataToSend.append("clave_c", formData.clave_c);
    // formDataToSend.append("tramite", formData.tramite);

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: formDataToSend,
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("Datos insertados correctamente");
      /*   setFormData({
        parroq: "",
        sector: "",
        clave_c: "",
        tramite: "",
      }); */
      // fetchData(searchTramite); // Actualizar la lista con el filtro actual
    } else {
      alert("Error: " + result.data);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al insertar datos");
  } finally {
    //  setLoading(false);
  }
};
