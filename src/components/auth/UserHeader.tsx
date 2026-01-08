import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export function UserHeader() {
  const { profile, signOut, isAuthenticated } = useAuthContext();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "שגיאה בהתנתקות",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "התנתקת בהצלחה",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-end mb-4">
        <Link to="/auth">
          <Button variant="outline" size="sm">
            <User className="ml-2 h-4 w-4" />
            התחברות / הרשמה
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">
          שלום, {profile?.first_name || "משתמש"}
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        <LogOut className="ml-2 h-4 w-4" />
        התנתקות
      </Button>
    </div>
  );
}
