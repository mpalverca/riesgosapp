import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Tab,
  Divider,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Table,
  AlertTitle,
} from "@mui/material";
// Importa los iconos necesarios al inicio del archivo
import {
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  People as PeopleIcon,
  ListAlt as ListAltIcon,
  FiberManualRecord as FiberManualRecordIcon,
} from "@mui/icons-material";

//import SearchIcon from "@mui/icons-material/Search";
import { useSearchMembers } from "./script";
import BodyCOE from "./canton/bodyCOE";
//import { useCoeData } from "./script";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Coe_info from "../../components/utils/coe_info.json";
import { VisualRecursos } from "./recursos/Req_mtt";

const Coe = ({ role, ci, ...props }) => {
  const [value, setValue] = React.useState("1");
  const [selectedSheet, setSelectedSheet] = useState(null);
  const memberData = useSearchMembers();
  const [member, setMember] = useState(null);
  const [apoyo, setApoyo] = useState(null);
  
  // useEffect para cargar desde localStorage al inicio
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const storedMember = localStorage.getItem("memberD");
        const storedApoyo = localStorage.getItem("apoyoD");
        
        if (storedMember) {
          const parsedMember = JSON.parse(storedMember);
          setMember(parsedMember);
         // console.log("Miembro cargado desde localStorage:", parsedMember);
        }
        
        if (storedApoyo) {
          const parsedApoyo = JSON.parse(storedApoyo);
          setApoyo(parsedApoyo);
        //  console.log("Apoyo cargado desde localStorage:", parsedApoyo);
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        // Si hay error, limpiar localStorage corrupto
        localStorage.removeItem("memberD");
        localStorage.removeItem("apoyoD");
      }
    };
    
    loadFromStorage();
  }, []); // Solo al montar el componente

  // useEffect para buscar cuando cambia el CI
  useEffect(() => {
    const searchMember = async () => {
      if (!ci || ci.trim() === "") return;
      
      // Verificar si ya tenemos el miembro en localStorage
      const storedMember = localStorage.getItem("memberD");
      
      if (storedMember) {
        try {
          const parsedMember = JSON.parse(storedMember);
          
          // Si el CI coincide, actualizar estado local
          if (parsedMember.ci === ci) {
            //console.log("Miembro encontrado en localStorage");
            setMember(parsedMember);
            
            // Cargar apoyo si existe
            const storedApoyo = localStorage.getItem("apoyoD");
            if (storedApoyo) {
              setApoyo(JSON.parse(storedApoyo));
            }
            return;
          }
        } catch (error) {
          console.error("Error parsing stored member:", error);
          localStorage.removeItem("memberD");
          localStorage.removeItem("apoyoD");
        }
      }
      
      // Si no está en localStorage o no coincide, buscar
  //    console.log("Buscando miembro con CI:", ci);
      await memberData.search(ci);
    };
    
    searchMember();
  }, [ci]); // Dependencia solo en ci

  // useEffect para actualizar cuando memberData cambia (nueva búsqueda)
  useEffect(() => {
    if (memberData?.member && Object.keys(memberData.member).length > 0) {
     // console.log("Actualizando estado con datos de la búsqueda");
      setMember(memberData.member);
      
      if (memberData?.apoyo) {
        setApoyo(memberData.apoyo);
      }
    }
  }, [memberData.member, memberData.apoyo]);

  // useEffect para guardar en localStorage cuando member/apoyo cambian
  useEffect(() => {
    if (member && Object.keys(member).length > 0) {
      //console.log("Guardando miembro en localStorage");
      localStorage.setItem("memberD", JSON.stringify(member));
    }
  }, [member]);

  useEffect(() => {
    if (apoyo && Object.keys(apoyo).length > 0) {
    //  console.log("Guardando apoyo en localStorage");
      localStorage.setItem("apoyoD", JSON.stringify(apoyo));
    }
  }, [apoyo]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ p: 1, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom color="primary" align="center">
        🚨 Comité Operativo de Emergencias (COE) - MTT/GT
      </Typography>

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="COE tabs">
            <Tab label="Descripción de Mesa" value="1" />
            <Tab label="Estado del cantón" value="2" />
            <Tab label="Recursos" value="3" />
            <Tab label="Acciones" value="4" />
          </TabList>
        </Box>
        
        <TabPanel value="1">
          <SearchTerm
            setSelectedSheet={setSelectedSheet}
            selectedSheet={selectedSheet}
            ci={ci}
            loading={memberData.loading}
            error={memberData.error}
            member={member}
            apoyo={apoyo}
            found={memberData.found || !!member} // true si hay miembro
          />
        </TabPanel>
        
        <TabPanel value="2">
          <Paper elevation={3} sx={{ p: 1, mb: 1, borderRadius: 1 }}>
            <BodyCOE mtt={member?.mtt} member={member} />
          </Paper>
        </TabPanel>
        
        <TabPanel value="3">
          <Paper elevation={3} sx={{ p: 1, mb: 1, borderRadius: 1 }}>
            <VisualRecursos mtt={member?.mtt} />
          </Paper>
        </TabPanel>
        
        <TabPanel value="4">
          <Typography>En desarrollo...</Typography>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Coe;

const SearchTerm = ({
  selectedSheet,
  loading,
  error,
  member,
  apoyo,
  found,
  ci,
}) => {

  // Función para obtener valores seguros del miembro
  const getSafeMemberValue = (key) => {
    if (!member) return "No especificado";
    // Buscar en diferentes formatos de keys (mayúsculas/minúsculas)
    const keysToTry = [
      key,
      key.toLowerCase(),
      key.toUpperCase(),
      key.replace("_", ""),
    ];
    for (const k of keysToTry) {
      if (member[k] !== undefined && member[k] !== null && member[k] !== "") {
        return member[k];
      }
    }
    return "No especificado";
  };

  // Función para determinar el tipo de componente
  const getComponentType = (codigo) => {
    if (["MTT1", "MTT2", "MTT3", "MTT4"].includes(codigo)) {
      return "MTT de Atención Humanitaria";
    } else if (["MTT5", "MTT6", "MTT7"].includes(codigo)) {
      return "MTT de Atención Complementaria";
    } else if (["GT1", "GT2", "GT3"].includes(codigo)) {
      return "Grupo de Trabajo - Componente de Operaciones";
    } else {
      return "Componente de Gestión de Información";
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 1, borderRadius: 2 }}>
      {/* Resultados de búsqueda por CI */}
      {member && found && (
        <Box
          sx={{
            mt: 1,
            p: 2,
            bgcolor: "#e8f5e9",
            borderRadius: 2,
            border: "1px solid #c8e6c9",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="success.main">
              Miembro encontrado
            </Typography>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                    Nombre
                  </TableCell>
                  <TableCell>
                    {getSafeMemberValue("miembro") ||
                      getSafeMemberValue("miembros")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                    CI
                  </TableCell>
                  <TableCell>
                    {ci || getSafeMemberValue("ci") || getSafeMemberValue("CI")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                    Cargo COE
                  </TableCell>
                  <TableCell>
                    {getSafeMemberValue("cargo_COE") ||
                      getSafeMemberValue("cargo")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                    Cargo Institucional
                  </TableCell>
                  <TableCell>
                    {getSafeMemberValue("Cargo") || getSafeMemberValue("cargo")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                    MTT/GT
                  </TableCell>
                  <TableCell>
                    {getSafeMemberValue("mtt") ||
                      getSafeMemberValue("MTT") ||
                      selectedSheet}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* No encontrado */}
      {!loading && !error && ci && !found && (
        <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
          <AlertTitle>No encontrado</AlertTitle>
          No se encontró ningún miembro con CI: <strong>{ci}</strong>
        </Alert>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
           
          }}
        >
          <CircularProgress size={30} sx={{ mr: 2 }} />
          <Typography variant="body1">Actualizando...</Typography>
        </Box>
      )}

      {/* Estado vacío */}
      {!ci && !loading && !error && !member && (
        <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
          <AlertTitle>Búsqueda de miembro</AlertTitle>
          Ingrese un número de cédula (CI) para buscar
        </Alert>
      )}

      {/* Información del MTT/GT */}
      <Box>
        {Coe_info.filter((info) => info.codigo === member?.mtt).map(
          (mtt, index) => (
            <Box key={index} sx={{ mt: 3 }}>
              {/* Encabezado del Componente */}
              <Paper
                elevation={2}
                sx={{ p: 2, mb: 3, bgcolor: "#1976d2", color: "white" }}
              >
                <Typography variant="h5" align="center" fontWeight="bold">
                  {getComponentType(mtt.codigo)}
                </Typography>
                <Typography
                  variant="h4"
                  align="center"
                  fontWeight="bold"
                  sx={{ mt: 1 }}
                >
                  {mtt.codigo}: {mtt.nombre}
                </Typography>
              </Paper>

              {/* Responsable */}
              <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  <BusinessIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Institución Responsable
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {mtt.responsable}
                  </Typography>
                </Box>
              </Paper>

              {/* Instituciones de Apoyo */}
              <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  <GroupIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Instituciones de Apoyo
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {mtt.apoyo &&
                Array.isArray(mtt.apoyo) &&
                mtt.apoyo.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                          <TableCell width="50px">#</TableCell>
                          <TableCell>Institución</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mtt.apoyo.map((inst, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{inst}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ p: 2 }}
                  >
                    No hay instituciones de apoyo registradas
                  </Typography>
                )}
              </Paper>

              {/* Miembros de Apoyo */}
              {Array.isArray(apoyo) && apoyo.length > 0 && (
                <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ mb: 1, fontWeight: "bold" }}
                  >
                    <PeopleIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                    Miembros de {mtt.codigo}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Personal designado para apoyo a la gestión de emergencias
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                          <TableCell width="50px">#</TableCell>
                          <TableCell>Miembro</TableCell>
                          <TableCell>Institución</TableCell>
                          <TableCell>Cargo</TableCell>
                          <TableCell>Contacto</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apoyo.map((ap, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{ap.miembro}</TableCell>
                            <TableCell>{ap.inst}</TableCell>
                            <TableCell>{ap.cargo}</TableCell>
                            <TableCell>{ap.telf}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              )}

              {/* Misión */}
              <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  {/* <TargetIco sx={{ verticalAlign: 'middle', mr: 1 }} /> */}
                  Misión
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
                  <Typography variant="body1">{mtt.mision}</Typography>
                </Box>
              </Paper>

              {/* Funciones Principales */}
              <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  <ListAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Funciones Principales
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {mtt.responsabilidades &&
                Array.isArray(mtt.responsabilidades) &&
                mtt.responsabilidades.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                          <TableCell width="50px">#</TableCell>
                          <TableCell>Responsabilidad</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mtt.responsabilidades.map((resp, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                }}
                              >
                                <FiberManualRecordIcon
                                  sx={{
                                    fontSize: 10,
                                    mt: 0.5,
                                    mr: 1.5,
                                    color: "primary.main",
                                  }}
                                />
                                <Typography variant="body2">{resp}</Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ p: 2 }}
                  >
                    No hay responsabilidades registradas
                  </Typography>
                )}
              </Paper>
            </Box>
          ),
        )}
      </Box>
    </Paper>
  );
};
