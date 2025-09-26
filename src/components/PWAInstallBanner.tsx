import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, X } from "lucide-react";
import { useState } from "react";

export default function PWAInstallBanner() {
  const { isInstallable, installPWA } = usePWAInstall();
  const [showBanner, setShowBanner] = useState(true);

  if (!isInstallable || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md glass-card p-4 rounded-lg border border-white/10 shadow-lg animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Install App</h3>
            <p className="text-xs text-muted-foreground">Get app-like experience</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="glass-card border-white/20 hover:bg-white/10 h-8"
            onClick={() => setShowBanner(false)}
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            className="bg-gradient-primary hover:bg-gradient-secondary h-8"
            onClick={installPWA}
          >
            Install
          </Button>
        </div>
      </div>
    </div>
  );
}