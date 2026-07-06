import { Box, Grid, Typography, Paper, Alert } from "@mui/material";
import Panels from "../../../components/panels/Panels";
import { Layers as LayersIcon } from "@mui/icons-material";
import LayerGroup from "../canton/body_accion/LayerGroup";
import LayerControl from "../canton/body_accion/LayerControl";


export default function PanelAccion({
  mtt,
  data,
  setData,
  handleRefreshActionsGroup,
  getLayerCount,
  handleRefreshPolygonGroup,
  handleRefreshSusceptibilidadGroup,
  handleRefreshAnalysisGroup,
  isLoading,
  selectedCapa,
  handleLayerToggle,
  handleRefreshLayer,
  getLayerData,
  totalLayers,
  activeLayersCount,
}) {
  return (
    <Panels
      title={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LayersIcon fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {!mtt ? "Cargando..." : `Mesa Técnica - ${mtt}`}
          </Typography>
        </Box>
      }
      body={
        <Box sx={{ px: 1, py: 1 }}>
          {/* Grupo 1: Límites y polígonos (SOLO poligono y parroquia) */}
          <LayerGroup
            title="1. Ubicación y Límites"
            onRefreshAll={handleRefreshPolygonGroup}
            showRefreshAll={true}
          >
       
            {/* Límites parroquiales */}
            <LayerControl
              label="Límites parroquiales"
              icon={
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#4caf50",
                    borderRadius: 0.5,
                  }}
                />
              }
              color="#4caf50"
              bgColor="#e8f5e9"
              count={getLayerCount("parroquia")}
              isLoading={isLoading("parroquia")}
              isSelected={selectedCapa.parroquia}
              onToggle={() => handleLayerToggle("parroquia")}
              onRefresh={() => handleRefreshLayer("parroquia")}
            >
              <Typography variant="caption" color="text.secondary">
                Total de parroquias cargadas: {getLayerCount("parroquia")}{" "}
                <br />
              </Typography>

              {getLayerData("parroquia").map((item, index) => {
                return (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      {item.DPA_DESPAR}
                    </Typography>{" "}
                    <br />
                  </>
                );
              })}
            </LayerControl>
              {/* Límites parroquiales */}
            <LayerControl
              label="Límites Sectoriales"
              icon={
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#4c5baf",
                    borderRadius: 0.5,
                  }}
                />
              }
              color="#4caf50"
              bgColor="#e8f5e9"
              count={getLayerCount("parroquia")}
              isLoading={isLoading("parroquia")}
              isSelected={selectedCapa.parroquia}
              onToggle={() => handleLayerToggle("parroquia")}
              onRefresh={() => handleRefreshLayer("parroquia")}
            >
              <Typography variant="caption" color="text.secondary">
                Total de parroquias cargadas: {getLayerCount("parroquia")}{" "}
                <br />
              </Typography>

              {getLayerData("parroquia").map((item, index) => {
                return (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      {item.DPA_DESPAR}
                    </Typography>{" "}
                    <br />
                  </>
                );
              })}
            </LayerControl>
          </LayerGroup>

          {/* Grupo 2: Acciones del MTT */}
          <LayerGroup
            title="2. Acciones del MTT"
            onRefreshAll={handleRefreshActionsGroup}
            showRefreshAll={true}
          >
            <LayerControl
              label="Control"
              icon={
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#e6101b",
                    borderRadius: "50%",
                  }}
                />
              }
              color="#e6101b"
              bgColor="#ffe6e6"
              count={getLayerCount("afectaciones")}
              isLoading={isLoading("afectaciones")}
              isSelected={selectedCapa.afectaciones}
              onToggle={() => handleLayerToggle("afectaciones")}
              onRefresh={() => handleRefreshLayer("afectaciones")}
            >
              <Typography variant="caption" color="text.secondary">
                Registros de afectaciones: {getLayerCount("afectaciones")}
              </Typography>
              <Typography
                variant="caption"
                color="primary"
                sx={{ display: "block", cursor: "pointer" }}
              >
                Última actualización: {new Date().toLocaleTimeString()}
              </Typography>
            </LayerControl>

            <LayerControl
              label="Acciones"
              icon={
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#ff8c00",
                    borderRadius: "50%",
                  }}
                />
              }
              color="#ff8c00"
              bgColor="#fff3e0"
              count={getLayerCount("acciones")}
              isLoading={isLoading("acciones")}
              isSelected={selectedCapa.acciones}
              onToggle={() => handleLayerToggle("acciones")}
              onRefresh={() => handleRefreshLayer("acciones")}
            >
              <Typography variant="caption" color="text.secondary">
                Registros de Acciones: {getLayerCount("acciones")}
              </Typography>
              <Typography
                variant="caption"
                color="primary"
                sx={{ display: "block", cursor: "pointer" }}
              >
                Última actualización: {new Date().toLocaleTimeString()}
              </Typography>

              {(() => {
                const data = getLayerData("acciones");
                const vigente = data.filter(
                  (item) => item.estado?.toLowerCase() === "vigente",
                ).length;
                const finalizada = data.filter((item) => {
                  const estado = item.estado?.toLowerCase();
                  return estado === "finalizada" || estado === "finalizado";
                }).length;

                return (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 1 }}
                  >
                    📊 <strong style={{ color: "#2e7d32" }}>Vigente:</strong>{" "}
                    {vigente} |
                    <strong style={{ color: "#757575" }}> Finalizada:</strong>{" "}
                    {finalizada} |<strong> Total:</strong> {data.length}
                  </Typography>
                );
              })()}
            </LayerControl>

            <LayerControl
              label="Requerimientos"
              icon={
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#228b22",
                    borderRadius: "50%",
                  }}
                />
              }
              color="#228b22"
              bgColor="#e8f5e9"
              count={getLayerCount("requerimientos")}
              isLoading={isLoading("requerimientos")}
              isSelected={selectedCapa.requerimientos}
              onToggle={() => handleLayerToggle("requerimientos")}
              onRefresh={() => handleRefreshLayer("requerimientos")}
            />
            
          </LayerGroup>

          {/* Grupo 3: Capas de análisis (SOLO afect_register) */}
          <LayerGroup
            title="3. Capas de análisis"
            onRefreshAll={handleRefreshAnalysisGroup}
            showRefreshAll={true}
          >
            <LayerControl
              label="Afectaciones registradas"
              icon={
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#ff8c00",
                    borderRadius: 0.5,
                  }}
                />
              }
              color="#ff8c00"
              bgColor="#fff3e0"
              count={getLayerCount("afect_register")}
              isLoading={isLoading("afect_register")}
              isSelected={selectedCapa.afect_register}
              onToggle={() => handleLayerToggle("afect_register")}
              onRefresh={() => handleRefreshLayer("afect_register")}
            />
          </LayerGroup>

          {/* Grupo 4: Susceptibilidad del terreno (INDEPENDIENTE) */}
          <LayerGroup
            title="4. Susceptibilidad del terreno"
            onRefreshAll={handleRefreshSusceptibilidadGroup}
            showRefreshAll={true}
          >
            <LayerControl
              label="Zonas de susceptibilidad"
              icon={
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "#228b22",
                    borderRadius: 0.5,
                  }}
                />
              }
              color="#228b22"
              bgColor="#e8f5e9"
              count={getLayerCount("susceptibilidad")}
              isLoading={isLoading("susceptibilidad")}
              isSelected={selectedCapa.susceptibilidad}
              onToggle={() => handleLayerToggle("susceptibilidad")}
              onRefresh={() => handleRefreshLayer("susceptibilidad")}
            >
              <Typography variant="caption" color="text.secondary">
                Zonas de susceptibilidad: {getLayerCount("susceptibilidad")}{" "}
                áreas identificadas
              </Typography>
              {(() => {
                const data = getLayerData("susceptibilidad");

                // Contar por tipo
                const counts = {
                  movimientoMasa: 0,
                  inundacion: 0,
                  incendio: 0,
                  otros: 0,
                };

                data.forEach((item) => {
                  if (item.tipo === 1) counts.movimientoMasa++;
                  else if (item.tipo === 2) counts.inundacion++;
                  else if (item.tipo === 3) counts.incendio++;
                  else counts.otros++;
                });

                return (
                  <Box sx={{ mt: 1, pl: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
                    >
                      Distribución por tipo:
                    </Typography>

                    {counts.movimientoMasa > 0 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        🏔️ Movimiento en masa: {counts.movimientoMasa}
                      </Typography>
                    )}

                    {counts.inundacion > 0 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        💧 Inundación: {counts.inundacion}
                      </Typography>
                    )}

                    {counts.incendio > 0 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        🔥 Incendio: {counts.incendio}
                      </Typography>
                    )}

                    {counts.otros > 0 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        ❓ Otros tipos: {counts.otros}
                      </Typography>
                    )}

                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", display: "block", mt: 0.5 }}
                    >
                      Total: {data.length} zonas
                    </Typography>
                  </Box>
                );
              })()}
            </LayerControl>
          </LayerGroup>

          {/* Indicadores de estado */}
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              mt: 2,
              bgcolor: activeLayersCount > 0 ? "#e8eaf6" : "#f5f5f5",
              transition: "all 0.2s",
            }}
          >
            <Typography
              variant="caption"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              Capas activas: {activeLayersCount} / {totalLayers}
            </Typography>
          </Paper>
        </Box>
      }
    />
  );
}
