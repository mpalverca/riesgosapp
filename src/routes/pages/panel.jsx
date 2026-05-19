import React from "react";

const inicialAcciones = [
  "Revisar registros",
  "Evaluar riesgos",
  "Actualizar medidas",
  "Comunicar hallazgos",
];

const Panel = () => {
  return (
    <main className="panel-page">
      <section className="panel-acciones">
        <h1>Panel Acciones Inicial</h1>
        <p>Lista inicial de acciones desde el script inicial:</p>
        <ul>
          {inicialAcciones.map((accion, index) => (
            <li key={index}>{accion}</li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Panel;
