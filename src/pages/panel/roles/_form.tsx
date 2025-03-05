import type { Rol } from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateRol } from "@/services/rol.service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface RolFormProps {
  rol?: Rol;
  onRolCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function RolForm({ rol, onRolCreatedOrUpdated }: RolFormProps) {
  const [formData, setFormData] = useState<Partial<Rol>>({
    nombre: rol?.nombre || "",
    descripcion: rol?.descripcion || "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await createOrUpdateRol(rol, formData);

    if (result.ok) {
      if (onRolCreatedOrUpdated) {
        onRolCreatedOrUpdated(result);
      }
      toast(`Rol ${rol?.id ? "editado" : "creado"} correctamente`);
    }
  };

  console.log(rol);

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <Label htmlFor="nombre" className="flex items-center gap-1 mb-4">
          Nombre <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <Label htmlFor="direccion" className="flex items-center gap-1 mb-4">
          Descripción <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
      </fieldset>

      <Button type="submit" className="w-full mt-4">
        Guardar
      </Button>
    </form>
  );
}
