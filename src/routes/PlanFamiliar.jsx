import React,{useState} from 'react'
import { Grid, TextField, Typography, Box, Button,Card,TableCell,IconButton,Delete,TableHead,TableRow,Table,TableBody,Checkbox,Container } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function PlanFamiliar() {
  const [emergencyNumbers, setEmergencyNumbers] = useState('');
  const [familyMembers, setFamilyMembers] = useState([{ name: '', age: '', contact: '' }]);
  const [vulnerabilities, setVulnerabilities] = useState([{ type: '', description: '' }]);
  const [selectedItems, setSelectedItems] = useState({
    food: false,
    water: false,
    firstAid: false,
    flashlight: false,
  });

  const handleInputChange = (index, event, stateSetter) => {
    const values = [...stateSetter];
    values[index][event.target.name] = event.target.value;
    stateSetter(values);
  };

  const addRow = (stateSetter, emptyObj) => {
    stateSetter((prev) => [...prev, emptyObj]);
  };

  const handleBackpackChange = (event) => {
    setSelectedItems({ ...selectedItems, [event.target.name]: event.target.checked });
  };

  return (
    <Container>
      <h1>Plan de Emergencia Familiar</h1>
      
    </Container>
  );

  
}
