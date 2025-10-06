// hooks/useGeoData.js
import { useState, useEffect } from 'react';

const API_URL = 'https://script.google.com/macros/s/AKfycbx4E9blUYb95cTL5SeN4BXOnsiwJmCDSHONCiJMtPEd7KGIf_V9AhEKvd2WCoE7RMnj/exec';

export const useGeoData = (parroquia = '', sector = '') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!parroquia) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        params.append('parroquia', parroquia);
        if (sector) params.append('sector', sector);

        const response = await fetch(`${API_URL}?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setData(result);
      } catch (err) {
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