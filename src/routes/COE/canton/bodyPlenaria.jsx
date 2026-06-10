import React, { useEffect, useMemo, useState } from 'react';

const LAYERS = [
  { id: 'capa1', label: 'Capa 1' },
  { id: 'capa2', label: 'Capa 2' },
  { id: 'capa3', label: 'Capa 3' },
];

const PLENARIA_DATA = [
  { id: 1, title: 'Plenaria de riesgo vial', description: 'Información sobre control y prevención en vías', layer: 'capa1' },
  { id: 2, title: 'Plenaria de desastres naturales', description: 'Reporte de eventos sísmicos y climáticos', layer: 'capa2' },
  { id: 3, title: 'Plenaria de infraestructura', description: 'Análisis de mantenimiento de estructuras', layer: 'capa3' },
  { id: 4, title: 'Plenaria combinada', description: 'Información general para varias capas', layer: 'capa1' },
];

const MTT_PROCEDURES = [
  {
    id: 'mttA',
    label: 'MTT A',
    run: (layer) => `MTT A ejecutado para ${layer}`,
  },
  {
    id: 'mttB',
    label: 'MTT B',
    run: (layer) => `MTT B ejecutado para ${layer}`,
  },
  {
    id: 'mttC',
    label: 'MTT C',
    run: (layer) => `MTT C ejecutado para ${layer}`,
  },
];

const BodyPlenaria = () => {
  const [selectedLayer, setSelectedLayer] = useState(LAYERS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [mttLog, setMttLog] = useState([]);

  useEffect(() => {
    if (!selectedLayer) {
      setMttLog([]);
      return;
    }

    const log = MTT_PROCEDURES.map((procedure) => procedure.run(selectedLayer));
    setMttLog(log);
  }, [selectedLayer]);

  const filteredPlenaria = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PLENARIA_DATA.filter((item) => {
      const matchesLayer = item.layer === selectedLayer;
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      return matchesLayer && (!query || matchesSearch);
    });
  }, [selectedLayer, searchQuery]);

  return (
    <div className="body-plenaria-container">
      <h2>Body Plenaria</h2>

      <div className="body-plenaria-controls">
        <label htmlFor="layer-select">Seleccionar capa</label>
        <select
          id="layer-select"
          value={selectedLayer}
          onChange={(event) => setSelectedLayer(event.target.value)}
        >
          {LAYERS.map((layer) => (
            <option key={layer.id} value={layer.id}>
              {layer.label}
            </option>
          ))}
        </select>

        <label htmlFor="plenaria-search">Buscar información de la plenaria</label>
        <input
          id="plenaria-search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Buscar por título o descripción"
        />
      </div>

      <div className="body-plenaria-results">
        <h3>Resultados de búsqueda</h3>
        {filteredPlenaria.length === 0 ? (
          <p>No se encontró información para la plenaria seleccionada.</p>
        ) : (
          <ul>
            {filteredPlenaria.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="body-plenaria-mtt">
        <h3>MTT ejecutados</h3>
        <ul>
          {mttLog.map((entry, index) => (
            <li key={`${entry}-${index}`}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BodyPlenaria;
