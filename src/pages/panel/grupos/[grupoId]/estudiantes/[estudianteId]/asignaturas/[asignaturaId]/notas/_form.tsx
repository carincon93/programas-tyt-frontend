import type { Nota } from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateNota } from "@/services/nota.service";

interface NotaFormProps {
  nota?: Nota;
  asignaturaId: number;
  estudianteId: number;
  onNotaCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function NotaForm({
  nota,
  asignaturaId,
  estudianteId,
  onNotaCreatedOrUpdated,
}: NotaFormProps) {
  const [formData, setFormData] = useState<Partial<Nota>>({
    asignaturaId: nota?.asignaturaId || asignaturaId,
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
    if (!asignaturaId && !estudianteId) return;

    const result = await createOrUpdateNota(
      formData.asignaturaId!,
      formData.estudianteId!,
      nota,
      formData
    );

    if (onNotaCreatedOrUpdated) onNotaCreatedOrUpdated(result);
  };

  console.log(nota);

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <label htmlFor="nota" className="flex items-center gap-1 mb-4">
          Nota <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
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
