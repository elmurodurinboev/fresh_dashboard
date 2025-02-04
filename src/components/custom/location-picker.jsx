import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet"; // Import Leaflet
import "leaflet/dist/leaflet.css";
import { useState } from "react";

// Fix missing marker icon issue in production
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Create a custom Leaflet icon
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([41.55039, 60.6315]); // Default to Urgench

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5))]);
        onLocationSelect(parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5)));
      },
    });

    return position ? <Marker position={position} icon={customIcon} /> : null;
  };

  return (
    <MapContainer center={position} zoom={16} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
};

export default LocationPicker;
