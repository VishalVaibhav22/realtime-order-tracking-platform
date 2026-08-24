import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { getSocket } from "../services/socket";

function useOrderTracking(orderId) {
  const query = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => api.get(`/orders/${orderId}`),
    enabled: !!orderId,
  });

  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState(null);
  const [eta, setEta] = useState(null);
  const [connected, setConnected] = useState(false);

  // seed live state from the initial REST fetch, before any socket event arrives
  useEffect(() => {
    if (query.data?.order) {
      setLocation(query.data.order.location);
      setStatus(query.data.order.status);
      setEta(query.data.order.eta);
    }
  }, [query.data]);

  useEffect(() => {
    if (!orderId) return;

    const socket = getSocket();
    if (!socket) return;

    function join() {
      socket.emit("join_order", { orderId }, () => {});
    }

    function handleLocationUpdate(payload) {
      if (payload.orderId !== orderId) return;
      setLocation({
        latitude: payload.latitude,
        longitude: payload.longitude,
        timestamp: payload.timestamp,
      });
      setEta(payload.eta || null);
    }

    function handleStatusUpdate(payload) {
      if (payload.orderId !== orderId) return;
      setStatus(payload.status);
      // a status change can mean the driver just got assigned, refetch to pick that up
      query.refetch();
    }

    function handleConnect() {
      setConnected(true);
      join();
    }

    function handleDisconnect() {
      setConnected(false);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("LOCATION_UPDATE", handleLocationUpdate);
    socket.on("STATUS_UPDATE", handleStatusUpdate);

    if (socket.connected) {
      setConnected(true);
      join();
    }

    return () => {
      socket.emit("leave_order", { orderId });
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("LOCATION_UPDATE", handleLocationUpdate);
      socket.off("STATUS_UPDATE", handleStatusUpdate);
    };
  }, [orderId]);

  return {
    order: query.data?.order,
    location,
    status,
    eta,
    connected,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useOrderTracking;
