import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { logout } from "@/services/auth.service";

export default function Logout() {
  const handleLogout = async () => {
    const response = await logout();

    if (response.ok) {
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login";
    }
  };
  return (
    <Button
      variant="ghost"
      className="mr-6 hover:cursor-pointer"
      onClick={handleLogout}
    >
      <LogOut />
    </Button>
  );
}
