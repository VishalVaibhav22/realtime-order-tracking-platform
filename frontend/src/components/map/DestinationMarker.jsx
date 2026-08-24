import { Marker } from "react-leaflet";
import { MapPinSimple } from "@phosphor-icons/react";
import { createMarkerIcon } from "./markerIcon";

const icon = createMarkerIcon(MapPinSimple, "#0B132B");

function DestinationMarker({ position }) {
  return <Marker position={position} icon={icon} />;
}

export default DestinationMarker;
