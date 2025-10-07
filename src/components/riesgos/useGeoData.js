// hooks/useGeoData.js
import { useState, useEffect } from 'react';

const API_URL = 'https://script.google.com/macros/s/AKfycbx4E9blUYb95cTL5SeN4BXOnsiwJmCDSHONCiJMtPEd7KGIf_V9AhEKvd2WCoE7RMnj/exec';

export const useGeoData = (parroquia, sector = '') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // No hacer nada si no hay parroquia seleccionada
    if (!parroquia || parroquia.trim() === '') {
      setData(null);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null); // Limpiar datos anteriores
      
      try {
        console.log('🔍 Fetching data for:', { parroquia, sector });
        
        const params = new URLSearchParams();
        params.append('parroquia', parroquia);
        if (sector && sector.trim() !== '') {
          params.append('sector', sector);
        }

        const url = `${API_URL}?${params.toString()}`;
       // console.log('📡 URL:', url);

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📦 Response data:', result);
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setData(result);
      } catch (err) {
        console.error('❌ Error fetching data:', err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parroquia, sector]);

  return { data, loading, error };
};