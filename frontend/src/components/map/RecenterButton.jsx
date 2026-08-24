import { useMap } from "react-leaflet";
import { Crosshair } from "@phosphor-icons/react";

function RecenterButton({ bounds }) {
  const map = useMap();

  function handleClick() {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }

  return (
    <button
      onClick={handleClick}
      className="absolute right-4 top-16 z-[1000] bg-white border border-border rounded p-2 shadow-sm hover:border-primary transition-colors"
    >
      <Crosshair size={18} className="text-primary" />
    </button>
  );
}

export default RecenterButton;
