import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center glass-card p-12 rounded-2xl max-w-md mx-6">
        <h1 className="mb-4 text-6xl font-bold gradient-text">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-primary hover:bg-gradient-secondary rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl glow-on-hover"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
