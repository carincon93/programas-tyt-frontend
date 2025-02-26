import type { Profesor } from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateProfesor } from "@/services/profesor.service";

interface ProfesorFormProps {
  profesor?: Profesor;
  onProfesorCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function ProfesorForm({
  profesor,
  onProfesorCreatedOrUpdated,
}: ProfesorFormProps) {
  const [formData, setFormData] = useState<Partial<Profesor>>({
    user: {
      id: profesor?.user.id || undefined,
      nombres: profesor?.user.nombres || "",
      apellidos: profesor?.user.apellidos || "",
      correo: profesor?.user.correo || "",
      direccion: profesor?.user.direccion || "",
      tipoDocumento: profesor?.user.tipoDocumento || "",
      numeroDocumento: profesor?.user.numeroDocumento || "",
      telefono: profesor?.user.telefono || "",
    },
    universidadId: profesor?.universidadId || undefined,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: value,
      } as Profesor["user"],
    }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await createOrUpdateProfesor(profesor, formData);

    if (onProfesorCreatedOrUpdated) onProfesorCreatedOrUpdated(result);
  };

  console.log(profesor);

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <label htmlFor="nombres" className="flex items-center gap-1 mb-4">
          Nombres <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="nombres"
          name="nombres"
          type="text"
          value={formData.user?.nombres}
          onChange={handleChange}
          required
        />
      </fieldset>
      <fieldset>
        <label htmlFor="apellidos" className="flex items-center gap-1 mb-4">
          Apellidos <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="apellidos"
          name="apellidos"
          type="text"
          value={formData.user?.apellidos}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <label htmlFor="correo" className="flex items-center gap-1 mb-4">
          Correo electrónico <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          value={formData.user?.correo}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <label htmlFor="direccion" className="flex items-center gap-1 mb-4">
          Direccion <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="direccion"
          name="direccion"
          type="address"
          value={formData.user?.direccion}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <label htmlFor="tipoDocumento" className="flex items-center gap-1 mb-4">
          Tipo de documento <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="tipoDocumento"
          name="tipoDocumento"
          type="text"
          value={formData.user?.tipoDocumento}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <label
          htmlFor="numeroDocumento"
          className="flex items-center gap-1 mb-4"
        >
          Número de documento <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="numeroDocumento"
          name="numeroDocumento"
          type="number"
          value={formData.user?.numeroDocumento}
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
          type="number"
          value={formData.user?.telefono}
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
          type="number"
          value={formData.universidadId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, universidadId: +e.target.value }))
          }
          required
        />
      </fieldset>

      <button type="submit" className="w-full mt-4">
        Guardar
      </button>
    </form>
  );
}
