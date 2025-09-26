import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Failed to log in: " + error.message);
      } else {
        toast.error("An unknown error occurred while logging in.");
      }
    }
    
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <Card className="glass-card p-6 sm:p-8 max-w-md w-full space-y-6 sm:space-y-8">
        {/* Back button for mobile */}
        <div className="flex justify-start">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="glass-card border-white/20 hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        
        <div>
          <h2 className="mt-2 text-center text-2xl sm:text-3xl font-extrabold gradient-text">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-muted-foreground">
            Or{" "}
            <Link to="/auth/signup" className="font-medium text-primary hover:text-primary/80">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-6 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="email-address" className="text-xs sm:text-sm">Email address</Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm">
              <Link to="/auth/forgot-password" className="font-medium text-primary hover:text-primary/80">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary hover:bg-gradient-secondary py-2 sm:py-3 text-sm sm:text-base"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}