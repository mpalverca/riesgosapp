import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export const DialogAdd = ({ dialogOpen, handleCloseDialog, dialogCoords }) => {
  const [dialogData, setDialogData] = useState({
    type: "",
    subtype: "",
    specific_type: "",
    freq: 0,
    intensity: 0,
    surface: 0,
    specific_resource: "",
    desc: "",
    img: "",
  });
  const handleData = (e) => {
    const { name, value } = e.target;
    setDialogData((prev) => ({ ...prev, [name]: value }));
  };
  const renderField = (
    name,
    label,
    type = "text",
    options = [],
    props = {},
  ) => (
    <TextField
      sx={{ py: 2 }}
      name={name}
      label={label}
      type={type}
      value={dialogData[name] || ""}
      onChange={handleData}
      select={type === "select"}
      multiline={type === "textarea"}
      rows={type === "textarea" ? 5 : undefined}
      fullWidth
      disabled={name === "by" || name === "ubi"}
      {...props}
    >
      {type === "select" &&
        options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
    </TextField>
  );

  return (
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Agregar Marcador</DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 300, pt: 1 }}>
          <p>
            <strong>Coordenadas:</strong> {dialogCoords?.lat},{" "}
            {dialogCoords?.lng}
          </p>

          {renderField("type", "tipo", "select", [
            { value: "Amenaza", label: "Amenaza" },
            { value: "Recurso", label: "Recurso" },
            { value: "Vulnerabilidad", label: "Vulnerabilidad" },
          ])}
          {dialogData.type == "Amenaza" ? (
            <>
              {/* Nivel 2 - Clasificación de la amenaza */}
              {renderField("subtype", "Clasificación de Amenaza", "select", [
                { value: "natural", label: "Natural" },
                { value: "social_natural", label: "Socio Naturales" },
                { value: "antropica", label: "Antrópica" },
                { value: "tecnologica", label: "Tecnológica" },
              ])}

              {/* Nivel 3 - Subtipo específico según clasificación */}
              {dialogData.subtype == "natural" &&
                renderField("specific_type", "Natural", "select", [
                  { value: "Inundación", label: "Inundación" },
                  { value: "Movimiento_masa", label: "Movimiento en masa" },
                  { value: "Sismo", label: "Sismo" },
                  { value: "Sequía", label: "Sequía" },
                  { value: "Helada", label: "Helada" },
                  {
                    value: "Avenidas_torrenciales",
                    label: "Avenidas torrenciales",
                  },
                  { value: "Erosión_Litoral", label: "Erosión Litoral" },
                  { value: "Granizada", label: "Granizada" },
                ])}

              {dialogData.subtype == "social" &&
                renderField("specific_type", "Subtipo específico", "select", [
                  { value: "Inundación", label: "Inundación" },
                  { value: "Movimiento_masa", label: "Movimiento en masa" },
                  { value: "incendios", label: "Incendios Forestales" },
                ])}

              {dialogData.subtype == "antropica" &&
                renderField("specific_type", "Subtipo específico", "select", [
                  { value: "Aglomeración", label: "Aglomeración" },
                  { value: "Contaminación", label: "Contaminación" },
                ])}

              {dialogData.subtype == "tecnologica" &&
                renderField("specific_type", "Subtipo específico", "select", [
                  { value: "Derrames", label: "Derrames" },
                  { value: "Fugas", label: "Fugas" },
                  {
                    value: "Explociones",
                    label: "Explociones",
                  },
                  {
                    value: "incendios",
                    label: "Incendios (Estructurales y forestales)",
                  },
                ])}

              {/* Nivel 4 - Parámetros de la amenaza */}

              {renderField("freq", "Frecuencia", "select", [
                {
                  value: "1",
                  label:
                    "Baja - Evento que se presenta al menos una vez en un período de tiempo entre 5 a 20 años",
                },
                {
                  value: "2",
                  label:
                    "Media - Evento que se presenta por lo menos una vez en un período de tiempo entre 3 y 5 años.",
                },
                {
                  value: "3",
                  label:
                    "Alta - Evento que se presenta más de una vez en el año  o por lo menos una vez en un periodo de uno a  tres años ",
                },
              ])}
              {renderField("intensity", "Magnitud", "select", [
                {
                  value: "1",
                  label:
                    "Baja - Sin personas  fallecidas,mínima afectación en el territorio, sin afectación en las redes de servicios públicos, no hay interrupción en las actividades económicas",
                },
                {
                  value: "2",
                  label:
                    "Media - Pocas personas fallecidas,  afectaciones en las redes de servicios públicos, suspensión temporal de actividades económicas,pocas viviendas destruidas y varias viviendas averiadas.",
                },
                {
                  value: "3",
                  label:
                    "Alta - Numerosas personas fallecidas, , suspensión de servicios públicos básicos y de actividades económicas durante varios meses y un gran número de viviendas destruidas. ",
                },
                ,
              ])}
              {renderField("Surface", "Territorio Afectado", "select", [
                {
                  value: "1",
                  label:
                    "Baja - Menos del 50% del territorio presenta algún tipo de afectación  ",
                },
                {
                  value: "2",
                  label:
                    "Media - Entre el 50% y 80% del territorio presenta afectación",
                },
                {
                  value: "3",
                  label:
                    "Alta- Más del  80% de su territorio se encuentra afectado ",
                },
                ,
              ])}
            </>
          ) : dialogData.type == "Vulnerabilidad" ? (
            <>
              {/* Nivel 2 - Tipo de vulnerabilidad */}
              {renderField("subtype", "Tipo de Vulnerabilidad", "select", [
                { value: "Fisica", label: "Física" },
                { value: "Economica", label: "Económica" },
                { value: "Social", label: "Social" },
                { value: "Ambiental", label: "Ambiental" },
              ])}
              {dialogData.subtype == "Fisica" ? (
                <Typography align="justify">
                  <strong>Vulneravilidad Física</strong> <br />
                  Está relacionada con la calidad o tipo de material utilizado y
                  el tipo de construcción de las viviendas, establecimientos
                  económicos (comerciales e industriales) y de servicios (salud,
                  educación, instituciones públicas), e infraestructura
                  socioeconómica (centrales hidroeléctricas, vías, puentes y
                  sistemas de riesgo), para asimilar los efectos de los
                  fenómenos que constituyen una amenaza. <br /> Otro aspecto
                  importante es la calidad del suelo y el lugar donde se
                  encuentran los centros poblados, cerca de fallas geológicas,
                  laderas de cerros, riberas de ríos, áreas costeras; situación
                  que incrementa significativamente su nivel de vulnerabilidad.{" "}
                  <br /> En el plan departamental de gestión del riesgo será de
                  terminado el nivel de vulnerabilidad física únicamente para la
                  infraestructura vital departamental (vías, puentes,
                  hospitales, estaciones de bomberos, estaciones de policía,
                  entre otros)
                </Typography>
              ) : dialogData.subtype == "Economica" ? (
                <Typography align="justify">
                  <strong>Vulneravilidad Económica</strong> <br />
                  Constituye el acceso que tiene la población de un determinado
                  conglomerado urbano a los activos económicos (tierra,
                  infraestructura de servicios, empleo, medios de producción,
                  entre otros), y se refleja en la capacidad de hacer frente a
                  un desastre. Está determinada por el nivel de ingresos o la
                  capacidad para satisfacer las necesidades básicas por parte de
                  la po blación. Bajo este enfoque que mide la pobreza material,
                  una persona presentará una alta vulnerabilidad económica
                  cuando es pobre y cuando no satisface dos o más necesidades
                  básicas. El índice de Necesidades Básicas Insatisfechas –NBI-
                  examina la pobreza como carencia de un conjunto de bienes
                  materiales, los cuales condensan cinco aspectos: i) Vivienda
                  inadecuada, ii) Hacinamiento crítico, iii) Acceso inadecuado a
                  servicios públicos, en especial acueducto y sanea miento
                  básico, iv) dependencia económica y v) Insistencia escolar de
                  los niños menores de 11 años
                </Typography>
              ) : dialogData.subtype == "Social" ? (
                <Typography align="justify">
                  <strong>Vulneravilidad Social</strong> <br />
                  Es el grado de resistencia del medio natural y de los seres
                  vivos que conforman un determinado ecosistema, ante la
                  presencia de la variabilidad climática. Igualmente está
                  relacionada con el deterioro del medio natural (calidad del
                  aire, agua y suelo), la deforestación, la explotación
                  irracional de los recursos naturales, exposición a
                  contaminantes tóxicos, pérdida de la biodiversidad y la
                  ruptura de la auto-recuperación del sistema ecológico.
                </Typography>
              ) : dialogData.subtype == "Ambiental" ? (
                <Typography align="justify">
                  <strong>Vulneravilidad Ambiental</strong> <br />
                  Se analiza a partir del nivel de organización y participación
                  que tiene una comunidad, para prevenir y responder ante
                  situaciones de emergencia. La población organizada (formal e
                  informalmente) puede superar más fácilmente las conse cuencias
                  de un desastre, debido a que su capacidad para prevenir y dar
                  respuesta ante una situación de emergencia es mucho más
                  efectiva y rápida.
                </Typography>
              ) : null}
            </>
          ) : dialogData.type == "Recurso" ? (
            <>
              {/* Nivel 2 - Tipo de recurso */}
              {renderField("subtype", "Tipo de Recurso", "select", [
                { value: "Equipamientos", label: "Equipamientos" },
                { value: "Social", label: "Social" },
                { value: "Recursos", label: "Recursos" },
              ])}

              {/* Nivel 3 - Ejemplos específicos según tipo */}
              {dialogData.subtype == "Equipamientos" &&
                renderField(
                  "specific_resource",
                  "Recurso Equipamientos",
                  "select",
                  [
                    { value: "a_comunal", label: "Área Comunal" },
                    { value: "a_deportiva", label: "Área Deportiva" },
                    { value: "Bomberos", label: "Bomberos" },
                    { value: "UPC", label: "UPC" },
                    { value: "Centro de salud", label: "Centro de salud" },
                    { value: "Albergue", label: "Albergue" },
                    { value: "iglesia", label: "Iglesia" },
                    { value: "otro", label: "Otro (especificar)" },
                  ],
                )}
              {dialogData.specific_resource == "otro" &&
                renderField("nombre", "especificar recurso", "text")}

              {dialogData.subtype == "Social" &&
                renderField("specific_resource", "Recurso social", "select", [
                  { value: "Red de vecinos", label: "Red de vecinos" },
                  {
                    value: "L_comunitarios",
                    label: "Líderes comunitarios",
                  },
                  {
                    value: "Organizaciones",
                    label: "Organizaciones",
                  },
                  { value: "Voluntariado", label: "Voluntariado" },
                ])}

              {dialogData.subtype == "Económico" &&
                renderField(
                  "specific_resource",
                  "Recurso económico",
                  "select",
                  [
                    { value: "Presupuesto local", label: "Presupuesto local" },
                    { value: "Seguros", label: "Seguros" },
                    { value: "Créditos", label: "Créditos" },
                  ],
                )}

              {dialogData.subtype == "Recursos" &&
                renderField(
                  "specific_resource",
                  "Recurso institucional",
                  "select",
                  [
                    {
                      value: "Plan_comu",
                      label: "Plan_comunitario",
                    },
                    {
                      value: "Sis_alerta",
                      label: "Sistemas de alerta",
                    },
                    { value: "sings", label: "Señalética" },
                    { value: "chalecos", label: "Chalecos" },
                    { value: "picos", label: "Picos" },
                    { value: "extintores", label: "Extintores" },
                    { value: "camas", label: "Camas" },
                    { value: "botiquin", label: "Botiquín" },
                    { value: "linternas", label: "Linternas" },
                    { value: "radios", label: "Radios de comunicación" },
                    { value: "generador", label: "Generador eléctrico" },
                    { value: "carpa", label: "Carpa/tienda de campaña" },
                    { value: "otro", label: "Otro (especificar)" },
                  ],
                )}
              {dialogData.specific_resource == "otro" &&
                renderField("nombre", "especificar recurso", "text")}
            </>
          ) : null}

          {renderField("desc", "Descripción", "textarea")}
          {renderField("img", "Imagen", "text")}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
