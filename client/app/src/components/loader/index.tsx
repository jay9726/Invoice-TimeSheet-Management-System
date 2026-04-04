const Loader = () => {
    return (
        <div className="flex items-center justify-center fixed inset-0 z-50 min-w-full min-h-screen backdrop-blur-xs bg-black/60">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap');
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(1.35); opacity: 0.5; }
        }
        .itsms-pulse {
          font-family: 'Orbitron', monospace;
          font-weight: 900;
          animation: pulse-scale 1.4s ease-in-out infinite;
        }
      `}</style>
            <span className="itsms-pulse text-4xl tracking-widest text-white">
                ITSMS
            </span>
        </div>
    );
}

export default Loader;