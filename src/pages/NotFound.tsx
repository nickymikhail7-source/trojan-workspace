import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TrojanLogo } from "@/components/TrojanLogo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <TrojanLogo size="lg" showText={false} />
        </div>
        <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/90 font-medium transition-colors">
          ← Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
