// FILE: src/components/RealMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";

// Fix default marker paths under Vite
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconRetinaUrl: marker2x, iconUrl: marker, shadowUrl: shadow });

export default function RealMap({
  lat = 6.5244,
  lng = 3.3792,
  zoom = 12,
  label = "deprowebs — Lagos HQ",
  className = "",
}) {
  const center = [lat, lng];

  return (
    <div
      className={`relative rounded-xl border overflow-hidden ${className}`}
      style={{
        borderColor: "rgba(255,255,255,.10)",
        background: "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03))",
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        zoomControl={false}
        className="w-full h-[300px] sm:h-[360px] md:h-[420px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <Marker position={center}>
          <Popup>
            <div className="font-semibold">{label}</div>
            <a
              href={`https://www.google.com/maps?q=${lat},${lng}`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Open in Google Maps
            </a>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Subtle glass footer button */}
      <a
        href={`https://www.google.com/maps?q=${lat},${lng}`}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded-md border"
        style={{ borderColor: "rgba(255,255,255,.18)", background: "rgba(0,0,0,.55)", color: "#fff" }}
      >
        Open in Google Maps
      </a>
    </div>
  );
}
