import type { Login } from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LoginFormProps {}

export default function LoginForm({}: LoginFormProps) {
  const [formData, setFormData] = useState<Partial<Login>>({
    correo: "administradortyt@umanizales.edu.co",
    password: "12345678",
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

    // const result = await createOrUpdateLogin(asignatura, formData);

    // if (onLoginCreatedOrUpdated) {
    //   onLoginCreatedOrUpdated(result);
    // }
    // if (result.ok) {
    //   toast(
    //     `Login ${asignatura?.id ? "editada" : "creada"} correctamente`
    //   );
    // }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <fieldset>
        <Label htmlFor="correo" className="flex items-center gap-1 mb-4">
          Correo electrónico <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="correo"
          name="correo"
          type="email"
          value={formData.correo}
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

      {/* <Button type="submit" className="w-full mt-4 bg-blue-500">
        Iniciar sesión
      </Button> */}
      <a
        href="/panel"
        className="bg-blue-600 hover:opacity-80 text-center p-2 rounded-md text-white block"
      >
        Iniciar sesión
      </a>
    </form>
  );
}
