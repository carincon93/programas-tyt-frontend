import type { Universidad } from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateUniversidad } from "@/services/universidad.service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UniversidadFormProps {
  universidad?: Universidad;
  onUniversidadCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function UniversidadForm({
  universidad,
  onUniversidadCreatedOrUpdated,
}: UniversidadFormProps) {
  const [formData, setFormData] = useState<Partial<Universidad>>({
    nombre: universidad?.nombre || "",
    direccion: universidad?.direccion || "",
    telefono: universidad?.telefono || "",
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

    const result = await createOrUpdateUniversidad(universidad, formData);

    if (result.ok) {
      if (onUniversidadCreatedOrUpdated) {
        onUniversidadCreatedOrUpdated(result);
      }
      toast(
        `Universidad ${universidad?.id ? "editada" : "creada"} correctamente`
      );
    }
  };

  console.log(universidad);

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
          Dirección <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="direccion"
          name="direccion"
          type="address"
          value={formData.direccion}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <Label htmlFor="telefono" className="flex items-center gap-1 mb-4">
          Teléfono <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="telefono"
          name="telefono"
          type="text"
          value={formData.telefono}
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
