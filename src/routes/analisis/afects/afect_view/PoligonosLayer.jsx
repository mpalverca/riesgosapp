// src/components/maps/components/PoligonosLayer.jsx
import React, { useMemo } from "react";
import { Polygon, Popup } from "react-leaflet";
import PropTypes from "prop-types";

const POLYGON_COLORS = {
  tipo1: { color: "#ffff00", fillColor: "#ffff00", fillOpacity: 0.2 },
  tipo2: { color: "#0000ff", fillColor: "#0000ff", fillOpacity: 0.2 },
};

const SucepLayer = ({ poligonosData = [], showLayer = false, loading = false }) => {
  const renderPoligonos = useMemo(() => {
    if (!showLayer || loading) return null;

    return poligonosData
      .flatMap((item, index) => {
        try {
          if (!item?.geom?.coordinates) return null;

          return item.geom.coordinates.map((polygon, polyIndex) => {
            const polyCoords = polygon[0].map((coord) => [coord[1], coord[0]]);
            const colors =
              item.tipo === 1 ? POLYGON_COLORS.tipo1 : POLYGON_COLORS.tipo2;

            return (
              <Polygon
                key={`poligono-${item.id}-${index}-${polyIndex}`}
                positions={polyCoords}
                pathOptions={{
                  color: colors.color,
                  fillColor: colors.fillColor,
                  fillOpacity: colors.fillOpacity,
                  weight: 2,
                }}
                interactive={true}
              >
                <Popup>
                  <div>
                    <h4>Polígono {item.id}</h4>
                    <p>
                      <strong>Descripción:</strong>{" "}
                      {item.Descripcio || "Sin descripción"}
                    </p>
                  </div>
                </Popup>
              </Polygon>
            );
          });
        } catch (error) {
          console.error("Error al renderizar polígono:", item, error);
          return null;
        }
      })
      .filter(Boolean);
  }, [poligonosData, showLayer, loading]);

  if (!showLayer) return null;

  return <>{renderPoligonos}</>;
};

SucepLayer.propTypes = {
  poligonosData: PropTypes.array,
  showLayer: PropTypes.bool,
  loading: PropTypes.bool,
};

export default React.memo(SucepLayer);