import RegisterForm from "../components/auth/RegisterForm";

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary tracking-[0.1em]">SWAY</h1>
          <p className="text-text-secondary mt-2">Create your account</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;
