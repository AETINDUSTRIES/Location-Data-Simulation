import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapModal({ onClose, onSelectLocation }) {
  const handleClick = (e) => {
    const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
    onSelectLocation(coords);
  };

  return (
    <div className="map-modal">
      <button className="map-close-btn" onClick={onClose}>
        Close
      </button>
      <MapContainer
        center={[25.679953991424775, 5.89845351553821]}
        zoom={3}
        style={{ height: "110px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onClick={handleClick} />
      </MapContainer>
    </div>
  );
}

function MapClickHandler({ onClick }) {
  useMapEvents({
    click: onClick,
  });
  return null;
}
