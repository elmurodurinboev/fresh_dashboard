import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import {Formatter} from "@/utils/formatter.js";

const courierIcon = L.icon({
  iconUrl: '/images/car-marker.png',
  iconSize: [36, 56],
  popupAnchor: [0, -32]
});

const CouriersMap = ({couriersLocations = [], couriersData = []}) => {

  return (
    <div className={"mt-4 flex-1 w-full overflow-auto z-10"}>
      <MapContainer center={[41.55039, 60.6315]} zoom={13} style={{height: "600px", width: "100%"}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {couriersLocations.map((location) => {
          const courier = couriersData.find((c) => c.user === location.courier_id);
          if (!courier) return null;

          return (
            <Marker
              key={courier.id}
              position={[location.latitude, location.longitude]}
              icon={courierIcon}
            >
              <Popup>
                <div>
                  <img src={courier.image} alt={courier.full_name}
                       style={{width: '50px', height: '50px', borderRadius: '50%'}}/>
                  <h3 className={"font-medium text-black"}>{courier.full_name}</h3>
                  <p>Tel: <b>{Formatter.formatPhoneNumber(courier.phone_number)}</b></p>
                  <p>Mashina: <b>{courier.car_name}</b></p>
                  <p>Mashina raqami: <b>{courier.car_number}</b></p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default CouriersMap;