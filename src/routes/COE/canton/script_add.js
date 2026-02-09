import { useCallback, useState } from "react";

const url_edit =
  "https://script.google.com/macros/s/AKfycbxPjG88V8Lac0rOnG3eaXMGpLhov5Od9Guu49T5YlOoRHhYaUz2j02mfYaSOLTiaJ6xzA/exec";

export const useAfectaciones = () => {
  const [loadingIAF, setLoading] = useState(false);
  const [errorIAF, setError] = useState(null);
  const [dataIAF, setData] = useState(null);
  const [countIAF, setCount] = useState(0);

  // 2. FUNCIÓN PARA AGREGAR/CREAR (POST)
  const createIAF = useCallback(async (mtt, data) => {
    console.log(mtt,data)
    if (!mtt) {
      setError("Ingrese un número de MTT");
      return;
    }
    if (!data || Object.keys(data).length === 0) {
      setError("Ingrese los datos para crear el registro");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      // Primer fetch para buscar el MTT
      const response = await fetch(
        `${url_edit}?mtt=${mtt}&tipo=post&data=${data}`,
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      console.log("Response status:", response.status, response.statusText);
      const data = await response.json();
      console.log(data);
      if (!data.success) {
        throw new Error(data.message || "Error en la consulta");
      }
      if (data.data && data.data.length > 0) {
        // Tomar el primer elemento del array
        const afect_data = data.data;
        setCount(data.count);
        // Por ahora, usamos los datos del primer fetch
        setData(afect_data);
      } else {
        setError(data.message || "MTT no encontrado");
      }
    } catch (err) {
      console.error("Error en createIAF:", err);
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. FUNCIÓN PARA ACTUALIZAR (PUT)
  const updateIAF = useCallback(async (mtt, rowNumber, data) => {
    if (!mtt) {
      setError("Ingrese un número de MTT");
      return;
    }

    if (!rowNumber) {
      setError("Se necesita el número de fila para actualizar");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url_edit, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mtt: mtt,
          row: rowNumber,
          _method: "PUT",
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Actualizar la lista después de editar
      } else {
        setError(result.error || "Error al actualizar el registro");
      }
    } catch (err) {
      console.error("Error en updateIAF:", err);
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. FUNCIÓN PARA ELIMINAR (DELETE)
  const deleteIAF = useCallback(async (mtt, rowNumber) => {
    if (!mtt) {
      setError("Ingrese un número de MTT");
      return;
    }

    if (!rowNumber) {
      setError("Se necesita el número de fila para eliminar");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url_edit, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mtt: mtt,
          row: rowNumber,
          _method: "DELETE",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Actualizar la lista después de eliminar
      } else {
        setError(result.error || "Error al eliminar el registro");
      }
    } catch (err) {
      console.error("Error en deleteRE:", err);
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
    loadingIAF,
    errorIAF,
    dataIAF,
    countIAF,

    createIAF,
    updateIAF,
    deleteIAF,
    clear,
  };
};
