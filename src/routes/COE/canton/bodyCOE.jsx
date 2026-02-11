import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {
  CircleNotifications as CircleNotificationsIcon,
  DirectionsWalk as DirectionsWalkIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Refresh,
} from "@mui/icons-material";

import Panels from "../../../components/panels/Panels";
import MapMark from "./MapsView";
import { DialogAfect } from "./popups/ImputAfect";
import { useGetInfo } from "../script";

function BodyCOE({ mtt, member }) {
  const { loadingGet, dataGet, searchGet } = useGetInfo();

  const [afectaciones, setAfectaciones] = useState(null);
  const [acciones, setAcciones] = useState(null);
  const [requerimientos, setReq] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [openAF, setOpenAF] = useState(false);

  const [selectedCapa, setSelectedCapa] = useState({
    afectaciones: false,
    acciones: false,
    requerimientos: false,
  });

  // Sincronización inteligente de datos
  useEffect(() => {
    if (!dataGet?.data) return;

    // Asumimos que dataGet trae un campo que identifica el tipo o 
    // confiamos en la última capa activada. 
    // Tip: Sería mejor que searchGet devolviera una promesa o tuviera un indicador de tipo.
    if (selectedCapa.afectaciones) setAfectaciones(dataGet.data);
    if (selectedCapa.acciones) setAcciones(dataGet.data);
    if (selectedCapa.requerimientos) setReq(dataGet.data);
    
  }, [dataGet]);

  const handleLayerToggle = (layer) => {
    setSelectedCapa((prev) => {
      const isActivating = !prev[layer];
      const newState = { ...prev, [layer]: isActivating };

      if (isActivating && mtt?.trim() !== "") {
        // Mapeo de keys a términos de búsqueda
        const searchTerms = {
          afectaciones: "Afectaciones",
          acciones: "Acciones",
          requerimientos: "Recursos"
        };
        
        if (searchTerms[layer]) {
          searchGet(mtt, searchTerms[layer]);
        }
      }
      return newState;
    });
  };

  const layersConfig = [
    {
      key: "afectaciones",
      label: "Afectaciones",
      icon: <CircleNotificationsIcon />,
      refresh: () => searchGet(mtt, "Afectaciones"),
      count: afectaciones?.length
    },
    {
      key: "acciones",
      label: "Acciones",
      icon: <DirectionsWalkIcon />,
      refresh: () => searchGet(mtt, "Acciones"),
      count: acciones?.length
    },
    {
      key: "requerimientos",
      label: "Bandeja de Requerimientos",
      icon: <CheckCircleOutlineIcon />,
      refresh: () => searchGet(mtt, "Recursos"),
      count: requerimientos?.length
    },
  ];

  const handleClickOpen = (coordenate) => {
    setCoordinates(coordenate);
    setOpenAF(true);
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      <Grid item size={{xs:12, md:3}} sx={{ height: "90vh", overflowY: "auto" }}>
        <Panels
          title={!mtt ? "Cargando" : `MTT / Grupo de trabajo - ${mtt}`}
          body={
            <Box sx={{ pl: 2, mb: 2, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Ver capas
              </Typography>
              
              {!mtt ? "Cargando..." : layersConfig.map((layer) => (
                <Box key={layer.key} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <FormControlLabel
                    sx={{ flexGrow: 1 }}
                    control={
                      <Checkbox
                        checked={selectedCapa[layer.key]}
                        onChange={() => handleLayerToggle(layer.key)}
                        icon={layer.icon}
                        checkedIcon={layer.icon}
                      />
                    }
                    label={`${layer.label} ${layer.count !== undefined ? `(${layer.count})` : ""}`}
                  />
                  <IconButton onClick={layer.refresh} size="small" disabled={loadingGet}>
                    <Refresh fontSize="small" className={loadingGet ? "animate-spin" : ""} />
                  </IconButton>
                </Box>
              ))}
              
              <Divider sx={{ my: 2 }} />
              {/* Resto de Checkboxes manuales... */}
            </Box>
          }
        />
      </Grid>

      <Grid item size={{xs:12, md:9}}>
        <MapMark
          position={[-3.9965787520553717, -79.20168563157956]}
          zoom={10}
          dataAF={afectaciones}
          dataAC={acciones}
          dataRE={requerimientos}
          loading={loadingGet}
          selectCapa={selectedCapa}
          mtt={mtt}
          layersConfig={layersConfig}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          onMapClick={handleClickOpen} // Asumiendo que MapMark tiene esta prop
        />
        <DialogAfect
          mtt={mtt}
          open={openAF}
          coordinates={coordinates}
          member={member}
          onClose={() => setOpenAF(false)}
        />
      </Grid>
    </Grid>
  );
}

export default BodyCOE;