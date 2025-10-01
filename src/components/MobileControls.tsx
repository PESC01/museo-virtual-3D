import { useEffect, useState } from 'react';

export const MobileControls = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();

    // Ocultar instrucciones después de 5 segundos
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Instrucciones */}
      {showInstructions && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-md px-6 py-4 rounded-2xl max-w-sm pointer-events-auto transition-opacity duration-500">
          <h3 className="text-white text-lg font-bold text-center mb-3">
            Controles Táctiles
          </h3>
          <div className="space-y-2 text-white/90 text-sm">
            <p className="flex items-center gap-2">
              <span className="text-2xl">👆</span>
              <span>Desliza con 1 dedo para mirar alrededor</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-2xl">🤏</span>
              <span>Pellizca con 2 dedos para acercarte/alejarte</span>
            </p>
          </div>
          <button 
            onClick={() => setShowInstructions(false)}
            className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Botón para mostrar instrucciones de nuevo */}
      {!showInstructions && (
        <button
          onClick={() => setShowInstructions(true)}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-3 rounded-full pointer-events-auto transition-colors"
          title="Mostrar controles"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      )}
    </div>
  );
};
