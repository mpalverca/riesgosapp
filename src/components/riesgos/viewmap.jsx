// components/GeoMap.jsx
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const GeoMap = ({ geoData, sector, predio }) => {
  if (!geoData || !geoData.features || geoData.features.length === 0) {
    return <div>No hay datos geoespaciales para mostrar</div>;
  }

  /* console.log(geoData);
  // Estilo para las geometrías
  const geoJsonStyle = {
    color: "#f80707ff",
    weight: 2,
    opacity: 0.7,
    fillOpacity: 0.1,
  }; */

  // Calcular centro del mapa basado en los datos
  const calculateCenter = () => {
    return [-3.99313, -79.20422];
  };
  const renderPolygons = () => {
    return geoData.features.map((item) => {
      try {
        const coordinates = item.geometry.coordinates;
        // Convertir coordenadas GeoJSON (MultiPolygon) a formato Leaflet
        return coordinates.map((polygon, index) => {
          const polyCoords = polygon[0].map((coord) => [coord[1], coord[0]]);

          return (
            <Polygon
              key={`N° ${item.id}-${index}`}
              positions={polyCoords}
              pathOptions={{
                color:
                  item.properties.aptitud === "APTO"
                    ? "#00ff15ff"
                    : item.properties.aptitud ===
                      "APTO CON MEDIANAS LIMITACIONES"
                    ? "#0000ff"
                    : item.properties.aptitud ===
                      "APTO CON EXTREMAS LIMITACIONES"
                    ? "#fde407ff"
                    : item.properties.aptitud === "NO APTO"
                    ? "#ff0000ff"
                    : "#ff0000ff",
                fillColor:
                  item.properties.aptitud === "APTO"
                    ? "#48ff00ff"
                    : item.properties.aptitud ===
                      "APTO CON MEDIANAS LIMITACIONES"
                    ? "#0000ff"
                    : item.properties.aptitud ===
                      "APTO CON EXTREMAS LIMITACIONES"
                    ? "#f9fd07ff"
                    : item.properties.aptitud === "NO APTO"
                    ? "#ff0000ff"
                    : "#ff0000ff",
                fillOpacity: 0.2,
                weight: 2,
              }}
            >
              <Popup>
                <strong>Objeto:</strong> {item.properties.objectid}
                <br />
                <strong>Aptitud:</strong> {item.properties.aptitud}
                <br />
                <strong>Amenaza:</strong> {item.properties.amenazas}
                <br />
                <strong>Estudios:</strong> {item.properties.estudios}
                <br />
                <strong>Observaciones:</strong> {item.properties.observac_1},{" "}
                {item.properties.observac_2}
                <br />
              </Popup>
            </Polygon>
          );
        });
      } catch (error) {
        console.error("Error al procesar polígono:", item, error);
        return null;
      }
    });
  };
  const renderSector = () => {
    return sector.features.map((item) => {
      try {
        const coordinates = item.geometry.coordinates;
        

        // Convertir coordenadas GeoJSON (MultiPolygon) a formato Leaflet
        return coordinates.map((polygon, index) => {
          const polyCoords = polygon[0].map((coord) => [coord[1], coord[0]]);

          return (
            <Polygon
              key={`N° ${item.id}-${index}`}
              positions={polyCoords}
              pathOptions={{
                color: "#030303ff",
                fillColor: "#c5c1c1ff",
                fillOpacity: 0.2,
                weight: 8,
              }}
            >
              <Popup>
                <strong>Sector:</strong> {item.properties.SECTOR}
                <br />
                <strong>Presidente:</strong> {item.properties.PRESIDENTE}
                <br />
              </Popup>
            </Polygon>
          );
        });
      } catch (error) {
        console.error("Error al procesar polígono:", item, error);
        return null;
      }
    });
  };
  const renderPredio = () => {
    console.log(predio)    
    return predio.map((item) => {
      try {
        const coordinates = item.geometry.coordinates;
      
        // Convertir coordenadas GeoJSON (MultiPolygon) a formato Leaflet
        return coordinates.map((polygon, index) => {
          const polyCoords = polygon[0].map((coord) => [coord[1], coord[0]]);
          return (
            <Polygon
              key={`N° ${item.id}-${index}`}
              positions={polyCoords}
              pathOptions={{
                color: "#f70303ff",
                fillColor: "#1b1a1aff",
                fillOpacity: 0.2,
                weight: 4,
              }}
            >
              <Popup>
                <strong>Clave_catastral:</strong> {item.properties.clave_cata}
                <br />
                <strong>Posee Edificación:</strong>{" "}
                {item.properties.edif === 1 ? "SI" : "NO"}
                <br />
                <strong>Area de edificacion:</strong>{" "}
                {item.properties.area_construccion}
                <br />
                <strong>Permiso de construcción:</strong>{" "}
                {item.properties.permiso_numero}-{" "}
                {item.properties.fecha_permiso}
                <br />
                <br />
                <strong>Detalle de intervención:</strong>{" "}
                {item.properties.detalle_intervencion_pisos}
              </Popup>
            </Polygon>
          );
        });
      } catch (error) {
        console.error("Error al procesar polígono:", item, error);
        return null;
      }
    });
  };
  return (
    <div className="geo-map">
      <MapContainer
        center={calculateCenter()}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {renderPolygons()}
        {renderSector()}
        {renderPredio()}
        {/* <GeoJSON
          data={geoData}
          style={geoJsonStyle}
          onEachFeature={(feature, layer) => {
            if (feature.properties) {
              const popupContent = Object.entries(feature.properties)
                .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
                .join('<br/>');
              layer.bindPopup(popupContent);
            }
          }}
        /> */}
      </MapContainer>
    </div>
  );
};

export default GeoMap;
