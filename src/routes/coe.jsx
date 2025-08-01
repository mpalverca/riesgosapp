import React, { useState } from 'react'
import { Container } from '@mui/material';
import { Margin } from '@mui/icons-material';

const Coe = (props) => {

    const [newBrigada, setNewBrigada] = useState({ area: '', componente: '', nombre: '', cedula: '', telefono: '' });
    const [brigadas, setBrigadas] = useState([]);
    return (
        <div style={{ margin: '20px' }}>
          vcoe mesa
      </div>
    );
};
export default Coe;

