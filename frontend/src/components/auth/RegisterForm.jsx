import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../common/Button";
import Input from "../common/Input";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

const ROLE_HOME = { CUSTOMER: "/customer", DRIVER: "/driver" };

function RegisterForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("CUSTOMER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const body = { name, email, password, role };
      if (role === "DRIVER") {
        body.vehicleNumber = vehicleNumber;
      }
      const data = await api.post("/auth/register", body);
      login(data);
      navigate(ROLE_HOME[data.user.role] || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-2">
        {["CUSTOMER", "DRIVER"].map((r) => (
          <button
            type="button"
            key={r}
            onClick={() => setRole(r)}
            className={`flex-1 py-2.5 rounded text-sm font-semibold border transition-colors ${
              role === r
                ? "bg-primary text-white border-primary"
                : "bg-surface text-text-secondary border-border"
            }`}
          >
            {r === "CUSTOMER" ? "Customer" : "Driver"}
          </button>
        ))}
      </div>
      <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      {role === "DRIVER" && (
        <Input
          label="Vehicle Number"
          placeholder="e.g. PB01AB1234"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          required
        />
      )}
      {error && <p className="text-error text-sm">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full mt-2">
        {loading ? "Creating account..." : "Create Account"}
      </Button>
      <p className="text-sm text-text-secondary text-center mt-2">
        Already have an account?{" "}
        <Link to="/login" className="text-accent font-semibold">
          Login
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
