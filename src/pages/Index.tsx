import ContentGenerator from "@/components/ContentGenerator";
import PricingPlans from "@/components/PricingPlans";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Successfully logged out");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Writers
          </h1>
          {user && (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
        <p className="text-gray-600 text-center">
          Generate high-quality content with the power of AI
        </p>
        <ContentGenerator />
        <PricingPlans />
      </div>
    </div>
  );
};

export default Index;