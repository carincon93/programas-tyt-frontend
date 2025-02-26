import type { Programa } from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdatePrograma } from "@/services/programa.service";

interface ProgramaFormProps {
  programa?: Programa;
  onProgramaCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function ProgramaForm({
  programa,
  onProgramaCreatedOrUpdated,
}: ProgramaFormProps) {
  const [formData, setFormData] = useState<Partial<Programa>>({
    nombre: programa?.nombre || "",
    codigoPrograma: programa?.codigoPrograma || "",
    universidadId: programa?.universidadId || undefined,
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

    const result = await createOrUpdatePrograma(programa, formData);

    if (onProgramaCreatedOrUpdated) onProgramaCreatedOrUpdated(result);
  };

  console.log(programa);

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <label htmlFor="nombre" className="flex items-center gap-1 mb-4">
          Nombre <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <label
          htmlFor="codigoPrograma"
          className="flex items-center gap-1 mb-4"
        >
          Código del programa <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="codigoPrograma"
          name="codigoPrograma"
          type="text"
          value={formData.codigoPrograma}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <label htmlFor="universidadId" className="flex items-center gap-1 mb-4">
          Universidad Id <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="universidadId"
          name="universidadId"
          type="text"
          value={formData.universidadId}
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
