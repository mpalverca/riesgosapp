import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { cargarDatosPol } from "./script/script.js"

const MapViewer = () => {
  const [map, setMap] = useState(null);
  const [polygonData, setPolygonData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await cargarDatosPol();
        setPolygonData(data);
      } catch (err) {
        console.error("Error al cargar polígonos:", err);
        setError("Error al cargar datos de polígonos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  let position = [-3.9939, -79.2042]
  const renderPolygons = () => {
    return polygonData.map((item) => {     
      try {
        const coordinates = item.geom.coordinates;
        let leafletCoords = [];

        if (item.geom.type === 'Polygon') {
          // Convertir coordenadas GeoJSON (Polygon) a formato Leaflet
          leafletCoords = coordinates[0].map(coord => [coord[1], coord[0]]);
          return (
            <Polygon
              key={item.id}
              positions={leafletCoords}
              pathOptions={{
                color: '#3388ff',
                fillColor: '#3388ff',
                fillOpacity: 0.2,
                weight: 2
              }}
            >
              <Popup>
                <div>
                  {/* <h3>{item.id}</h3> */}
                  <p><strong>Descripción:</strong> {item.Descripcio}</p>
                </div>
              </Popup>
            </Polygon>
          );

        } else if (item.geom.type === 'MultiPolygon') {
          // Convertir coordenadas GeoJSON (MultiPolygon) a formato Leaflet
          return coordinates.map((polygon, index) => {
            const polyCoords = polygon[0].map(coord => [coord[1], coord[0]]);

            return (
              <Polygon
                key={`N° ${item.id}-${index}`}
                positions={polyCoords}
                pathOptions={{
                  color: item.tipo === 1 ? '#ffff00' : '#0000ff',
                  fillColor: item.tipo === 1 ? '#ffff00' : '#0000ff',
                  fillOpacity: 0.2,
                  weight: 2
                }}
              >
                <Popup>
                  <div>
                    <h4>{item.id}</h4>
                    <p><strong>Descripción:</strong> {item.Descripcio}</p>
                  </div>
                </Popup>
              </Polygon>
            );
          });

        } else {
          console.warn(`Tipo de geometría no soportado: ${item.geom.type}`, item);
          return null;
        }
      } catch (error) {
        console.error("Error al procesar polígono:", item, error);
        return null;
      }
    });
  };
  if (loading) return <div>Cargando mapa...</div>;
  if (error) return <div>{error}</div>;
  if (!polygonData.length) return <div>No hay datos de polígonos disponibles</div>;
  return (
    <MapContainer
      center={position}
      zoom={14}
      style={{ height: '350px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={position}>
        <Popup>Ubicación central de referencia</Popup>
      </Marker>
      {renderPolygons()}
    </MapContainer>
  );
};


export default MapViewer;