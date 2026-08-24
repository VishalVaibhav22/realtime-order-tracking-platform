import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import DriverMarker from "./DriverMarker";
import PickupMarker from "./PickupMarker";
import DestinationMarker from "./DestinationMarker";
import RecenterButton from "./RecenterButton";

function TrackingMap({ pickup, destination, driverLocation }) {
  const points = [pickup, destination, driverLocation].filter(Boolean);
  const center = driverLocation || pickup;
  const bounds = points.map((p) => [p.lat, p.lng]);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      zoomControl={false}
      className="w-full h-full"
      bounds={bounds.length > 1 ? bounds : undefined}
      boundsOptions={{ padding: [60, 60] }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <ZoomControl position="topright" />
      <PickupMarker position={[pickup.lat, pickup.lng]} />
      <DestinationMarker position={[destination.lat, destination.lng]} />
      {driverLocation && <DriverMarker position={[driverLocation.lat, driverLocation.lng]} />}
      <RecenterButton bounds={bounds} />
    </MapContainer>
  );
}

export default TrackingMap;
