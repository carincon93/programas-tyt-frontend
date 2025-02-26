import type {
  Asignatura,
  AsignaturaProfesor,
  AsignaturaGrupo,
} from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateAsignaturaGrupo } from "@/services/asignatura-grupo.service";

interface AsignaturaHorarioFormProps {
  asignaturaProfesorId?: number;
  asignaturaGrupo?: AsignaturaGrupo;
  onAsignaturaHorarioCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function AsignaturaHorarioForm({
  asignaturaProfesorId,
  asignaturaGrupo,
  onAsignaturaHorarioCreatedOrUpdated,
}: AsignaturaHorarioFormProps) {
  const [formData, setFormData] = useState<Partial<AsignaturaGrupo>>({
    fecha: asignaturaGrupo?.fecha || "",
    grupoId: asignaturaGrupo?.grupoId || undefined,
    horaInicio: asignaturaGrupo?.horaInicio || "",
    horaFin: asignaturaGrupo?.horaFin || "",
    asignaturaProfesorId: asignaturaProfesorId || undefined,
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

    const result = await createOrUpdateAsignaturaGrupo(
      asignaturaGrupo,
      formData
    );

    if (onAsignaturaHorarioCreatedOrUpdated)
      onAsignaturaHorarioCreatedOrUpdated(result);
  };

  return (
    <form onSubmit={submit} className="space-y-8">
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
        <label htmlFor="horaInicio" className="flex items-center gap-1 mb-4">
          Hora inicio <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="horaInicio"
          name="horaInicio"
          type="time"
          value={formData.horaInicio}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <label htmlFor="horaFin" className="flex items-center gap-1 mb-4">
          Hora inicio <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="horaFin"
          name="horaFin"
          type="time"
          value={formData.horaFin}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <label htmlFor="grupoId" className="flex items-center gap-1 mb-4">
          Grupo Id <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="grupoId"
          name="grupoId"
          type="text"
          value={formData.grupoId}
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
