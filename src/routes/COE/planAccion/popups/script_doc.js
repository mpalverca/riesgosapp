// hooks/useDriveAPI.js
import { useState, useCallback } from 'react';

const API_URL = "https://script.google.com/macros/s/AKfycbw8ulJtSAyCZxm1aVQi03PrXZKFXNFDv-Bb6_2e6-XaoOeqMVL_3oZuWqJIibyFtWSmHg/exec"
// Reemplaza con tu URL

export const useDriveAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [archivos, setArchivos] = useState([]);
  const [carpetas, setCarpetas] = useState([]);

  // GET
  const get = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(API_URL);
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          url.searchParams.append(key, params[key]);
        }
      });
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Error en la API');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // POST con FormData (sin preflight)
  const post = useCallback(async (body) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      Object.keys(body).forEach(key => {
        if (body[key] !== null && body[key] !== undefined) {
          formData.append(key, body[key]);
        }
      });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Error en la API');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------- CRUD ----------
  const listarArchivos = useCallback(async (carpetaId = null) => {
    const params = { action: 'list' };
    if (carpetaId) params.carpeta = carpetaId;
    const resultado = await get(params);
    if (resultado.data) setArchivos(resultado.data);
    return resultado;
  }, [get]);

  const obtenerArchivo = useCallback(async (id) => {
    return await get({ action: 'get', id });
  }, [get]);

  const eliminarArchivo = useCallback(async (id) => {
    const resultado = await get({ action: 'delete', id });
    if (resultado.success) {
      setArchivos(prev => prev.filter(a => a.id !== id));
    }
    return resultado;
  }, [get]);

  const obtenerCarpetas = useCallback(async () => {
    const resultado = await get({ action: 'carpetas' });
    if (resultado.data) setCarpetas(resultado.data);
    return resultado;
  }, [get]);

  const subirArchivo = useCallback(async (archivo, carpetaDestino = '') => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target.result.split(',')[1];
          const resultado = await post({
            action: 'upload',
            nombre: archivo.name,
            tipoMime: archivo.type,
            datosBase64: base64,
            carpetaDestino: carpetaDestino
          });
          if (resultado.success && resultado.data) {
            setArchivos(prev => [...prev, resultado.data]);
          }
          resolve(resultado);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsDataURL(archivo);
    });
  }, [post]);

  const actualizarArchivo = useCallback(async (id, nuevoNombre, archivoNuevo = null) => {
    let datosBase64 = null;
    if (archivoNuevo) {
      const reader = new FileReader();
      const datos = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result.split(',')[1]);
        reader.readAsDataURL(archivoNuevo);
      });
      datosBase64 = datos;
    }
    const resultado = await post({
      action: 'update',
      id: id,
      nuevoNombre: nuevoNombre,
      datosBase64: datosBase64
    });
    if (resultado.success && resultado.data) {
      setArchivos(prev => prev.map(a => a.id === id ? { ...a, ...resultado.data } : a));
    }
    return resultado;
  }, [post]);

  return {
    loading,
    error,
    archivos,
    carpetas,
    listarArchivos,
    obtenerArchivo,
    eliminarArchivo,
    obtenerCarpetas,
    subirArchivo,
    actualizarArchivo
  };
};