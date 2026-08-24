import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";

export function createMarkerIcon(IconComponent, color) {
  const html = renderToStaticMarkup(
    <div
      style={{
        background: "white",
        borderRadius: "9999px",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 6px rgba(11,19,43,0.25)",
        border: `2px solid ${color}`,
      }}
    >
      <IconComponent size={20} color={color} weight="fill" />
    </div>,
  );

  return L.divIcon({
    html,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}
