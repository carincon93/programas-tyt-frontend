import type { Grupo } from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateGrupo } from "@/services/grupo.service";

interface GrupoFormProps {
  grupo?: Grupo;
  onGrupoCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function GrupoForm({
  grupo,
  onGrupoCreatedOrUpdated,
}: GrupoFormProps) {
  const [formData, setFormData] = useState<Partial<Grupo>>({
    codigoGrupo: grupo?.codigoGrupo || "",
    programaId: grupo?.programaId || undefined,
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

    const result = await createOrUpdateGrupo(grupo, formData);

    if (onGrupoCreatedOrUpdated) onGrupoCreatedOrUpdated(result);
  };

  console.log(grupo);

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <label htmlFor="programaId" className="flex items-center gap-1 mb-4">
          programa id <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="programaId"
          name="programaId"
          type="text"
          value={formData.programaId}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <label htmlFor="codigoGrupo" className="flex items-center gap-1 mb-4">
          Código del grupo <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="codigoGrupo"
          name="codigoGrupo"
          type="text"
          value={formData.codigoGrupo}
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
