import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Storefront, MapPinSimple } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { api } from "../../services/api";

function CreateOrder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    pickupAddress: "",
    pickupLatitude: "",
    pickupLongitude: "",
    destinationAddress: "",
    destinationLatitude: "",
    destinationLongitude: "",
  });
  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: () =>
      api.post("/orders", {
        pickupAddress: form.pickupAddress,
        pickupLatitude: Number(form.pickupLatitude),
        pickupLongitude: Number(form.pickupLongitude),
        destinationAddress: form.destinationAddress,
        destinationLatitude: Number(form.destinationLatitude),
        destinationLongitude: Number(form.destinationLongitude),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate(`/customer/orders/${data.order.id}`);
    },
    onError: (err) => setError(err.message),
  });

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    mutation.mutate();
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-text-secondary mb-6"
      >
        <ArrowLeft size={18} />
        Cancel
      </button>

      <div className="max-w-xl mx-auto bg-surface border border-border rounded-lg p-8">
        <h1 className="text-2xl font-bold text-primary">Create Order</h1>
        <p className="text-text-secondary mt-1 mb-6">Enter precise pickup and destination details.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4 font-semibold text-primary">
              <Storefront size={18} />
              Pickup Details
            </div>
            <div className="flex flex-col gap-4">
              <Input
                label="Pickup Address"
                value={form.pickupAddress}
                onChange={handleChange("pickupAddress")}
                placeholder="Enter street address"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Latitude"
                  type="number"
                  step="any"
                  min={-90}
                  max={90}
                  value={form.pickupLatitude}
                  onChange={handleChange("pickupLatitude")}
                  placeholder="e.g. 30.3561"
                  required
                />
                <Input
                  label="Longitude"
                  type="number"
                  step="any"
                  min={-180}
                  max={180}
                  value={form.pickupLongitude}
                  onChange={handleChange("pickupLongitude")}
                  placeholder="e.g. 76.3647"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4 font-semibold text-primary">
              <MapPinSimple size={18} />
              Destination Details
            </div>
            <div className="flex flex-col gap-4">
              <Input
                label="Destination Address"
                value={form.destinationAddress}
                onChange={handleChange("destinationAddress")}
                placeholder="Enter street address"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Latitude"
                  type="number"
                  step="any"
                  min={-90}
                  max={90}
                  value={form.destinationLatitude}
                  onChange={handleChange("destinationLatitude")}
                  placeholder="e.g. 30.3398"
                  required
                />
                <Input
                  label="Longitude"
                  type="number"
                  step="any"
                  min={-180}
                  max={180}
                  value={form.destinationLongitude}
                  onChange={handleChange("destinationLongitude")}
                  placeholder="e.g. 76.3869"
                  required
                />
              </div>
            </div>
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          <Button type="submit" disabled={mutation.isPending} className="flex items-center justify-center gap-2">
            {mutation.isPending ? "Creating..." : "Create Order"}
            <ArrowRight size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateOrder;
