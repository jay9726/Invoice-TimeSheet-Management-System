import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-900 via-purple-900 to-black overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/30" />
      <div className="absolute w-125 h-125 bg-pink-500/30 rounded-full blur-3xl animate-pulse -top-40 -left-40" />
      <div className="absolute w-125 h-125 bg-cyan-500/30 rounded-full blur-3xl animate-pulse -bottom-37.5 -right-37.5" />

      {/* Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-2xl rounded-2xl p-10 max-w-md w-full text-center border border-white/20 shadow-2xl">

        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-red-500/20">
            <ShieldAlert className="w-12 h-12 text-red-400 animate-bounce" />
          </div>
        </div>

        <h1 className="text-5xl font-extrabold text-white mb-2">403</h1>
        <p className="text-xl text-white/90 mb-3">Access Denied</p>

        <p className="text-white/60 mb-8">
          You don’t have permission to view this page.
          Please contact your administrator if you believe this is a mistake.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;