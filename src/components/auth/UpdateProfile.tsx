import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/lib/toast";

export default function UpdateProfile() {
  const { currentUser, updateDisplayName } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!displayName) {
      toast.error("Display name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await updateDisplayName(displayName);
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Failed to update profile: " + error.message);
      } else {
        toast.error("An unknown error occurred while updating the profile.");
      }
    }
    
    setLoading(false);
  }

  return (
    <Card className="glass-card p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Update Profile</h3>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <Label htmlFor="displayName" className="text-xs sm:text-sm">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
          <Input
            id="email"
            type="email"
            value={currentUser?.email || ""}
            disabled
            className="mt-1 text-sm"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-primary hover:bg-gradient-secondary py-2 sm:py-3 text-sm sm:text-base"
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Card>
  );
}