import { Marker } from "react-leaflet";
import { CarProfile } from "@phosphor-icons/react";
import { createMarkerIcon } from "./markerIcon";

const icon = createMarkerIcon(CarProfile, "#14B8A6");

function DriverMarker({ position }) {
  return <Marker position={position} icon={icon} />;
}

export default DriverMarker;
