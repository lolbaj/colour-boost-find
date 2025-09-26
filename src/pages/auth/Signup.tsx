import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { ArrowLeft } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password || !displayName) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await signup(email, password, displayName);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Failed to create account: " + error.message);
      } else {
        toast.error("An unknown error occurred while creating the account.");
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
            Create a new account
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-muted-foreground">
            Or{" "}
            <Link to="/auth/login" className="font-medium text-primary hover:text-primary/80">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-6 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="display-name" className="text-xs sm:text-sm">Full Name</Label>
              <Input
                id="display-name"
                name="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-xs sm:text-sm">Confirm Password</Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary hover:bg-gradient-secondary py-2 sm:py-3 text-sm sm:text-base"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}