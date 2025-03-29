import type { Nota } from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateNota } from "@/services/nota.service";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NotaFormProps {
  nota?: Nota;
  asignaturaProfesorId: number;
  estudianteId: number;
  onNotaCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function NotaForm({
  nota,
  asignaturaProfesorId,
  estudianteId,
  onNotaCreatedOrUpdated,
}: NotaFormProps) {
  const [formData, setFormData] = useState<Partial<Nota>>({
    asignaturaProfesorId: nota?.asignaturaProfesorId || asignaturaProfesorId,
    estudianteId: nota?.estudianteId || estudianteId,
    nota: nota?.nota || 0,
    fecha: nota?.fecha || "",
    observacion: nota?.observacion || "",
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
    if (!asignaturaProfesorId && !estudianteId) return;

    const result = await createOrUpdateNota(
      formData.asignaturaProfesorId!,
      formData.estudianteId!,
      nota,
      formData
    );

    if (result.ok)
      if (onNotaCreatedOrUpdated) {
        onNotaCreatedOrUpdated(result);
      }
    toast(`Nota ${nota?.id ? "editada" : "creada"} correctamente`);
  };

  console.log(nota);

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <Label htmlFor="nota" className="flex items-center gap-1 mb-4">
          Nota <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="nota"
          name="nota"
          type="number"
          min="0"
          value={formData.nota}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <Label htmlFor="fecha" className="flex items-center gap-1 mb-4">
          Fecha <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="fecha"
          name="fecha"
          type="date"
          className="block"
          value={formData.fecha}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <Label htmlFor="observacion" className="flex items-center gap-1 mb-4">
          Observación <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Textarea
          id="observacion"
          name="observacion"
          value={formData.observacion}
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
