import type { Asistencia } from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateAsistencia } from "@/services/asistencia.service";

interface AsistenciaFormProps {
  asistencia?: Asistencia;
  asignaturaId: number;
  estudianteId: number;
  onAsistenciaCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function AsistenciaForm({
  asistencia,
  asignaturaId,
  estudianteId,
  onAsistenciaCreatedOrUpdated,
}: AsistenciaFormProps) {
  const [formData, setFormData] = useState<Partial<Asistencia>>({
    asignaturaId: asistencia?.asignaturaId || asignaturaId,
    estudianteId: asistencia?.estudianteId || estudianteId,
    asiste: asistencia?.asiste || undefined,
    fecha: asistencia?.fecha || "",
    observacion: asistencia?.observacion || "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    console.log(value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!asignaturaId && !estudianteId) return;

    const result = await createOrUpdateAsistencia(
      formData.asignaturaId!,
      formData.estudianteId!,
      asistencia,
      formData
    );

    if (onAsistenciaCreatedOrUpdated) onAsistenciaCreatedOrUpdated(result);
  };

  console.log("asistencia", asistencia);

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <label htmlFor="asistencia" className="flex items-center gap-1 mb-4">
          ¿Asistió? <Asterisk size={12} strokeWidth={1} />
        </label>
        <select
          name="asiste"
          onChange={handleChange}
          defaultValue={asistencia?.asiste ? "true" : "false"}
          title="¿Asistió?"
        >
          <option value="">Seleccione una opción</option>
          <option value="true">Si</option>
          <option value="false">No</option>
        </select>
      </fieldset>

      <fieldset>
        <label htmlFor="fecha" className="flex items-center gap-1 mb-4">
          Fecha <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="fecha"
          name="fecha"
          type="date"
          value={formData.fecha}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <label htmlFor="observacion" className="flex items-center gap-1 mb-4">
          Observación <Asterisk size={12} strokeWidth={1} />
        </label>
        <textarea
          id="observacion"
          name="observacion"
          value={formData.observacion}
          onChange={handleChange}
          required
        />
      </fieldset>

      <button type="submit" className="w-full mt-4">
        Guardar
      </button>
    </form>
  );
}
