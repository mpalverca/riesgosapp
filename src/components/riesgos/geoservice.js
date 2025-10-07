// services/geoApiService.js
const BASE_URL = 'https://script.google.com/macros/s/AKfycbx4E9blUYb95cTL5SeN4BXOnsiwJmCDSHONCiJMtPEd7KGIf_V9AhEKvd2WCoE7RMnj/exec';
const PI_PUGS = "https://script.google.com/macros/s/AKfycbxQgMzvnEs5LBykZAqSfXv8opFSY9z8HSbiuEjlzh6gzOVpNO9jEQesSs6R6ezUtRij/exec";

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


export const geoApiPUGS = {
  async getData(parroquia, sector = '') {
    try {
      const params = new URLSearchParams({ parroquia });
      if (sector) params.append('sector', sector);

      const response = await fetch(`${PI_PUGS}?${params}`);
      
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