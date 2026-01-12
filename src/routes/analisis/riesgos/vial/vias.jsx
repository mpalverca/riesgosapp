import React, { useEffect, useState } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Button } from "primereact/button";

/*
    Vias.jsx
    - carga datos desde una API (ruta ejemplo '/api/vias') usando la función loadVias
    - muestra los datos en un DataView (PrimeReact)
    - incluye cambio de layout (grid/list) y plantillas de render
    Asegúrate de tener primereact y los estilos cargados en tu proyecto:
    npm install primereact primeicons
*/

export default function Vias({}) {
    const [vias, setVias] = useState([]);
    const [layout, setLayout] = useState("list");
    const [loading, setLoading] = useState(false);

    // Función que obtiene datos desde una fuente (API). Se puede adaptar a tu endpoint.
    async function loadVias() {
        setLoading(true);
        try {
            const res = await fetch("/api/vias"); // cambia la URL según tu backend
            if (!res.ok) throw new Error("Fetch failed");
            const data = await res.json();
            setVias(Array.isArray(data) ? data : []);
        } catch (err) {
            // fallback con datos de ejemplo si no hay API
            setVias([
                { id: 1, nombre: "Av. Principal", tipo: "Avenida", estado: "Activa" },
                { id: 2, nombre: "Calle Secundaria", tipo: "Calle", estado: "En obra" },
                { id: 3, nombre: "Ruta 45", tipo: "Ruta", estado: "Cerrada" },
            ]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadVias();
    }, []);

    const itemTemplate = (via, layoutMode) => {
        if (!via) return null;
        if (layoutMode === "list") {
            return (
                <div className="p-col-12" style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ fontWeight: 700 }}>{via.nombre}</div>
                            <div style={{ color: "#555" }}>{via.tipo} — {via.estado}</div>
                        </div>
                        <div>
                            <Button label="Ver" icon="pi pi-search" className="p-button-text" />
                        </div>
                    </div>
                </div>
            );
        } else {
            // grid
            return (
                <div className="p-col-12 p-md-4" style={{ padding: 12 }}>
                    <div style={{ border: "1px solid #eee", borderRadius: 6, padding: 12 }}>
                        <div style={{ fontWeight: 700, marginBottom: 6 }}>{via.nombre}</div>
                        <div style={{ color: "#555", marginBottom: 10 }}>{via.tipo}</div>
                        <div style={{ fontSize: 12, color: "#777" }}>{via.estado}</div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>Vías</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                    <Button label="Actualizar" icon="pi pi-refresh" onClick={loadVias} loading={loading} />
                </div>
            </div>

            <DataView value={vias} layout={layout} itemTemplate={itemTemplate} paginator rows={6} emptyMessage="No hay vías disponibles" />
        </div>
    );
}