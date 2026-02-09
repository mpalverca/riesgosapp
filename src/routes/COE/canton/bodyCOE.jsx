import React, { useEffect, useState } from "react";
import Panels from "../../../components/panels/Panels";
// icons
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import HandymanIcon from "@mui/icons-material/Handyman";
import EmergencyShareIcon from "@mui/icons-material/EmergencyShare";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAcciones, useAfectaciones, useRecursos } from "../script_afect";
import { CheckBox, Refresh } from "@mui/icons-material";
import MapMark from "./MapsView";
import { icon } from "leaflet";
import { DialogAfect } from "./popups/ImputAfect";
import { set } from "mongoose";

function BodyCOE({ ...props }) {
  const { loadingAF, errorAF, dataAF, countAF, searchAF } = useAfectaciones();
  const { loadingAC, errorAC, dataAC, countAC, searchAC } = useAcciones();
  const { loadingRE, errorRE, dataRE, countRE, searchRE } = useRecursos();

  const [afectaciones, setAfectaciones] = useState(null);
  const [acciones, setAcciones] = useState(null);
  const [recursos, setRecursos] = useState(null);
  //to dates
  const [coordinates, setCoordinates] = useState(null);
  //acciones

  const [openAF, setOpenAF] = useState(false);

  const [selectedCapa, setSelectedCapa] = useState({
    afectaciones: false,
    acciones: false,
    recursos: false,
    necesidades: false,
    requerimientos: false,
  });
  // Nuevo useEffect para buscar cuando cambia el CI
  useEffect(() => {
    if (selectedCapa.afectaciones && dataAF) {
      setAfectaciones(dataAF);
    }
    if (selectedCapa.acciones && dataAC) {
      setAcciones(dataAC);
    }
    if (selectedCapa.recursos && dataRE) {
      setRecursos(dataRE);
    }
  }, [
    dataAF,
    dataAC,
    dataRE,
    selectedCapa.afectaciones,
    selectedCapa.acciones,
    selectedCapa.recursos,
  ]);

  //control varias capas
  const handleLayerToggle = (layer) => {
    setSelectedCapa((prev) => {
      const newState = {
        ...prev,
        [layer]: !prev[layer],
      };

      // Realizar acciones basadas en el NUEVO estado
      if (layer === "afectaciones" && !prev[layer]) {
        // Solo si se está ACTIVANDO afectaciones

        if (props?.mtt && props?.mtt.trim() !== "") {
          if (!afectaciones) {
            // o afectaciones === null
            searchAF(props?.mtt);
          }
        }
      } else if (layer === "acciones" && !prev[layer]) {
        if (!acciones) {
          // o acciones === null
          searchAC(props?.mtt, "acciones");
        }
      } else if (layer === "recursos" && !prev[layer]) {
        if (!recursos) {
          // o acciones === null
          searchRE(props?.mtt, "recursos");
        }
      } else if (layer === "necesidades" && !prev[layer]) {
        console.log("necesidades activadas");
      } else if (layer === "requerimientos" && !prev[layer]) {
        console.log("requerimientos activadas");
      }
      // ... etc para otras capas

      return newState;
    });
  };

  const layersConfig = [
    {
      key: "afectaciones",
      label: "Afectaciones",
      loading: loadingAF,
      count: countAF,
      icon: <CircleNotificationsIcon />,
      accion: (coords) => handleClickOpen(coords),
      refresh: () => searchAF(props?.mtt),
    },
    {
      key: "acciones",
      label: "Acciones",
      loading: loadingAC,
      count: countAC,
      icon: <DirectionsWalkIcon />,
      accion: (coords) => console.log("Afectaciones en:", coords),
      refresh: () => {
        searchAC(props?.mtt);
        if (selectedCapa.acciones && dataAC) {
          setAcciones(dataAC);
        }
      },
    },
    {
      key: "recursos",
      label: "Recursos",
      loading: loadingRE,
      count: countRE,
      icon: <HandymanIcon />,
      accion: (coords) => console.log("Afectaciones en:", coords),
    },
    {
      key: "necesidades",
      label: "Necesidades",
      loading: false,
      count: null,
      icon: <EmergencyShareIcon />,
      accion: (coords) => console.log("Afectaciones en:", coords),
    },
    {
      key: "requerimientos",
      label: "Bandeja de Requerimientos",
      loading: false,
      count: null,
      icon: <CheckCircleOutlineIcon />,
      accion: (coords) => console.log("Afectaciones en:", coords),
    },
  ];

  //open dialog:

  const handleClickOpen = (coordenate) => {
    setOpenAF(true);
    setCoordinates(coordenate);
  };

  const handleClose = (value) => {
    setOpenAF(false);
 
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      <Grid
        item
        size={{ xs: 12, md: 3 }}
        style={{ height: "90vh", overflowY: "auto" }}
      >
        <Panels
          title={`Mesa Tecnica de trabajo/grupo de trabajo - ${props?.mtt}`}
          body={
            <Box
              sx={{
                pl: 2,
                mb: 2,
                display: "flex",
                flexDirection: "column", // ← Esto fuerza el layout vertical
                // gap: 1, // ← Espacio entre elementos (opcional)
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Ver capas{" "}
              </Typography>
              {layersConfig.map((layer) => (
                <div
                  key={layer.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedCapa[layer.key]}
                        onChange={() => handleLayerToggle(layer.key)}
                        icon={layer.icon}
                        checkedIcon={layer.icon}
                      />
                    }
                    label={`${layer.label}${layer.count !== null ? ` (${layer.loading ? "cargando" : layer.count})` : ""}`}
                  />
                  <IconButton onClick={layer.refresh} size="small">
                    <Refresh fontSize="small" />
                  </IconButton>
                </div>
              ))}
              <Divider />
              <Typography>Afectaciones </Typography>

              <FormControlLabel
                control={
                  <Checkbox
                    //checked={}
                    // onChange={() => handleLayerToggle(layer.key)}
                    // icon={layer.icon}
                    checkedIcon={
                      <CheckBox fontSize="small" color="primary" />
                      //layer.icon
                    }
                  />
                }
                label={`Eventos Registrados`}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    //checked={}
                    // onChange={() => handleLayerToggle(layer.key)}
                    // icon={layer.icon}
                    checkedIcon={
                      <CheckBox fontSize="small" color="primary" />
                      //layer.icon
                    }
                  />
                }
                label={`Susceptibilidad`}
              />
              <Divider />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Añadir capa
              </Typography>
              <Typography variant="body2">
                Para añadir una capa, debes dar clik en un lugar en el mapa
                "Menu que se depliega", debes seleccionar una opcion para
                agregar{" "}
              </Typography>
            </Box>
          }
        />
      </Grid>
      <Grid item size={{ xs: 12, md: 9 }}>
        <MapMark
          position={[-3.9965787520553717, -79.20168563157956]}
          zoom={10}
          dataAF={afectaciones}
          loading={{ loadingAC, loadingAF, loadingRE }}
          selectCapa={selectedCapa}
          mtt={props.mtt}
          dataAC={acciones}
          dataRE={recursos}
          layersConfig={layersConfig}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
        />
        <DialogAfect
          mtt={props.mtt}
          open={openAF}
          coordinates={coordinates}
          member={props.member}
          onClose={handleClose}
        />
      </Grid>
    </Grid>
  );
}

export default BodyCOE;
