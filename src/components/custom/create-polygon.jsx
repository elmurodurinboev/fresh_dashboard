import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import {useEffect, useRef} from "react";

const CreatePolygon = ({ setValue, value }) => {
  const featureGroupRef = useRef(null);

  // Function to convert WKT to coordinates
  const parseWKT = (wkt) => {
    if (!wkt) return [];
    const matches = wkt.match(/\(\((.*?)\)\)/);
    if (!matches || matches.length < 2) return [];

    return matches[1].split(',').map((point) => {
      const [lng, lat] = point.trim().split(' ').map(Number);
      return [lat, lng]; // Leaflet uses [lat, lng]
    });
  };

  // Load polygon from backend into the drawing layer
  useEffect(() => {
    if (value && featureGroupRef.current) {
      const polygonCoords = parseWKT(value);
      if (polygonCoords.length > 0) {
        const polygon = L.polygon(polygonCoords);
        featureGroupRef.current.clearLayers(); // Clear previous layers
        featureGroupRef.current.addLayer(polygon); // Add new polygon
      }
    }
  }, [value]);

  const handleCreated = (e) => {
    const { layer } = e;

    if (layer && layer.getLatLngs) {
      let latlngs = layer.getLatLngs()[0];

      // Close the polygon if not already closed
      if (latlngs.length > 0) {
        const firstPoint = latlngs[0];
        const lastPoint = latlngs[latlngs.length - 1];

        if (firstPoint.lat !== lastPoint.lat || firstPoint.lng !== lastPoint.lng) {
          latlngs.push(firstPoint);
        }
      }

      // Convert coordinates to WKT format
      const wktPolygon = `POLYGON((${latlngs
        .map((latlng) => `${latlng.lng} ${latlng.lat}`)
        .join(', ')}))`;

      setValue(wktPolygon);
    }
  };

  return (
    <MapContainer center={[41.55039, 60.6315]} zoom={14} style={{ height: '70vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          draw={{
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false,
            polyline: false,
            polygon: true,
          }}
          onCreated={handleCreated}
          onDeleted={() => {
            console.log('Polygon deleted');
            setValue('');
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default CreatePolygon;
