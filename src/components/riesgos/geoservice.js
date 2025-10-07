// services/geoApiService.js
const BASE_URL = 'https://script.google.com/macros/s/AKfycbx4E9blUYb95cTL5SeN4BXOnsiwJmCDSHONCiJMtPEd7KGIf_V9AhEKvd2WCoE7RMnj/exec';

export const geoApiService = {
  async getData(parroquia, sector = '') {
    try {
      const params = new URLSearchParams({ parroquia });
      if (sector) params.append('sector', sector);

      const response = await fetch(`${BASE_URL}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching geo data:', error);
      throw error;
    }
  },

  async getParroquiasDisponibles() {
    // Puedes expandir esto para obtener metadatos
    return [
      'sucre', 'punzara', 'el_valle', 
      'san_sebastian', 'sagrario', 'carigan'
    ];
  }
};