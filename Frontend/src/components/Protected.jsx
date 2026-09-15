import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />

        <div className="absolute w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-ping" />

        {/* Loader */}
        <div className="relative flex flex-col items-center">
          {/* Outer Ring */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border border-blue-500/20" />

            <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />

            <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin [animation-duration:1.5s]" />

            {/* Center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-sm shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-pulse">
                AI
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="mt-8 text-center">
            <h2 className="text-white text-lg font-semibold tracking-wide">
              Interview AI
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Preparing your experience
              <span className="inline-flex ml-1">
                <span className="animate-bounce [animation-delay:0ms]">.</span>

                <span className="animate-bounce [animation-delay:150ms]">
                  .
                </span>

                <span className="animate-bounce [animation-delay:300ms]">
                  .
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
  }

  return children;
};

export default Protected;
