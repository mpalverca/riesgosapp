import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tab,  
} from "@mui/material";
// Importa los iconos necesarios al inicio del archivo
//import SearchIcon from "@mui/icons-material/Search";
import { useSearchMembers } from "./script";
import BodyCOE from "./canton/bodyCOE";
//import { useCoeData } from "./script";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { VisualRecursos } from "./recursos/Req_mtt";
import SearchTerm from "./memberPage";

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
           //console.log("Miembro cargado desde localStorage:", parsedMember);
        }

        if (storedApoyo) {
          const parsedApoyo = JSON.parse(storedApoyo);
          setApoyo(parsedApoyo);
            //console.log("Apoyo cargado desde localStorage:", parsedApoyo);
        }
      } catch (error) {
        // console.error("Error parsing localStorage data:", error);
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

    // Verificar localStorage primero
    const storedMember = localStorage.getItem("memberD");
    await memberData.search(ci);
   
    //console.log(memberData.member)
    if (storedMember) {
      try {
        const parsedMember = JSON.parse(storedMember);
        
        if (String(parsedMember.ci) === String(ci)) {
          //console.log("Miembro encontrado en localStorage");
          setMember(parsedMember);

          const storedApoyo = localStorage.getItem("apoyoD");
          if (storedApoyo) {
            setApoyo(JSON.parse(storedApoyo));
          }
          return; // 👈 Importante: salir si encontramos en localStorage
        }
      } catch (error) {
        console.error("Error parsing stored member:", error);
        localStorage.removeItem("memberD");
        localStorage.removeItem("apoyoD");
      }
    }

    // Solo buscar si no encontramos en localStorage
    await memberData.search(ci); // 👈 Usar search directamente
  };

  searchMember();
}, [ci, memberData.search]); // 👈 Dependencia: ci y la función search// Dependencia solo en ci

  // useEffect para actualizar cuando memberData cambia (nueva búsqueda)
  useEffect(() => {
    //console.log(memberData?.member,)
    if (memberData?.member && Object.keys(memberData.member).length > 0) {
    //   console.log("Actualizando estado con datos de la búsqueda");
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
       // console.log("Guardando apoyo en localStorage");
      localStorage.setItem("apoyoD", JSON.stringify(apoyo));
    }
  }, [apoyo]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ p: 1, margin: "0 auto" }}>
      <Typography
        variant="h4"
        gutterBottom
        color="white"
        align="center"
        sx={{ background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
          borderRadius:2,
          borderColor:"red",
          p:2,
          m:2
         }}
      >
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

