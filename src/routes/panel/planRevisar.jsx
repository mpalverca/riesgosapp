import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetEvent } from "./script";

const PlanRevisar = ({ tramiteData }) => {
  const [tabValue, setTabValue] = useState(0);
  const [eventos, setEventos] = useState([]);
  const [sheetName] = useState("Plan");

  const { tramite } = useParams();
   
  const { read, dataEv, loadingEv, errorEv, message, success, clearGet } =
    useGetEvent();

    const access= useGetEvent();

  useEffect(() => {
    const read_i= async () => {
      await read(sheetName);
      await access.read("access")
    };

  }, []);

  // Actualizar eventos cuando dataGet cambia
  useEffect(() => {
    if (dataEv && Array.isArray(dataEv)) {
      setEventos(dataEv);
    }
  }, [dataEv]);

  console.log(access.dataEv)
 console.log(dataEv);
 
  const eventosFiltrados = eventos.filter(
    (evento) => evento.tramite === tramite,
  );
 
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };

  return (
    <Paper sx={{ width: "100%", bgcolor: "background.paper", paddingX: 2 }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="tramite data tabs"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab
          label="Información General"
          id="tab-0"
          aria-controls="tabpanel-0"
        />
        <Tab label="Detalles" id="tab-1" aria-controls="tabpanel-1" />
        <Tab label="Documentos" id="tab-2" aria-controls="tabpanel-2" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <InfoGeneral tramiteData={eventosFiltrados} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Detalles del Trámite
            </Typography>
            {tramiteData?.detalles ? (
              Object.entries(tramiteData.detalles).map(([key, value]) => (
                <Typography key={key} variant="body2" sx={{ mb: 1 }}>
                  <strong>{key}:</strong> {String(value)}
                </Typography>
              ))
            ) : (
              <Typography variant="body2">
                No hay detalles disponibles
              </Typography>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Documentos Asociados
            </Typography>
            {tramiteData?.documentos &&
            Array.isArray(tramiteData.documentos) ? (
              tramiteData.documentos.map((doc, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                  {doc}
                </Typography>
              ))
            ) : (
              <Typography variant="body2">
                No hay documentos disponibles
              </Typography>
            )}
          </CardContent>
        </Card>
      </TabPanel>
    </Paper>
  );
};

export default PlanRevisar;

const InfoGeneral = ({ tramiteData }) => {
  return;
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Información General del Trámite
      </Typography>
      {tramiteData &&
        Object.entries(tramiteData).map(([key, value]) => (
          <Typography key={key} variant="body2" sx={{ mb: 1 }}>
            <strong>{key}:</strong> {String(value)}
          </Typography>
        ))}
    </CardContent>
  </Card>;
};
