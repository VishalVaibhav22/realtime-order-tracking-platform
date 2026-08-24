import { useQuery } from "@tanstack/react-query";
import { Truck } from "@phosphor-icons/react";
import { api } from "../../services/api";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import DriverTable from "../../components/admin/DriverTable";

function AdminDrivers() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["adminDrivers"],
    queryFn: () => api.get("/admin/drivers"),
  });

  if (isLoading) return <LoadingState label="Loading drivers" />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold text-primary mb-1">Drivers</h1>
      <p className="text-text-secondary mb-6">All registered drivers.</p>

      {data.drivers.length === 0 ? (
        <EmptyState icon={Truck} title="No drivers registered yet" />
      ) : (
        <DriverTable drivers={data.drivers} />
      )}
    </div>
  );
}

export default AdminDrivers;
