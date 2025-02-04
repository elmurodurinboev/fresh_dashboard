import {MapContainer, TileLayer, Marker, useMapEvents} from "react-leaflet";
// Default marker icon fix for Leaflet
import "leaflet/dist/leaflet.css";
import {useState} from "react";


const LocationPicker = ({onLocationSelect}) => {
  const [position, setPosition] = useState([41.55039, 60.6315]); // Default to Tashkent

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const {lat, lng} = e.latlng;
        setPosition([parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5))]);
        onLocationSelect(parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5)));
      },
    });

    return position ? <Marker position={position}/> : null;
  };

  return (
    <MapContainer center={position} zoom={16} style={{height: "400px", width: "100%"}}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker/>
    </MapContainer>
  );
};

export default LocationPicker;
