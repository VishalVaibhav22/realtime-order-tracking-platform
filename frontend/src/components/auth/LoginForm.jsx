import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Envelope, Eye, EyeSlash } from "@phosphor-icons/react";
import Button from "../common/Button";
import Input from "../common/Input";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

const ROLE_HOME = { CUSTOMER: "/customer", DRIVER: "/driver", ADMIN: "/admin" };

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await api.post("/auth/login", { email, password });
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
      <div className="relative">
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Envelope size={18} className="absolute right-3 top-[38px] text-text-muted" />
      </div>
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-[38px] text-text-muted"
        >
          {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-error text-sm">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full mt-2">
        {loading ? "Logging in..." : "Login"}
      </Button>
      <p className="text-sm text-text-secondary text-center mt-2">
        No account?{" "}
        <Link to="/register" className="text-accent font-semibold">
          Register
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
