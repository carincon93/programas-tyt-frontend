import type { Institucion } from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateInstitucion } from "@/services/institucion.service";

interface InstitucionFormProps {
  institucion?: Institucion;
  onInstitucionCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function InstitucionForm({
  institucion,
  onInstitucionCreatedOrUpdated,
}: InstitucionFormProps) {
  const [formData, setFormData] = useState<Partial<Institucion>>({
    nombre: institucion?.nombre || "",
    direccion: institucion?.direccion || "",
    telefono: institucion?.telefono || "",
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

    const result = await createOrUpdateInstitucion(institucion, formData);

    if (onInstitucionCreatedOrUpdated) onInstitucionCreatedOrUpdated(result);
  };

  console.log(institucion);

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
        <label htmlFor="direccion" className="flex items-center gap-1 mb-4">
          Dirección <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="direccion"
          name="direccion"
          type="address"
          value={formData.direccion}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <label htmlFor="telefono" className="flex items-center gap-1 mb-4">
          Teléfono <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="telefono"
          name="telefono"
          type="text"
          value={formData.telefono}
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
