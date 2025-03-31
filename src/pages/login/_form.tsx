import type { Login } from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { login } from "@/services/auth.service";
import { toast } from "sonner";
import { setUser } from "@/store/auth.store";

interface LoginFormProps {}

export default function LoginForm({}: LoginFormProps) {
  const [formData, setFormData] = useState<Partial<Login>>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await login(formData);

    const { data } = result.data;

    if (result.ok && data.tokens) {
      const accessToken = data.tokens.accessToken;
      const refreshToken = data.tokens.refreshToken;

      if (accessToken && refreshToken) {
        // 🔥 TODO: No usar cuando el dominio no sea el mismo

        document.cookie = `auth_token=${accessToken}; secure: true; httpOnly: true;`;
        document.cookie = `refresh_token=${refreshToken}; secure: true; httpOnly: true;`;

        // Redirigir al usuario a la página deseada después del inicio de sesión
        setUser(result.data.user);
        toast(`Ha iniciado sesión correctamente.`);
        window.location.href = "/panel/inicio";
      } else {
        throw new Error("No se recibió un token en la respuesta");
      }
    } else {
      toast(result.error);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <fieldset>
        <Label htmlFor="email" className="flex items-center gap-1 mb-4">
          Correo electrónico <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <Label htmlFor="password" className="flex items-center gap-1 mb-4">
          Contraseña <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </fieldset>

      <Button type="submit" className="w-full mt-4 bg-blue-500">
        Iniciar sesión
      </Button>
    </form>
  );
}
