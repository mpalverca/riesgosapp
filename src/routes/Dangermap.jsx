import React, { useState, } from 'react'
import { MapContainer, TileLayer, GeoJSON, Polyline, } from 'react-leaflet';
import {Typography } from '@mui/material'

export default function Dangermap() {
  
  return (
    <div style={{ margin: '20px' }} >
      <Typography variant="h3">
        Analisis de Riesgo Predial
      </Typography>

      <Typography variant='body1' gutterBottom>
        Un informe de riesgos predial, o Informe Técnico de Riesgos,
        es un documento que identifica y evalúa las amenazas naturales
        o antrópicas que afectan a un predio, como sismos, erupciones
        volcánicas, inundaciones, etc. Este informe es crucial para
        determinar la seguridad del predio y para tomar decisiones
        informadas sobre el uso y la ocupación del suelo.
      </Typography>
      <Typography variant='body1' gutterBottom>
        La Gestión del Riesgos se hace referencia
        al proceso social de planeación, ejecución, seguimiento y
        evaluación de políticas y acciones para el conocimiento
        del riesgo y promoción de una mayor conciencia del mismo,
        con el ánimo de impedir o evitar que se genere, de
        reducirlo o controlarlo cuando ya existe y para preparar-
        se y manejar las situaciones de desastre, así como para la
        posterior recuperación.
      </Typography>
      <Typography variant="h4">Analisis de Vulnerabilidad
      </Typography>
      <Typography variant='body1' gutterBottom>
        Son las características y circunstancias de las
        comunidades, territorios o infraestructura que los hace
        susceptibles a los efectos dañinos de un evento adverso.
        Estas características y circunstancias pueden ser físicas,
        económicas, culturales, sociales, entre otras (Lit. 24  del art.
        5 de la LOGIRD).</Typography>
      <Typography variant='body1' gutterBottom>
        Para el análisis de la vulnerabilidad se debe realizar la
        identificación y caracterización de los elementos que se
        encuentran expuestos en una determinada área geográfica
        y los efectos desfavorables de una amenaza. Para esto,
        se hace necesario combinar información estadística y científica
        con los saberes existentes en la sociedad y los demás
        actores presentes en el territorio. Tener claridad acerca
        del panorama de la vulnerabilidad permite definir las medidas
        más apropiadas y efectivas para reducir el riesgo.
      </Typography>
      <Typography variant="h5">
        Vulneravilidad Fisica de la Vivienda
      </Typography>
      
    </div>
  )
}
