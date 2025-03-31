import type { Profesor, Universidad } from "@/lib/types";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateProfesor } from "@/services/profesor.service";
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
import { fetchUniversidadesData } from "@/services/universidad.service";
import { toast } from "sonner";

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
  const [universidades, setUniversidades] = useState<Universidad[]>([]);

  const [formData, setFormData] = useState<Partial<Profesor>>({
    user: {
      id: profesor?.user.id || undefined,
      nombres: profesor?.user.nombres || "",
      apellidos: profesor?.user.apellidos || "",
      email: profesor?.user.email || "",
      direccion: profesor?.user.direccion || "",
      tipoDocumento: profesor?.user.tipoDocumento || "",
      numeroDocumento: profesor?.user.numeroDocumento || "",
      telefono: profesor?.user.telefono || "",
      password: profesor?.user?.password || "",
      activo: true,
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

    if (result.ok) {
      if (onProfesorCreatedOrUpdated) {
        onProfesorCreatedOrUpdated(result);
      }
      toast(`Profesor ${profesor?.id ? "editado" : "creado"} correctamente`);
    }
  };

  const fetchUniversidades = async () => {
    const response = await fetchUniversidadesData();
    if (response.data) setUniversidades(response.data);
  };

  useEffect(() => {
    fetchUniversidades();
  }, []);

  console.log(profesor);

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
        <Label htmlFor="universidadId" className="flex items-center gap-1 mb-4">
          Universidad <Asterisk size={12} strokeWidth={1} />
        </Label>

        <Select
          name="universidadId"
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, universidadId: +value }))
          }
          defaultValue={formData.universidadId?.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {universidades.map((Universidad) => (
                <SelectItem
                  key={Universidad.id}
                  value={Universidad.id.toString()}
                >
                  {Universidad.nombre}
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
