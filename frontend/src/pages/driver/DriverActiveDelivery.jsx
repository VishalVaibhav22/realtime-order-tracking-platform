import { useParams } from "react-router-dom";
import { useState } from "react";
import { MapPinSimple } from "@phosphor-icons/react";
import useOrderTracking from "../../hooks/useOrderTracking";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import TrackingMap from "../../components/map/TrackingMap";
import ActiveDeliveryPanel from "../../components/driver/ActiveDeliveryPanel";
import { api } from "../../services/api";

function DriverActiveDelivery() {
  const { id } = useParams();
  const { order, location, status, isLoading, isError, error, refetch } = useOrderTracking(id);
  const [sharingLocation, setSharingLocation] = useState(false);
  const [watchId, setWatchId] = useState(null);

  function toggleSharing() {
    if (sharingLocation) {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setSharingLocation(false);
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not available in this browser");
      return;
    }

    const newWatchId = navigator.geolocation.watchPosition(
      (position) => {
        api
          .post("/drivers/location", {
            orderId: id,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          .catch(() => {});
      },
      () => setSharingLocation(false),
      { enableHighAccuracy: true, maximumAge: 5000 },
    );
    setWatchId(newWatchId);
    setSharingLocation(true);
  }

  if (isLoading) return <LoadingState label="Loading delivery" />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!order) return null;

  const mergedOrder = { ...order, status };

  return (
    <div className="relative h-[calc(100vh-120px)] md:h-screen flex flex-col md:block">
      <div className="absolute inset-0 z-0">
        <TrackingMap
          pickup={{ lat: order.pickupLatitude, lng: order.pickupLongitude }}
          destination={{ lat: order.destinationLatitude, lng: order.destinationLongitude }}
          driverLocation={location ? { lat: location.latitude, lng: location.longitude } : null}
        />
      </div>

      {!location && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-surface border border-border rounded-full px-4 py-1.5 text-xs font-semibold text-text-secondary shadow-sm flex items-center gap-1.5">
          <MapPinSimple size={14} />
          No location shared yet
        </div>
      )}

      <div className="relative z-[1000] mt-auto md:mt-0 md:absolute md:left-6 md:top-6 md:bottom-6 md:w-[380px] w-full max-h-[55vh] md:max-h-none">
        <ActiveDeliveryPanel
          order={mergedOrder}
          sharingLocation={sharingLocation}
          onToggleSharing={toggleSharing}
        />
      </div>
    </div>
  );
}

export default DriverActiveDelivery;
