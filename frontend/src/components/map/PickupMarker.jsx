import { Marker } from "react-leaflet";
import { Storefront } from "@phosphor-icons/react";
import { createMarkerIcon } from "./markerIcon";

const icon = createMarkerIcon(Storefront, "#F59E0B");

function PickupMarker({ position }) {
  return <Marker position={position} icon={icon} />;
}

export default PickupMarker;
