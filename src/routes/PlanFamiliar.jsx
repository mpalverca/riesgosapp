import React, { useState } from 'react';

const PlanFamiliar = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [familyData, setFamilyData] = useState({
    apellidos: '',
    direccion: '',
    telefonoCelular: '',
    telefonoConvencional: '',
    ubicacion: '',
    añoPermiso: '',
    codigoPermiso: '',
    sinPermiso: false
  });
  const [selectedRisks, setSelectedRisks] = useState([]);
  const [otherRisks, setOtherRisks] = useState('');
  const [points, setPoints] = useState([]);
  const [showPointForm, setShowPointForm] = useState(false);
  const [pointForm, setPointForm] = useState({
    tipo: '',
    nombre: '',
    telefono: '',
    direccion: '',
    coordenadas: ''
  });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberForm, setMemberForm] = useState({
    nombre: '',
    edad: '',
    sangre: '',
    parentesco: 'Padre',
    discapacidad: '',
    responsabilidad: '',
    medicamentos: ''
  });
  const [pets, setPets] = useState([]);
  const [showPetForm, setShowPetForm] = useState(false);
  const [petForm, setPetForm] = useState({
    nombre: '',
    especie: 'Perro',
    edad: '',
    carnet: '',
    esterilizado: 'No',
    notas: ''
  });
  const [emergencyKit, setEmergencyKit] = useState({
    varios: {},
    aseo: {},
    botiquin: {}
  });
  const [otherItems, setOtherItems] = useState('');
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [showVulnerabilityForm, setShowVulnerabilityForm] = useState(false);
  const [vulnerabilityForm, setVulnerabilityForm] = useState({
    espacio: 'Toda la vivienda',
    vulnerabilidades: '',
    acciones: '',
    prioridad: 'Alta'
  });

  const toggleRisk = (risk) => {
    if (selectedRisks.includes(risk)) {
      setSelectedRisks(selectedRisks.filter(r => r !== risk));
    } else {
      setSelectedRisks([...selectedRisks, risk]);
    }
  };

  const handleFamilyDataChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFamilyData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const siguientePaso = (step) => {
    setCurrentStep(step + 1);
  };

  const anteriorPaso = (step) => {
    setCurrentStep(step - 1);
  };

  const mostrarFormularioPunto = () => {
    setShowPointForm(true);
  };

  const ocultarFormularioPunto = () => {
    setShowPointForm(false);
    setPointForm({
      tipo: '',
      nombre: '',
      telefono: '',
      direccion: '',
      coordenadas: ''
    });
  };

  const handlePointFormChange = (e) => {
    const { id, value } = e.target;
    setPointForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const guardarPunto = () => {
    setPoints([...points, pointForm]);
    ocultarFormularioPunto();
  };

  const mostrarFormularioFamiliar = () => {
    setShowMemberForm(true);
  };

  const ocultarFormularioFamiliar = () => {
    setShowMemberForm(false);
    setMemberForm({
      nombre: '',
      edad: '',
      sangre: '',
      parentesco: 'Padre',
      discapacidad: '',
      responsabilidad: '',
      medicamentos: ''
    });
  };

  const handleMemberFormChange = (e) => {
    const { id, value } = e.target;
    setMemberForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const guardarFamiliar = () => {
    setFamilyMembers([...familyMembers, memberForm]);
    ocultarFormularioFamiliar();
  };

  const mostrarFormularioMascota = () => {
    setShowPetForm(true);
  };

  const ocultarFormularioMascota = () => {
    setShowPetForm(false);
    setPetForm({
      nombre: '',
      especie: 'Perro',
      edad: '',
      carnet: '',
      esterilizado: 'No',
      notas: ''
    });
  };

  const handlePetFormChange = (e) => {
    const { id, value, name, type } = e.target;
    if (type === 'radio') {
      setPetForm(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setPetForm(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const guardarMascota = () => {
    setPets([...pets, petForm]);
    ocultarFormularioMascota();
  };

  const toggleEmergencyItem = (category, item) => {
    setEmergencyKit(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category][item]
      }
    }));
  };

  const mostrarFormularioVulnerabilidad = () => {
    setShowVulnerabilityForm(true);
  };

  const ocultarFormularioVulnerabilidad = () => {
    setShowVulnerabilityForm(false);
    setVulnerabilityForm({
      espacio: 'Toda la vivienda',
      vulnerabilidades: '',
      acciones: '',
      prioridad: 'Alta'
    });
  };

  const handleVulnerabilityFormChange = (e) => {
    const { id, value } = e.target;
    setVulnerabilityForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const guardarVulnerabilidad = () => {
    setVulnerabilities([...vulnerabilities, vulnerabilityForm]);
    ocultarFormularioVulnerabilidad();
  };

  const guardarPlanCompleto = () => {
    // Lógica para guardar el plan completo
    console.log('Plan guardado');
  };

  return (
    <div>
      {/* Paso 0: Información Básica de la Familia */}
      <section id="paso0" className={`paso ${currentStep !== 0 ? 'hidden' : ''}`}>
        <h2><span>0</span> Información Básica de la Familia</h2>
        <div className="info-box">
          <strong>📌 Datos esenciales:</strong> Esta información será vital para contactar a tu familia en caso de
          emergencia.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="required">Apellidos Familiares:</label>
            <input 
              type="text" 
              id="apellidos" 
              placeholder="Ej: Pérez González"
              value={familyData.apellidos}
              onChange={handleFamilyDataChange}
            />
          </div>
          <div className="form-group">
            <label className="required">Dirección exacta:</label>
            <input 
              type="text" 
              id="direccion" 
              placeholder="Ej: Av. Amazonas N12-34 y Av. Patria"
              value={familyData.direccion}
              onChange={handleFamilyDataChange}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="required">Teléfono celular principal:</label>
            <input 
              type="tel" 
              id="telefonoCelular" 
              placeholder="Ej: 0987654321"
              value={familyData.telefonoCelular}
              onChange={handleFamilyDataChange}
            />
          </div>
          <div className="form-group">
            <label>Teléfono convencional:</label>
            <input 
              type="tel" 
              id="telefonoConvencional" 
              placeholder="Ej: 022345678"
              value={familyData.telefonoConvencional}
              onChange={handleFamilyDataChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Ubicación (barrio/sector):</label>
          <input 
            type="text" 
            id="ubicacion" 
            placeholder="Ej: Barrio La Floresta, sector norte"
            value={familyData.ubicacion}
            onChange={handleFamilyDataChange}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="required">año de permiso de construcción:</label>
            <input 
              type="date" 
              id="añoPermiso"
              value={familyData.añoPermiso}
              onChange={handleFamilyDataChange}
            />
          </div>
          <div className="form-group">
            <label>Código de permiso de construcción:</label>
            <input 
              type="tel" 
              id="codigoPermiso" 
              placeholder="Ej: Abc123"
              value={familyData.codigoPermiso}
              onChange={handleFamilyDataChange}
            />
          </div>
          <div className="form-group">
            <input 
              type="checkbox" 
              id="sinPermiso"
              checked={familyData.sinPermiso}
              onChange={handleFamilyDataChange}
            />
            <label htmlFor="sinPermiso">No poseo permiso de construcción</label>
          </div>
        </div>

        <button onClick={() => siguientePaso(0)}>Continuar →</button>
      </section>

      {/* Paso 1: Identificación de Riesgos */}
      <section id="paso1" className={`paso ${currentStep !== 1 ? 'hidden' : ''}`}>
        <h2><span>1</span> Identificación de Amenaza</h2>
        <div className="info-box">
          <strong>📌 Recomendación</strong> Identificar correctamente los riesgos específicos de tu zona reduce en
          un 70% los daños durante emergencias.
        </div>

        <div className="risk-map-container">
          <div>
            <label className="required">Selecciona los riesgos de tu zona:</label>
            <div className="risk-options">
              <div 
                className={`risk-option ${selectedRisks.includes('sismo') ? 'selected' : ''}`} 
                onClick={() => toggleRisk('sismo')}
              >
                <span className="risk-icon">🌍</span> Sismos/Terremotos
              </div>
              <div 
                className={`risk-option ${selectedRisks.includes('inundacion') ? 'selected' : ''}`} 
                onClick={() => toggleRisk('inundacion')}
              >
                <span className="risk-icon">🌊</span> Inundaciones
              </div>
              <div 
                className={`risk-option ${selectedRisks.includes('volcan') ? 'selected' : ''}`} 
                onClick={() => toggleRisk('volcan')}
              >
                <span className="risk-icon">🌋</span> Actividad Volcánica
              </div>
              <div 
                className={`risk-option ${selectedRisks.includes('deslizamiento') ? 'selected' : ''}`} 
                onClick={() => toggleRisk('deslizamiento')}
              >
                <span className="risk-icon">⛰️</span> Movimiento de Ladera
              </div>
              <div 
                className={`risk-option ${selectedRisks.includes('incendio') ? 'selected' : ''}`} 
                onClick={() => toggleRisk('incendio')}
              >
                <span className="risk-icon">🔥</span> Incendios Forestales
              </div>
              <div 
                className={`risk-option ${selectedRisks.includes('sequia') ? 'selected' : ''}`} 
                onClick={() => toggleRisk('sequia')}
              >
                <span className="risk-icon">🏜️</span> Sequía
              </div>
              <div 
                className={`risk-option ${selectedRisks.includes('tsunami') ? 'selected' : ''}`} 
                onClick={() => toggleRisk('tsunami')}
              >
                <span className="risk-icon">🌊</span> Tsunami (zona costera)
              </div>
            </div>
            <div className="form-group">
              <label>Otros riesgos (especificar):</label>
              <input 
                type="text" 
                id="otros-riesgos" 
                placeholder="Ej: Accidentes químicos, fallas eléctricas"
                value={otherRisks}
                onChange={(e) => setOtherRisks(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label>Mapa de amenazas locales:</label>
            <div id="map-riesgos" className="map"></div>
          </div>
        </div>
        <button onClick={() => anteriorPaso(1)}>Regresar ←</button>
        <button onClick={() => siguientePaso(1)}>Continuar →</button>
      </section>

      {/* Paso 2: Mapeo de Ubicaciones */}
      <section id="paso2" className={`paso ${currentStep !== 2 ? 'hidden' : ''}`}>
        <h2><span>2</span> Mapeo de Ubicaciones</h2>
        <div className="info-box">
          <strong>ℹ️ Instrucciones:</strong>
          <ol>
            <li>Haz clic en el mapa para marcar ubicaciones importantes</li>
            <li>Selecciona el tipo de punto en el desplegable</li>
            <li>Completa la información requerida</li>
          </ol>
        </div>

        <div className="map-container">
          <div style={{ flex: 2 }}>
            <div id="map-ubicaciones" className="map"></div>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: 'var(--color-primary)' }}>Puntos mapeados:</h3>
            <div className="table-container">
              <table id="tabla-puntos">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody id="puntos-body">
                  {points.map((point, index) => (
                    <tr key={index}>
                      <td>{point.tipo}</td>
                      <td>{point.nombre}</td>
                      <td>
                        <button>Editar</button>
                        <button>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn-add" onClick={mostrarFormularioPunto}>➕ Agregar Punto</button>
          </div>
        </div>

        {/* Formulario flotante para agregar puntos */}
        <div id="form-punto" className={!showPointForm ? 'hidden' : ''}
          style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '1px solid var(--color-primary)' }}>
          <h3>Agregar Punto</h3>
          <div className="form-group">
            <label className="required">Tipo de punto:</label>
            <select id="tipo" value={pointForm.tipo} onChange={handlePointFormChange}>
              <option value="">Seleccionar...</option>
              <option value="vivienda">Vivienda</option>
              <option value="hospital">Hospital/Centro Médico</option>
              <option value="medico">Médico Familiar</option>
              <option value="familiar">Familiar</option>
              <option value="seguro">Punto Seguro</option>
            </select>
          </div>
          <div className="form-group">
            <label className="required">Nombre:</label>
            <input 
              type="text" 
              id="nombre" 
              placeholder="Ej: Hospital Metropolitano"
              value={pointForm.nombre}
              onChange={handlePointFormChange}
            />
          </div>
          <div className="form-group">
            <label>Teléfono:</label>
            <input 
              type="text" 
              id="telefono" 
              placeholder="Ej: 022345678"
              value={pointForm.telefono}
              onChange={handlePointFormChange}
            />
          </div>
          <div className="form-group">
            <label>Dirección exacta:</label>
            <input 
              type="text" 
              id="direccion" 
              placeholder="Ej: Av. Mariana de Jesús Oe3-17"
              value={pointForm.direccion}
              onChange={handlePointFormChange}
            />
          </div>
          <input type="hidden" id="coordenadas" value={pointForm.coordenadas} onChange={handlePointFormChange} />
          <button onClick={guardarPunto}>Guardar Punto</button>
          <button className="btn-danger" onClick={ocultarFormularioPunto}>Cancelar</button>
        </div>

        <button onClick={() => anteriorPaso(2)}>Regresar ←</button>
        <button onClick={() => siguientePaso(2)}>Continuar →</button>
      </section>

      {/* Paso 3: Integrantes Familiares */}
      <section id="paso3" className={`paso ${currentStep !== 3 ? 'hidden' : ''}`}>
        <h2><span>3</span> Integrantes Familiares</h2>
        <div className="info-box">
          <strong>📌 Importante:</strong> Incluye a todos los miembros del hogar, especialmente niños, adultos
          mayores y personas con discapacidad.
        </div>

        <div className="table-container">
          <table id="tabla-familia">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Tipo Sangre</th>
                <th>Parentesco</th>
                <th>Discapacidad</th>
                <th>Responsabilidad</th>
                <th>Medicamentos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="familia-body">
              {familyMembers.map((member, index) => (
                <tr key={index}>
                  <td>{member.nombre}</td>
                  <td>{member.edad}</td>
                  <td>{member.sangre}</td>
                  <td>{member.parentesco}</td>
                  <td>{member.discapacidad}</td>
                  <td>{member.responsabilidad}</td>
                  <td>{member.medicamentos}</td>
                  <td>
                    <button>Editar</button>
                    <button>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn-add" onClick={mostrarFormularioFamiliar}>➕ Agregar Familiar</button>

        {/* Formulario flotante para familiares */}
        <div id="form-familiar" className={!showMemberForm ? 'hidden' : ''}
          style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '1px solid var(--color-primary)' }}>
          <h3>Agregar Integrante Familiar</h3>
          <div className="form-group">
            <label className="required">Nombre completo:</label>
            <input 
              type="text" 
              id="nombre" 
              placeholder="Ej: María Guadalupe Pérez"
              value={memberForm.nombre}
              onChange={handleMemberFormChange}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="required">Edad:</label>
              <input 
                type="number" 
                id="edad" 
                min="0" 
                max="120"
                value={memberForm.edad}
                onChange={handleMemberFormChange}
              />
            </div>
            <div className="form-group">
              <label>Tipo de sangre:</label>
              <select id="sangre" value={memberForm.sangre} onChange={handleMemberFormChange}>
                <option value="">Desconocido</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="required">Parentesco:</label>
            <select id="parentesco" value={memberForm.parentesco} onChange={handleMemberFormChange}>
              <option value="Padre">Padre</option>
              <option value="Madre">Madre</option>
              <option value="Hijo/a">Hijo/a</option>
              <option value="Abuelo/a">Abuelo/a</option>
              <option value="Tío/a">Tío/a</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="form-group">
            <label>Discapacidad o condición especial:</label>
            <input 
              type="text" 
              id="discapacidad" 
              placeholder="Ej: Movilidad reducida, diabetes"
              value={memberForm.discapacidad}
              onChange={handleMemberFormChange}
            />
          </div>
          <div className="form-group">
            <label>Responsabilidad en emergencia:</label>
            <input 
              type="text" 
              id="responsabilidad" 
              placeholder="Ej: Llevar mochila de emergencia"
              value={memberForm.responsabilidad}
              onChange={handleMemberFormChange}
            />
          </div>
          <div className="form-group">
            <label>Medicamentos y dosis:</label>
            <textarea 
              id="medicamentos" 
              placeholder="Ej: Insulina - 20 unidades cada 8 horas"
              value={memberForm.medicamentos}
              onChange={handleMemberFormChange}
            ></textarea>
          </div>
          <button onClick={guardarFamiliar}>Guardar Integrante</button>
          <button className="btn-danger" onClick={ocultarFormularioFamiliar}>Cancelar</button>
        </div>

        <button onClick={() => siguientePaso(3)}>Continuar →</button>
      </section>

      {/* Paso 4: Mascotas de la Familia */}
      <section id="paso4" className={`paso ${currentStep !== 4 ? 'hidden' : ''}`}>
        <h2><span>4</span> Mascotas de la Familia</h2>
        <div className="info-box">
          <strong>🐾 No olvides a tus mascotas:</strong> En emergencias, ellos también necesitan protección y
          cuidados especiales.
        </div>

        <div className="table-container">
          <table id="tabla-mascotas">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especie</th>
                <th>Edad</th>
                <th>Carnet Vacunación</th>
                <th>Esterilizado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="mascotas-body">
              {pets.map((pet, index) => (
                <tr key={index}>
                  <td>{pet.nombre}</td>
                  <td>{pet.especie}</td>
                  <td>{pet.edad}</td>
                  <td>{pet.carnet}</td>
                  <td>{pet.esterilizado}</td>
                  <td>
                    <button>Editar</button>
                    <button>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn-add" onClick={mostrarFormularioMascota}>➕ Agregar Mascota</button>

        {/* Formulario flotante para mascotas */}
        <div id="form-mascota" className={!showPetForm ? 'hidden' : ''}
          style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '1px solid var(--color-primary)' }}>
          <h3>Agregar Mascota</h3>
          <div className="form-group">
            <label className="required">Nombre:</label>
            <input 
              type="text" 
              id="nombre" 
              placeholder="Ej: Firulais"
              value={petForm.nombre}
              onChange={handlePetFormChange}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="required">Especie:</label>
              <select id="especie" value={petForm.especie} onChange={handlePetFormChange}>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Roedor">Roedor</option>
                <option value="Reptil">Reptil</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label className="required">Edad (años):</label>
              <input 
                type="number" 
                id="edad" 
                min="0" 
                max="50"
                value={petForm.edad}
                onChange={handlePetFormChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Número de carnet de vacunación:</label>
            <input 
              type="text" 
              id="carnet" 
              placeholder="Ej: 123-456-789"
              value={petForm.carnet}
              onChange={handlePetFormChange}
            />
          </div>
          <div className="form-group">
            <label>Esterilizado:</label>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label><input type="radio" name="esterilizado" value="Sí" checked={petForm.esterilizado === 'Sí'} onChange={handlePetFormChange} /> Sí</label>
              <label><input type="radio" name="esterilizado" value="No" checked={petForm.esterilizado === 'No'} onChange={handlePetFormChange} /> No</label>
              <label><input type="radio" name="esterilizado" value="Desconocido" checked={petForm.esterilizado === 'Desconocido'} onChange={handlePetFormChange} /> Desconocido</label>
            </div>
          </div>
          <div className="form-group">
            <label>Notas importantes:</label>
            <textarea 
              id="notas" 
              placeholder="Ej: Tiene alergia a ciertos alimentos, necesita medicamento cada 12 horas"
              value={petForm.notas}
              onChange={handlePetFormChange}
            ></textarea>
          </div>
          <button onClick={guardarMascota}>Guardar Mascota</button>
          <button className="btn-danger" onClick={ocultarFormularioMascota}>Cancelar</button>
        </div>

        <button onClick={() => siguientePaso(4)}>Continuar →</button>
      </section>

      {/* Paso 5: Mochila de Emergencia */}
      <section id="paso5" className={`paso ${currentStep !== 5 ? 'hidden' : ''}`}>
        <h2><span>5</span> Mochila de Emergencia</h2>
        <div className="info-box">
          <strong>🎒 Recomendación:</strong> Prepara una mochila por cada miembro de la familia y mantenla en
          lugar accesible. Revisa cada 6 meses.
        </div>

        <h3 className="section-title">Varios</h3>
        <div className="checklist">
          <div className="checklist-item">
            <input 
              type="checkbox" 
              id="item-linterna" 
              checked={emergencyKit.varios.linterna || false}
              onChange={() => toggleEmergencyItem('varios', 'linterna')}
            />
            <label htmlFor="item-linterna">Linterna</label>
          </div>
          <div className="checklist-item">
            <input 
              type="checkbox" 
              id="item-pilas" 
              checked={emergencyKit.varios.pilas || false}
              onChange={() => toggleEmergencyItem('varios', 'pilas')}
            />
            <label htmlFor="item-pilas">Pilas extras</label>
          </div>
          {/* Resto de los items de la mochila de emergencia */}
        </div>

        <h3 className="section-title">Kit de Aseo</h3>
        <div className="checklist">
          <div className="checklist-item">
            <input 
              type="checkbox" 
              id="item-jabon" 
              checked={emergencyKit.aseo.jabon || false}
              onChange={() => toggleEmergencyItem('aseo', 'jabon')}
            />
            <label htmlFor="item-jabon">Jabón</label>
          </div>
          {/* Resto de los items del kit de aseo */}
        </div>

        <h3 className="section-title">Botiquín</h3>
        <div className="checklist">
          <div className="checklist-item">
            <input 
              type="checkbox" 
              id="item-guantes" 
              checked={emergencyKit.botiquin.guantes || false}
              onChange={() => toggleEmergencyItem('botiquin', 'guantes')}
            />
            <label htmlFor="item-guantes">Guantes de látex</label>
          </div>
          {/* Resto de los items del botiquín */}
        </div>

        <div className="form-group">
          <label>Otros elementos importantes para tu familia:</label>
          <textarea 
            id="otros-elementos" 
            placeholder="Ej: Medicamentos específicos, fórmula infantil, etc."
            value={otherItems}
            onChange={(e) => setOtherItems(e.target.value)}
          ></textarea>
        </div>

        <button onClick={() => siguientePaso(5)}>Continuar →</button>
      </section>

      {/* Paso 6: Vulnerabilidad de la Vivienda */}
      <section id="paso6" className={`paso ${currentStep !== 6 ? 'hidden' : ''}`}>
        <h2><span>6</span> Vulnerabilidad de la Vivienda</h2>
        <div className="info-box">
          <strong>🔍 Evaluación:</strong> Identifica las áreas más vulnerables de tu vivienda y las acciones para
          reducir riesgos.
        </div>

        <div className="table-container">
          <table id="tabla-vulnerabilidad">
            <thead>
              <tr>
                <th>Espacio Físico</th>
                <th>Vulnerabilidades</th>
                <th>Acciones de Mitigación</th>
                <th>Prioridad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="vulnerabilidad-body">
              {vulnerabilities.map((vulnerability, index) => (
                <tr key={index}>
                  <td>{vulnerability.espacio}</td>
                  <td>{vulnerability.vulnerabilidades}</td>
                  <td>{vulnerability.acciones}</td>
                  <td>{vulnerability.prioridad}</td>
                  <td>
                    <button>Editar</button>
                    <button>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn-add" onClick={mostrarFormularioVulnerabilidad}>➕ Agregar Área</button>

        {/* Formulario flotante para vulnerabilidad */}
        <div id="form-vulnerabilidad" className={!showVulnerabilityForm ? 'hidden' : ''}
          style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '1px solid var(--color-primary)' }}>
          <h3>Evaluar Área de la Vivienda</h3>
          <div className="form-group">
            <label className="required">Espacio físico:</label>
            <select 
              id="espacio" 
              value={vulnerabilityForm.espacio}
              onChange={handleVulnerabilityFormChange}
            >
              <option value="Toda la vivienda">Toda la vivienda</option>
              <option value="Sala">Sala</option>
              <option value="Comedor">Comedor</option>
              <option value="Dormitorio">Dormitorio</option>
              <option value="Cocina">Cocina</option>
              <option value="Baño">Baño</option>
              <option value="Patio">Patio</option>
              <option value="Escaleras">Escaleras</option>
            </select>
          </div>
          <div className="form-group">
            <label className="required">Vulnerabilidades identificadas:</label>
            <textarea 
              id="vulnerabilidades" 
              placeholder="Ej: Ventanas grandes sin protección sísmica, cables eléctricos expuestos"
              value={vulnerabilityForm.vulnerabilidades}
              onChange={handleVulnerabilityFormChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label className="required">Acciones para reducir vulnerabilidad:</label>
            <textarea 
              id="acciones" 
              placeholder="Ej: Instalar film de seguridad en ventanas, reorganizar cables"
              value={vulnerabilityForm.acciones}
              onChange={handleVulnerabilityFormChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Prioridad:</label>
            <select 
              id="prioridad" 
              value={vulnerabilityForm.prioridad}
              onChange={handleVulnerabilityFormChange}
            >
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          <button onClick={guardarVulnerabilidad}>Guardar Evaluación</button>
          <button className="btn-danger" onClick={ocultarFormularioVulnerabilidad}>Cancelar</button>
        </div>

        <button onClick={() => siguientePaso(6)}>Continuar →</button>
      </section>

      {/* Paso 7: Resumen y Consolidación */}
      <section id="paso7" className={`paso ${currentStep !== 7 ? 'hidden' : ''}`}>
        <h2><span>7</span> Resumen del Plan Familiar</h2>
        <div className="info-box" style={{ backgroundColor: '#d4edda', borderLeftColor: '#28a745' }}>
          <strong>✅ Plan Completo:</strong> Revisa toda la información antes de guardar. Puedes imprimir este plan
          para tenerlo físicamente.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3 style={{ color: 'var(--color-primary)' }}>Información Familiar</h3>
            <div id="resumen-familia"
              style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <p><strong>Apellidos:</strong> {familyData.apellidos}</p>
              <p><strong>Dirección:</strong> {familyData.direccion}</p>
              <p><strong>Teléfono celular:</strong> {familyData.telefonoCelular}</p>
              <p><strong>Teléfono convencional:</strong> {familyData.telefonoConvencional || 'No especificado'}</p>
              <p><strong>Ubicación:</strong> {familyData.ubicacion || 'No especificado'}</p>
            </div>

            <h3 style={{ color: 'var(--color-primary)' }}>Integrantes</h3>
            <div id="resumen-integrantes"
              style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              {familyMembers.map((member, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <p><strong>Nombre:</strong> {member.nombre}</p>
                  <p><strong>Edad:</strong> {member.edad}</p>
                  <p><strong>Parentesco:</strong> {member.parentesco}</p>
                  {member.discapacidad && <p><strong>Condición especial:</strong> {member.discapacidad}</p>}
                </div>
              ))}
            </div>

            <h3 style={{ color: 'var(--color-primary)' }}>Mascotas</h3>
            <div id="resumen-mascotas"
              style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              {pets.map((pet, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <p><strong>Nombre:</strong> {pet.nombre}</p>
                  <p><strong>Especie:</strong> {pet.especie}</p>
                  <p><strong>Edad:</strong> {pet.edad} años</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ color: 'var(--color-primary)' }}>Mapa de Ubicaciones</h3>
            <div id="map-resumen" className="map" style={{ height: '300px', marginBottom: '20px' }}></div>

            <h3 style={{ color: 'var(--color-primary)' }}>Amenazas Identificadas</h3>
            <div id="resumen-riesgos"
              style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <ul>
                {selectedRisks.map((risk, index) => (
                  <li key={index}>
                    {risk === 'sismo' && 'Sismos/Terremotos'}
                    {risk === 'inundacion' && 'Inundaciones'}
                    {risk === 'volcan' && 'Actividad Volcánica'}
                    {risk === 'deslizamiento' && 'Movimiento de Ladera'}
                    {risk === 'incendio' && 'Incendios Forestales'}
                    {risk === 'sequia' && 'Sequía'}
                    {risk === 'tsunami' && 'Tsunami (zona costera)'}
                  </li>
                ))}
                {otherRisks && <li>{otherRisks}</li>}
              </ul>
            </div>

            <h3 style={{ color: 'var(--color-primary)' }}>Vulnerabilidades Principales</h3>
            <div id="resumen-vulnerabilidad"
              style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
              {vulnerabilities.map((vulnerability, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <p><strong>{vulnerability.espacio}:</strong></p>
                  <p><strong>Vulnerabilidades:</strong> {vulnerability.vulnerabilidades}</p>
                  <p><strong>Acciones:</strong> {vulnerability.acciones}</p>
                  <p><strong>Prioridad:</strong> {vulnerability.prioridad}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h3 style={{ color: 'var(--color-primary)', marginTop: '20px' }}>Mochila de Emergencia</h3>
        <div id="resumen-mochila"
          style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4>Elementos seleccionados:</h4>
          <ul>
            {Object.entries(emergencyKit.varios).filter(([_, checked]) => checked).map(([item]) => (
              <li key={item}>{item}</li>
            ))}
            {Object.entries(emergencyKit.aseo).filter(([_, checked]) => checked).map(([item]) => (
              <li key={item}>{item}</li>
            ))}
            {Object.entries(emergencyKit.botiquin).filter(([_, checked]) => checked).map(([item]) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {otherItems && (
            <div>
              <h4>Otros elementos:</h4>
              <p>{otherItems}</p>
            </div>
          )}
        </div>

        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => window.print()} style={{ backgroundColor: 'var(--color-secondary)', color: '#333' }}>🖨️
            Imprimir Plan</button>
          <button onClick={guardarPlanCompleto} style={{ backgroundColor: 'var(--color-success)' }}>💾 Guardar Plan
            Definitivo</button>
        </div>
      </section>
    </div>
  );
};

export default PlanFamiliar;