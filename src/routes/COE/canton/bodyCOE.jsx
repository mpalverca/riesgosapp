import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import {
  CircleNotifications as CircleNotificationsIcon,
  DirectionsWalk as DirectionsWalkIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,

} from "@mui/icons-material";
import MapIcon from "@mui/icons-material/Map";
import WarningIcon from '@mui/icons-material/Warning';
import AppsOutageIcon from '@mui/icons-material/AppsOutage';

import Panels from "../../../components/panels/Panels";
import MapMark from "./MapsView";
import { DialogAfect } from "./popups/ImputAfect";
import { useGetInfo, useGetPoligonos } from "../script";

function BodyCOE({ mtt, member }) {
  // 1. Instancias independientes para evitar colisiones de datos
  const reqAfect = useGetInfo();
  const reqAcciones = useGetInfo();
  const reqRequ = useGetInfo();
  const reqPol = useGetPoligonos()
 // console.log(reqPol.dataPol)
  // 2. Cache local para persistir datos si se apaga la capa
  const [cache, setCache] = useState({
    afectaciones: null,
    acciones: null,
    requerimientos: null,
  });

  const [coordinates, setCoordinates] = useState(null);
  const [openAF, setOpenAF] = useState(false);
  const [selectedCapa, setSelectedCapa] = useState({
    afectaciones: false,
    acciones: false,
    requerimientos: false,
    poligono: false,
    susceptibilidad:false,
    afect_register:false
  });

  // Manejador optimizado
  const handleLayerToggle = async (layer) => {
    const isActivating = !selectedCapa[layer];
    setSelectedCapa((prev) => ({ ...prev, [layer]: isActivating }));

    if (isActivating && !cache[layer]) {
      let result;
      // Disparar la búsqueda según la instancia correspondiente
      if (layer === "afectaciones")
        result = await reqAfect.searchGet(mtt, "Afectaciones");
      if (layer === "acciones")
        result = await reqAcciones.searchGet(mtt, "Acciones");
      if (layer === "requerimientos")
        result = await reqRequ.searchGet(mtt, "Requerimiento");
      if (layer ==="poligono")
        result = await reqPol.searchPol()
      // Guardar en cache local si searchGet retorna la data directamente o usar el dataGet de la instancia
      if (result?.data) {
        setCache((prev) => ({ ...prev, [layer]: result.data }));
      }
    }
  };

  const layersConfig = [
    {
      key: "afectaciones",
      label: "Afectaciones",
      icon: <CircleNotificationsIcon />,
      instance: reqAfect,
      searchType: "Afectaciones",
      accion: (coords) => handleClickOpen(coords),
    },
    {
      key: "acciones",
      label: "Acciones",
      icon: <DirectionsWalkIcon />,
      instance: reqAcciones,
      searchType: "Acciones",
      accion: (coords) => console.log("Afectaciones en:", coords),
    },
    {
      key: "requerimientos",
      label: "Bandeja de Requerimientos",
      icon: <CheckCircleOutlineIcon />,
      instance: reqRequ,
      searchType: "Requerimientos",
      accion: (coords) => handleClickOpen(coords),
    },
  ];
  const handleClickOpen = (coordenate) => {
    setOpenAF(true);

    setCoordinates(coordenate);
  };

  /* const handleClose = (value) => {
    setOpenAF(false);
  }; */
  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {/* Sidebar - Usando Grid size v2 */}
      <Grid size={{ xs: 12, md: 3 }} sx={{ height: "90vh", overflowY: "auto" }}>
        <Panels
          title={!mtt ? "Cargando" : `Mesa Técnica/Grupo de trabajo - ${mtt}`}
          body={
            <Box
              sx={{ pl: 1, mb: 1, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Capas
              </Typography>
              <Typography variant="subtitle2" sx={{}}>
                1. Cargue la capa de poligonos definidos
              </Typography>
              <FormControlLabel
                sx={{ flexGrow: 1 }}
                control={
                  <Checkbox
                    checked={selectedCapa["poligono"]}
                    onChange={() => handleLayerToggle("poligono")}
                    icon={<MapIcon />}
                    checkedIcon={<MapIcon />}
                  />
                }
                label={`Poligono de afectación ${reqPol.loadinPol ? "Cargando" : `(${reqPol.dataPol?.data?.length || 0})`} `}
              />
              <Divider />
              <Typography variant="subtitle2" sx={{}}>
                2. Cargue la capa de Acciones de {mtt}
              </Typography>
         
              {reqPol.dataPol && layersConfig.map((layer) => (
                <Box
                  key={layer.key}
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
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
                    label={`${layer.label} ${layer.instance.loadingGet ? "Cargando" : `(${layer.instance.dataGet?.data?.length || 0})`}`}
                  />
                  {/*    <IconButton
                    onClick={() =>
                      layer.instance.searchGet(mtt, layer.searchType)
                    }
                    disabled={layer.instance.loadingGet}
                  >
                    <Refresh fontSize="small" />
                  </IconButton> */}
                </Box>
              ))}
              <Divider/>
              <Typography variant="body2" sx={{ }}>
                3. visualice afectaciones y areas de influencia registradas
              </Typography>
               <FormControlLabel
                sx={{ flexGrow: 1 }}
                control={
                  <Checkbox
                    checked={selectedCapa["afect_register"]}
                    onChange={() => handleLayerToggle("afect_register")}
                    icon={<WarningIcon />}
                    checkedIcon={<WarningIcon />}
                  />
                }
                label={`Afectaciones registradas`}
              />
               <FormControlLabel
                sx={{ flexGrow: 1 }}
                control={
                  <Checkbox
                    checked={selectedCapa["susceptibilidad"]}
                    onChange={() => handleLayerToggle("susceptibilidad")}
                    icon={<AppsOutageIcon />}
                    checkedIcon={<AppsOutageIcon />}
                  />
                }
                label={`Susceptibilidad`}
              />

            </Box>
          }
        />
      </Grid>

      {/* Mapa - Usando Grid size v2 */}
      <Grid size={{ xs: 12, md: 9 }}>
        <MapMark
          position={[-3.9965787520553717, -79.20168563157956]}
          zoom={10}
          loading={{
            loadingAF: reqAfect.loadingGet,
            loadingAC: reqAcciones?.loadingGet,
            loadingRE: reqRequ?.loadingGet,
            loadingPol: reqPol?.loadinPol
          }}
          dataAF={reqAfect.dataGet?.data}
          dataAC={reqAcciones.dataGet?.data}
          dataRE={reqRequ.dataGet?.data}
          dataPol={reqPol.dataPol?.data}
          selectCapa={selectedCapa}
          mtt={mtt}
          layersConfig={layersConfig}
          setCoordinates={setCoordinates}
          onOpenDialog={() => setOpenAF(true)}
        />
      </Grid>

      <DialogAfect
        mtt={mtt}
        open={openAF}
        dataPol={reqPol.dataPol?.data}
        coordinates={coordinates}
        member={member}
        onClose={() => setOpenAF(false)}
      />
    </Grid>
  );
}

export default BodyCOE;
