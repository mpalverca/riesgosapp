// src/components/maps/hooks/useMapIcons.js
import { useCallback } from "react";
import { divIcon } from "leaflet";
import { renderToString } from "react-dom/server";
import {
  FaExclamationTriangle,
} from "react-icons/fa";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import DomainDisabledIcon from "@mui/icons-material/DomainDisabled";
import LandscapeIcon from "@mui/icons-material/Landscape";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WaterIcon from "@mui/icons-material/Water";
import FloodIcon from "@mui/icons-material/Flood";

const COLOR_PRIORIDAD = {
  Alta: "#dc3545",
  Media: "#ffc107",
  Baja: "#28a745",
  DEFAULT: "#007bff",
};

const EVENT_ICONS = {
  "Movimiento en Masa": { icon: LandscapeIcon, color: "#FF5733" },
  Inundación: { icon: FloodIcon, color: "#0205a7" },
  "Colapso estructural": { icon: DomainDisabledIcon, color: "Blue" },
  "Incenido estructural": { icon: WhatshotIcon, color: "red" },
  "Erosión Hídrica": { icon: WaterIcon, color: "red" },
  "Epoca Lluviosa": { icon: WaterDropIcon, color: "Blue" },
  default: { icon: FaExclamationTriangle, color: "#080808" },
};

export const useMapIcons = () => {
  const getEventIcon = useCallback((eventType, priority) => {
    const color = COLOR_PRIORIDAD[priority] || COLOR_PRIORIDAD.DEFAULT;
    const eventConfig = EVENT_ICONS[eventType] || EVENT_ICONS.default;
    const IconComponent = eventConfig.icon;

    const circleStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: color,
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    };

    const html = renderToString(
      <div style={circleStyle}>
        <IconComponent color={eventConfig.color} size={14} />
      </div>
    );

    return divIcon({
      html,
      className: "custom-leaflet-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  }, []);

  const getEventIconPulso = useCallback((eventType, priority, radio) => {
    const color = COLOR_PRIORIDAD[priority] || COLOR_PRIORIDAD.DEFAULT;
    const eventConfig = EVENT_ICONS[eventType] || EVENT_ICONS.default;
    const IconComponent = eventConfig.icon;

    const baseSize = 40;
    const radioFactor = radio / 25;
    const calculatedSize = baseSize * radioFactor;
    const outerCircleSize = calculatedSize;
    const middleCircleSize = calculatedSize * 0.75;

    const html = renderToString(
      <div
        style={{
          position: "relative",
          width: `${outerCircleSize}px`,
          height: `${outerCircleSize}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: `${outerCircleSize}px`,
            height: `${outerCircleSize}px`,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: 0.3,
            animation: "pulse 2s infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: `${middleCircleSize}px`,
            height: `${middleCircleSize}px`,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: 0.5,
            animation: "pulse 2s infinite",
            animationDelay: "0.5s",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: color,
            borderRadius: "50%",
            width: `24px`,
            height: `24px`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 10,
            position: "relative",
          }}
        >
          <IconComponent color="white" size={12} />
        </div>
      </div>
    );

    return divIcon({
      html,
      className: `custom-leaflet-icon emergency-alert radio-${Math.round(radio)}`,
      iconSize: [outerCircleSize, outerCircleSize],
      iconAnchor: [outerCircleSize / 2, outerCircleSize],
    });
  }, []);

  return { getEventIcon, getEventIconPulso, COLOR_PRIORIDAD };
};