import { cn } from "@/lib/utils";
import { Shield, Hexagon, Triangle, Zap, Compass, Diamond, Gem, Flame, Crown, Crosshair } from "lucide-react";

interface IconOptionProps {
  name: string;
  children: React.ReactNode;
  selected?: boolean;
}

function IconOption({ name, children, selected }: IconOptionProps) {
  return (
    <div className={cn(
      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer",
      selected 
        ? "border-accent bg-accent/10" 
        : "border-border hover:border-accent/50 hover:bg-secondary"
    )}>
      <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
        {children}
      </div>
      <span className="text-xs text-muted-foreground font-medium">{name}</span>
    </div>
  );
}

export function TrojanIconOptions() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Choose Your Trojan Icon</h2>
      <div className="grid grid-cols-5 gap-3">
        
        {/* Option 1: Shield with T (Current) */}
        <IconOption name="Shield T" selected>
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" opacity="0.2" />
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M8 8h8M12 8v8" strokeWidth="2.5" />
          </svg>
        </IconOption>

        {/* Option 2: Minimal T Mark */}
        <IconOption name="T Mark">
          <span className="text-2xl font-bold text-primary-foreground tracking-tighter">T</span>
        </IconOption>

        {/* Option 3: Horse Head Silhouette */}
        <IconOption name="Horse">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary-foreground" fill="currentColor">
            <path d="M20 8c0-1-1-2-2-2h-1l-1-2c-.5-1-1.5-2-3-2-2 0-3 1.5-3 3v1H8c-1 0-2 1-2 2v2l-2 4v4c0 1 1 2 2 2h2l1 2h2l1-2h4c1 0 2-1 2-2v-3l2-3V8zm-6-3c.5 0 1 .5 1 1s-.5 1-1 1-1-.5-1-1 .5-1 1-1z"/>
          </svg>
        </IconOption>

        {/* Option 4: Hexagon T */}
        <IconOption name="Hex T">
          <div className="relative">
            <Hexagon className="h-7 w-7 text-primary-foreground" strokeWidth={1.5} />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary-foreground">T</span>
          </div>
        </IconOption>

        {/* Option 5: Triangle */}
        <IconOption name="Triangle">
          <Triangle className="h-6 w-6 text-primary-foreground" fill="currentColor" opacity={0.2} />
        </IconOption>

        {/* Option 6: Abstract Lines */}
        <IconOption name="Lines">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M4 6h16" />
            <path d="M12 6v14" />
            <path d="M8 10l4-4 4 4" />
          </svg>
        </IconOption>

        {/* Option 7: Diamond */}
        <IconOption name="Diamond">
          <Diamond className="h-6 w-6 text-primary-foreground" fill="currentColor" opacity={0.2} />
        </IconOption>

        {/* Option 8: Compass */}
        <IconOption name="Compass">
          <Compass className="h-6 w-6 text-primary-foreground" />
        </IconOption>

        {/* Option 9: Crown */}
        <IconOption name="Crown">
          <Crown className="h-6 w-6 text-primary-foreground" />
        </IconOption>

        {/* Option 10: Crosshair */}
        <IconOption name="Crosshair">
          <Crosshair className="h-6 w-6 text-primary-foreground" />
        </IconOption>

      </div>
      
      <p className="mt-4 text-sm text-muted-foreground">
        Click on any icon above to select it as your Trojan logo. Tell me which one you prefer!
      </p>
    </div>
  );
}
