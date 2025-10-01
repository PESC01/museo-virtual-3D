import { useEffect, useState } from 'react';

export const MobileControls = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Indicador de área de movimiento (izquierda) */}
      <div className="absolute left-4 bottom-4 w-32 h-32 pointer-events-auto">
        <div className="relative w-full h-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full flex items-center justify-center">
          <div className="absolute w-12 h-12 bg-white/20 rounded-full" />
          <div className="text-white/50 text-xs font-medium">MOVER</div>
        </div>
      </div>

      {/* Indicador de área de mirar (derecha) */}
      <div className="absolute right-4 bottom-4 w-32 h-32 pointer-events-auto">
        <div className="relative w-full h-full bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full flex items-center justify-center">
          <div className="text-white/50 text-xs font-medium">MIRAR</div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
        <p className="text-white text-sm text-center">
          👈 Izquierda: Mover | Derecha: Mirar 👉
        </p>
      </div>
    </div>
  );
};
