import type { Asistencia } from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateAsistencia } from "@/services/asistencia.service";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AsistenciaFormProps {
  asistencia?: Asistencia;
  asignaturaProfesorId: number;
  estudianteId: number;
  onAsistenciaCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function AsistenciaForm({
  asistencia,
  asignaturaProfesorId,
  estudianteId,
  onAsistenciaCreatedOrUpdated,
}: AsistenciaFormProps) {
  const [formData, setFormData] = useState<Partial<Asistencia>>({
    asignaturaProfesorId:
      asistencia?.asignaturaProfesorId || asignaturaProfesorId,
    estudianteId: asistencia?.estudianteId || estudianteId,
    asiste: asistencia?.asiste || undefined,
    fecha: asistencia?.fecha || "",
    observacion: asistencia?.observacion || "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

    const result = await createOrUpdateAsistencia(
      formData.asignaturaProfesorId!,
      formData.estudianteId!,
      asistencia,
      formData
    );

    if (onAsistenciaCreatedOrUpdated) {
      onAsistenciaCreatedOrUpdated(result);
    }

    if (result.ok) {
      toast(
        `Asistencia ${asistencia?.id ? "editada" : "creada"} correctamente`
      );
    }
  };

  console.log("asistencia", asistencia);

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <Label htmlFor="asistencia" className="flex items-center gap-1 mb-4">
          ¿Asistió? <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Select
          name="asiste"
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              asiste: value === "true",
            }))
          }
          defaultValue={asistencia?.asiste ? "true" : "false"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="true">Si</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
