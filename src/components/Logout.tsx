import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { logout } from "@/services/auth.service";

export default function Logout() {
  const handleLogout = async () => {
    const response = await logout();

    if (response.ok) {
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
