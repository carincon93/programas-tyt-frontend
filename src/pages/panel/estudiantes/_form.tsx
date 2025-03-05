import type { Estudiante, Grupo, Institucion } from "@/lib/types";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateEstudiante } from "@/services/estudiante.service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchInstitucionesData } from "@/services/institucion.service";
import { fetchGruposData } from "@/services/grupo.service";
import { toast } from "sonner";

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
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [formData, setFormData] = useState<Partial<Estudiante>>({
    user: {
      id: estudiante?.user?.id,
      nombres: estudiante?.user?.nombres || "",
      apellidos: estudiante?.user?.apellidos || "",
      email: estudiante?.user?.email || "",
      direccion: estudiante?.user?.direccion || "",
      tipoDocumento: estudiante?.user?.tipoDocumento || "",
      numeroDocumento: estudiante?.user?.numeroDocumento || "",
      telefono: estudiante?.user?.telefono || "",
      password: estudiante?.user?.password || "",
    },
    grupoId: estudiante?.grupoId,
    institucionId: estudiante?.institucionId,
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

  const fetchInstituciones = async () => {
    const response = await fetchInstitucionesData();
    if (response.data) setInstituciones(response.data);
  };

  const fetchGrupos = async () => {
    const response = await fetchGruposData();
    if (response.data) setGrupos(response.data);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await createOrUpdateEstudiante(estudiante, formData);

    if (result.ok) {
      if (onEstudianteCreatedOrUpdated) {
        onEstudianteCreatedOrUpdated(result);
      }
      toast(
        `Estudiante ${estudiante?.id ? "editado" : "creado"} correctamente`
      );
    }
  };

  useEffect(() => {
    fetchInstituciones();
    fetchGrupos();
  }, []);

  console.log(estudiante);

  return (
    <form onSubmit={submit} className="space-y-8 space-x-4 grid grid-cols-2">
      <fieldset>
        <Label htmlFor="nombres" className="flex items-center gap-1 mb-4">
          Nombres <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="nombres"
          name="nombres"
          type="text"
          value={formData.user?.nombres}
          onChange={handleChange}
          required
        />
      </fieldset>
      <fieldset>
        <Label htmlFor="apellidos" className="flex items-center gap-1 mb-4">
          Apellidos <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="apellidos"
          name="apellidos"
          type="text"
          value={formData.user?.apellidos}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <Label htmlFor="email" className="flex items-center gap-1 mb-4">
          Correo electrónico <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.user?.email}
          onChange={handleChange}
          required
        />
      </fieldset>

      {!estudiante && (
        <fieldset>
          <Label htmlFor="password" className="flex items-center gap-1 mb-4">
            Contraseña <Asterisk size={12} strokeWidth={1} />
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.user?.password}
            onChange={handleChange}
            required
          />
        </fieldset>
      )}

      <fieldset>
        <Label htmlFor="direccion" className="flex items-center gap-1 mb-4">
          Direccion <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="direccion"
          name="direccion"
          type="address"
          value={formData.user?.direccion}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <Label htmlFor="tipoDocumento" className="flex items-center gap-1 mb-4">
          Tipo de documento <Asterisk size={12} strokeWidth={1} />
        </Label>

        <Select
          name="tipoDocumento"
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              user: {
                ...prev.user,
                tipoDocumento: value,
              },
            }))
          }
          defaultValue={formData.user?.tipoDocumento}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="cc">Cédula de ciudadanía</SelectItem>
              <SelectItem value="ce">Cédula de extranjería</SelectItem>
              <SelectItem value="ti">Tarjeta de identidad</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </fieldset>

      <fieldset>
        <Label
          htmlFor="numeroDocumento"
          className="flex items-center gap-1 mb-4"
        >
          Número de documento <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="numeroDocumento"
          name="numeroDocumento"
          type="number"
          value={formData.user?.numeroDocumento}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <Label htmlFor="telefono" className="flex items-center gap-1 mb-4">
          Teléfono <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="telefono"
          name="telefono"
          type="number"
          value={formData.user?.telefono}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <Label htmlFor="institucionId" className="flex items-center gap-1 mb-4">
          Institución <Asterisk size={12} strokeWidth={1} />
        </Label>

        {instituciones.length > 0 ? (
          <Select
            name="institucionId"
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, institucionId: +value }))
            }
            defaultValue={formData.institucionId?.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
          {instituciones.map((institucion) => (
            <SelectItem
              key={institucion.id}
              value={institucion.id.toString()}
            >
              {institucion.nombre}
            </SelectItem>
          ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <div>No hay datos para mostrar</div>
        )}
      </fieldset>

      <fieldset>
        <Label
          htmlFor="codigoEstudiante"
          className="flex items-center gap-1 mb-4"
        >
          Código del estudiante <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
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

      <fieldset className="col-span-2">
        <Label htmlFor="grupoId" className="flex items-center gap-1 mb-4">
          Grupo / Programa <Asterisk size={12} strokeWidth={1} />
        </Label>

        <Select
          name="grupoId"
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, grupoId: +value }))
          }
          defaultValue={formData?.grupoId?.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {grupos.map((grupo) => (
                <SelectItem key={grupo.id} value={grupo.id.toString()}>
                  {grupo.codigoGrupo.slice(0, 20)}
                  {" / "}
                  {grupo.programa.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </fieldset>

      <div className="col-span-2">
        <Button type="submit" className="w-full mt-4">
          Guardar
        </Button>
      </div>
    </form>
  );
}
