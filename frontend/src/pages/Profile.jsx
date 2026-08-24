import { useAuth } from "../context/AuthContext";
import Avatar from "../components/common/Avatar";

function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 md:p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">Profile</h1>
      <div className="bg-surface border border-border rounded-lg p-6 flex items-center gap-4 mb-6">
        <Avatar name={user.name} size={56} />
        <div>
          <p className="font-semibold text-primary">{user.name}</p>
          <p className="text-sm text-text-secondary">{user.email}</p>
          <p className="text-xs text-text-muted uppercase tracking-wide mt-1">{user.role}</p>
          {user.driverProfile && (
            <p className="text-xs text-text-secondary mt-1">
              Vehicle: {user.driverProfile.vehicleNumber}
            </p>
          )}
        </div>
      </div>
      <button onClick={logout} className="text-error text-sm font-semibold">
        Log out
      </button>
    </div>
  );
}

export default Profile;
