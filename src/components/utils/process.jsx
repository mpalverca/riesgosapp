import React, { useState } from 'react';

const ProcesoPasoAPaso = ({ pasos, onCompletado, onCancelar }) => {
  const [pasoActual, setPasoActual] = useState(0);

  // Función para avanzar al siguiente paso
  const siguientePaso = () => {
    if (pasoActual < pasos.length - 1) {
      setPasoActual(pasoActual + 1);
    } else {
      // Si es el último paso, ejecutar callback de completado
      if (onCompletado) onCompletado();
    }
  };

  // Función para retroceder al paso anterior
  const pasoAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  // Función para ir a un paso específico
  const irAPaso = (index) => {
    if (index >= 0 && index < pasos.length) {
      setPasoActual(index);
    }
  };

  // Función para reiniciar el proceso
  const reiniciarProceso = () => {
    setPasoActual(0);
  };

  return (
    <div className="proceso-pasos">
      {/* Indicador de progreso */}
      <div className="progreso">
        <div className="barra-progreso">
          <div 
            className="progreso-completado"
            style={{ width: `${((pasoActual + 1) / pasos.length) * 100}%` }}
          ></div>
        </div>
        <span className="contador-pasos">
          Paso {pasoActual + 1} de {pasos.length}
        </span>
      </div>

      {/* Título del paso actual */}
      <h2 className="titulo-paso">{pasos[pasoActual].title}</h2>

      {/* Contenido del paso actual */}
      <div className="contenido-paso">
        {pasos[pasoActual].content || pasos[pasoActual].component || (
          <p>Contenido del paso {pasoActual + 1}</p>
        )}
      </div>

      {/* Navegación entre pasos */}
      <div className="navegacion-pasos">
        <button
          onClick={pasoAnterior}
          disabled={pasoActual === 0}
          className="btn btn-anterior"
        >
          ← Anterior
        </button>

        <div className="indicadores-pasos">
          {pasos.map((_, index) => (
            <button
              key={index}
              onClick={() => irAPaso(index)}
              className={`indicador-paso ${index === pasoActual ? 'activo' : ''}`}
              title={`Ir al paso ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={siguientePaso}
          className="btn btn-siguiente"
        >
          {pasoActual === pasos.length - 1 ? 'Finalizar' : 'Siguiente →'}
        </button>
      </div>

      {/* Botones adicionales */}
      <div className="botones-extra">
        {onCancelar && (
          <button onClick={onCancelar} className="btn btn-cancelar">
            Cancelar
          </button>
        )}
        <button onClick={reiniciarProceso} className="btn btn-reiniciar">
          Reiniciar
        </button>
      </div>
    </div>
  );
};