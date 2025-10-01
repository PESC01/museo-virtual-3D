import { Museum3D } from "@/components/Museum3D";
import { Info } from "lucide-react";

const Index = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <Museum3D />
      
      {/* Title */}
      <div className="absolute bottom-8 left-8 z-10">
        <h1 className="text-4xl font-bold text-foreground mb-2">Museo Virtual 3D</h1>
        <p className="text-muted-foreground">Explora la galería de arte interactiva</p>
      </div>
    </div>
  );
};

export default Index;
