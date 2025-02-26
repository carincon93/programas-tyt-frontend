import type { Estudiante } from "@/lib/types";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateEstudiante } from "@/services/estudiante.service";

interface EstudianteFormProps {
  estudiante?: Estudiante;
  onEstudianteCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function EstudianteForm({
  estudiante,
  onEstudianteCreatedOrUpdated,
}: EstudianteFormProps) {
  const [formData, setFormData] = useState<Partial<Estudiante>>({
    user: {
      id: estudiante?.user.id || undefined,
      nombres: estudiante?.user.nombres || "",
      apellidos: estudiante?.user.apellidos || "",
      correo: estudiante?.user.correo || "",
      direccion: estudiante?.user.direccion || "",
      tipoDocumento: estudiante?.user.tipoDocumento || "",
      numeroDocumento: estudiante?.user.numeroDocumento || "",
      telefono: estudiante?.user.telefono || "",
    },
    institucionId: estudiante?.institucionId || undefined,
    codigoEstudiante: estudiante?.codigoEstudiante || "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: value,
      } as Estudiante["user"],
    }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await createOrUpdateEstudiante(estudiante, formData);

    if (onEstudianteCreatedOrUpdated) onEstudianteCreatedOrUpdated(result);
  };

  console.log(estudiante);

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
        <label htmlFor="institucionId" className="flex items-center gap-1 mb-4">
          Institución Id <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="institucionId"
          name="institucionId"
          type="number"
          value={formData.institucionId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, institucionId: +e.target.value }))
          }
          required
        />
      </fieldset>

      <fieldset>
        <label
          htmlFor="codigoEstudiante"
          className="flex items-center gap-1 mb-4"
        >
          Código del estudiante <Asterisk size={12} strokeWidth={1} />
        </label>
        <input
          id="codigoEstudiante"
          name="codigoEstudiante"
          type="text"
          value={formData.codigoEstudiante}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              codigoEstudiante: e.target.value,
            }))
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
