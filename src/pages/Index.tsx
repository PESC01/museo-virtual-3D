import { Museum3D } from "@/components/Museum3D";
import { Info } from "lucide-react";

const Index = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <Museum3D />
      
      {/* Instructions overlay */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-6 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-accent" />
            <p className="text-sm text-foreground font-medium">
              Click y arrastra para rotar • Scroll para zoom • Arrastra para moverte
            </p>
          </div>
        </div>
      </div>
      
      {/* Title */}
      <div className="absolute bottom-8 left-8 z-10">
        <h1 className="text-4xl font-bold text-foreground mb-2">Museo Virtual 3D</h1>
        <p className="text-muted-foreground">Explora la galería de arte interactiva</p>
      </div>
    </div>
  );
};

export default Index;
