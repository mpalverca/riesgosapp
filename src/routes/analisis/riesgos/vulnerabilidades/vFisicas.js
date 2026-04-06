export const varFisicas = [
    {
      id: "antiguedad",
      nombre: "Antigüedad de la edificación",
      opciones: [
        { valor: 1, descripcion: "Menos de 5 años" },
        { valor: 2, descripcion: "Entre 6 y 20 años" },
        { valor: 3, descripcion: "Mayor de 20 años" },
      ],
    },
    {
      id: "materiales",
      nombre: "Materiales de construcción y estado de conservación",
      opciones: [
        {
          valor: 1,
          descripcion:
            "Estructura con materiales de muy buena calidad, adecuada técnica constructiva y buen estado de conservación",
        },
        {
          valor: 2,
          descripcion:
            "Estructura de madera, concreto, adobe, bloque o acero, sin adecuada técnica constructiva y con un estado de deterioro moderado",
        },
        {
          valor: 3,
          descripcion:
            "Estructuras de adobe, madera u otros materiales, en estado precario de conservación",
        },
      ],
    },
    {
      id: "normatividad",
      nombre: "Cumplimiento de la normatividad vigente",
      opciones: [
        { valor: 1, descripcion: "Se cumple de forma estricta con las leyes" },
        { valor: 2, descripcion: "Se cumple medianamente con las leyes" },
        { valor: 3, descripcion: "No se cumple con las leyes" },
      ],
    },
    {
      id: "caracteristicas",
      nombre: "Características geológicas y tipo de suelo",
      opciones: [
        {
          valor: 1,
          descripcion:
            "Zonas que no presentan problemas de estabilidad, con buena cobertura vegetal",
        },
        {
          valor: 2,
          descripcion:
            "Zonas con indicios de inestabilidad y con poca cobertura vegetal",
        },
        {
          valor: 3,
          descripcion:
            "Zonas con problemas de estabilidad evidentes, llenos antrópicos y sin cobertura vegetal",
        },
      ],
    },
    {
      id: "localizacion",
      nombre:
        "Localización de las edificaciones con respecto a zonas de retiro a fuentes de agua y zonas de riesgo identificadas",
      opciones: [
        { valor: 1, descripcion: "Muy alejada" },
        { valor: 2, descripcion: "Medianamente cerca" },
        { valor: 3, descripcion: "Muy cercana" },
      ],
    },
  ];


  export const varEconomicas = [
  {
    id: "pobreza",
    nombre: "Situación de pobreza y seguridad alimentaria",
    opciones: [
      { valor: 1, descripcion: "Población sin pobreza y con seguridad alimentaria" },
      { valor: 2, descripcion: "Población por debajo de la línea de pobreza" },
      { valor: 3, descripcion: "Población en situación pobreza extrema" },
    ],
  },
  {
    id: "ingresos",
    nombre: "Nivel de ingresos",
    opciones: [
      { valor: 1, descripcion: "Alto nivel de ingresos" },
      { valor: 2, descripcion: "El nivel de ingresos cubre las necesidades básicas" },
      { valor: 3, descripcion: "Ingresos inferiores para suplir las necesidades básicas" },
    ],
  },
  {
    id: "servicios",
    nombre: "Acceso a los servicios públicos",
    opciones: [
      { valor: 1, descripcion: "Total cobertura de servicios públicos básicos" },
      { valor: 2, descripcion: "Regular cobertura de los servicios públicos básicos" },
      { valor: 3, descripcion: "Muy escasa cobertura de los servicios públicos básicos" },
    ],
  },
  {
    id: "mercado_laboral",
    nombre: "Acceso al mercado laboral",
    opciones: [
      { valor: 1, descripcion: "La oferta laboral es mayor que la demanda" },
      { valor: 2, descripcion: "La oferta laboral es igual a la demanda" },
      { valor: 3, descripcion: "La oferta laboral es mucho menor que la demanda" },
    ],
  },
];

export const varAmbientales = [
  {
    id: "atmosfericas",
    nombre: "Condiciones atmosféricas",
    opciones: [
      { valor: 1, descripcion: "Niveles de temperatura y/o precipitación promedio normales" },
      { valor: 2, descripcion: "Niveles de temperatura y/o precipitación ligeramente superiores al promedio normal" },
      { valor: 3, descripcion: "Niveles de temperatura y/o precipitación muy superiores al promedio normal" },
    ],
  },
  {
    id: "calidad_aire",
    nombre: "Composición y calidad del aire",
    opciones: [
      { valor: 1, descripcion: "Sin ningún grado de contaminación" },
      { valor: 2, descripcion: "Con un nivel moderado de contaminación" },
      { valor: 3, descripcion: "Alto grado de contaminación, niveles perjudiciales para la salud" },
    ],
  },
  {
    id: "calidad_agua",
    nombre: "Composición y calidad del agua",
    opciones: [
      { valor: 1, descripcion: "Sin ningún grado de contaminación" },
      { valor: 2, descripcion: "Con un nivel moderado de contaminación" },
      { valor: 3, descripcion: "Alto grado de contaminación, niveles perjudiciales para la salud" },
    ],
  },
  {
    id: "recursos_ambientales",
    nombre: "Condiciones de los recursos ambientales",
    opciones: [
      { valor: 1, descripcion: "Nivel moderado de explotación de los recursos naturales, nivel de contaminación leve, no se practica la deforestación" },
      { valor: 2, descripcion: "Alto nivel de explotación de los recursos naturales, niveles moderados de deforestación y de contaminación" },
      { valor: 3, descripcion: "Explotación indiscriminada de los recursos naturales incremento acelerado de la deforestación y de la contaminación" },
    ],
  },
];

export const varSociales = [
  {
    id: "organizacion",
    nombre: "Nivel de Organización",
    opciones: [
      { valor: 1, descripcion: "Población organizada" },
      { valor: 2, descripcion: "Población medianamente organizada" },
      { valor: 3, descripcion: "Población sin ningún tipo de organización" },
    ],
  },
  {
    id: "participacion",
    nombre: "Participación",
    opciones: [
      { valor: 1, descripcion: "Participación total de la población" },
      { valor: 2, descripcion: "Escaza participación de la población" },
      { valor: 3, descripcion: "Nula participación de la población" },
    ],
  },
  {
    id: "relacion_instituciones",
    nombre: "Grado de relación entre las organizaciones comunitarias y las instituciones",
    opciones: [
      { valor: 1, descripcion: "Fuerte relación entre las organizaciones comunitarias y las instituciones" },
      { valor: 2, descripcion: "Relaciones débiles entre las organizaciones comunitarias y las instituciones" },
      { valor: 3, descripcion: "No existen relaciones entre las organizaciones comunitarias y las instituciones" },
    ],
  },
  {
    id: "conocimiento_riesgo",
    nombre: "Conocimiento comunitario del riesgo",
    opciones: [
      { valor: 1, descripcion: "La población tiene total conocimiento de los riesgos presentes en el territorio y asume su compromiso frente al tema" },
      { valor: 2, descripcion: "La población tiene poco conocimiento de los riesgos presentes y no tiene un compromiso directo frente al tema" },
      { valor: 3, descripcion: "Sin ningún tipo de interés por el tema" },
    ],
  },
];