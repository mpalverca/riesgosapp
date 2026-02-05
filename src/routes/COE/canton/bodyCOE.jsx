import React, { useEffect, useState } from "react";
import Panels from "../../../components/panels/Panels";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { useAcciones, useAfectaciones, useRecursos } from "../script_afect";
import { CheckBox } from "@mui/icons-material";
import MapMark from "./MapsView";


function BodyCOE({ ...props }) {
  const { loadingAF, errorAF, dataAF, countAF, searchAF } = useAfectaciones();
  const { loadingAC, errorAC, dataAC, countAC, searchAC } = useAcciones();  
  const { loadingRE, errorRE, dataRE, countRE, searchRE } = useRecursos();

  const [afectaciones, setAfectaciones] = useState(null);
  const [acciones, setAcciones] = useState(null);
  const [recursos, setRecursos] = useState(null);

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
  }, [dataAF, dataAC, dataRE, selectedCapa.afectaciones, selectedCapa.acciones, selectedCapa.recursos]);

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

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      <Grid item size={{ xs: 12, md: 3 }}>
        <Panels
          title={`Mesa Tecnica de trabajo/grupo de trabajo - ${props.mtt}`}
          body={
            <>
              <Typography variant="body1" align="justify">
                Capas visibles en el mapa:
              </Typography>
              <Box sx={{ pl: 2, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCapa.afectaciones}
                      onChange={() => handleLayerToggle("afectaciones")}
                      icon={<CheckBox fontSize="small" />}
                      checkedIcon={
                        <CheckBox fontSize="small" color="primary" />
                      }
                    />
                  }
                  label={`Afectaciones (${loadingAF==true?"cargando":countAF}) `}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCapa.acciones}
                      onChange={() => handleLayerToggle("acciones")}
                      icon={<CheckBox fontSize="small" />}
                      checkedIcon={
                        <CheckBox fontSize="small" color="primary" />
                      }
                    />
                  }
                  label={`Acciones (${loadingAC==true?"cargando":countAC})`}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCapa.recursos}
                      onChange={() => handleLayerToggle("recursos")}
                      icon={<CheckBox fontSize="small" />}
                      checkedIcon={
                        <CheckBox fontSize="small" color="primary" />
                      }
                    />
                  }
                  label={`Recursos (${loadingRE==true?"cargando":countRE})`}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCapa.necesidades}
                      onChange={() => handleLayerToggle("necesidades")}
                      icon={<CheckBox fontSize="small" />}
                      checkedIcon={
                        <CheckBox fontSize="small" color="primary" />
                      }
                    />
                  }
                  label="Necesidades"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCapa.requerimientos}
                      onChange={() => handleLayerToggle("requerimientos")}
                      icon={<CheckBox fontSize="small" />}
                      checkedIcon={
                        <CheckBox fontSize="small" color="primary" />
                      }
                    />
                  }
                  label={`Bandeja de Requerimientos `}
                />
              </Box>
              <Divider />
              <Box></Box>
            </>
          }
        />
      </Grid>
      <Grid item size={{ xs: 12, md: 9 }}>
        <MapMark
          position={[-3.9965787520553717, -79.20168563157956]}
          zoom={10}
          dataAF={afectaciones}          
          loading={{loadingAC,loadingAF,loadingRE}}
          selectCapa={selectedCapa}
          mtt={props.mtt}
          dataAC={acciones}
          dataRE={recursos}
        />
      </Grid>
    </Grid>
  );
}

export default BodyCOE;