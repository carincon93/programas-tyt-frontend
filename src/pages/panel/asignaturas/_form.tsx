import type { Asignatura } from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateAsignatura } from "@/services/asignatura.service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AsignaturaFormProps {
  asignatura?: Asignatura;
  onAsignaturaCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function AsignaturaForm({
  asignatura,
  onAsignaturaCreatedOrUpdated,
}: AsignaturaFormProps) {
  const [formData, setFormData] = useState<Partial<Asignatura>>({
    nombre: asignatura?.nombre || "",
    codigoAsignatura: asignatura?.codigoAsignatura || "",
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

    const result = await createOrUpdateAsignatura(asignatura, formData);

    if (onAsignaturaCreatedOrUpdated) {
      onAsignaturaCreatedOrUpdated(result);
    }
    if (result.ok) {
      toast(
        `Asignatura ${asignatura?.id ? "editada" : "creada"} correctamente`
      );
    }
  };

  console.log(asignatura);

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
        <Label
          htmlFor="codigoAsignatura"
          className="flex items-center gap-1 mb-4"
        >
          Código de la asignatura <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="codigoAsignatura"
          name="codigoAsignatura"
          type="text"
          value={formData.codigoAsignatura}
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
