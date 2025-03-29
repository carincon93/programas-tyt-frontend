import type { User, Grupo, Rol } from "@/lib/types";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { fetchUsersData, createOrUpdateUser } from "@/services/user.service";
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
import { toast } from "sonner";
import { fetchRolesData } from "@/services/rol.service";

interface UserFormProps {
  user?: User;
  onUserCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function UserForm({
  user,
  onUserCreatedOrUpdated,
}: UserFormProps) {
  const [roles, setRoles] = useState<Rol[]>([]);

  const [formData, setFormData] = useState<Partial<User>>({
    id: user?.id,
    nombres: user?.nombres || "",
    apellidos: user?.apellidos || "",
    email: user?.email || "",
    password: "",
    direccion: user?.direccion || "",
    tipoDocumento: user?.tipoDocumento || "",
    numeroDocumento: user?.numeroDocumento || "",
    telefono: user?.telefono || "",
    rolId: user?.rolId || undefined,
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

    const result = await createOrUpdateUser(user, formData);

    if (result.ok) {
      if (onUserCreatedOrUpdated) {
        onUserCreatedOrUpdated(result);
      }
      toast(`Usuario ${user?.id ? "editado" : "creado"} correctamente`);
    }
  };

  const fetchRoles = async () => {
    const response = await fetchRolesData();
    if (response.data) setRoles(response.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  console.log(user);

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
          value={formData.nombres}
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
          value={formData.apellidos}
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
          value={formData.email}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <Label htmlFor="password" className="flex items-center gap-1 mb-4">
          Contraseña <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
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
          value={formData.direccion}
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
              tipoDocumento: value,
            }))
          }
          defaultValue={formData.tipoDocumento}
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
          value={formData.numeroDocumento}
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
          value={formData.telefono}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset className="col-span-2">
        <Label htmlFor="rolId" className="flex items-center gap-1 mb-4">
          Rol <Asterisk size={12} strokeWidth={1} />
        </Label>

        <Select
          name="rolId"
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, rolId: +value }))
          }
          defaultValue={formData?.rolId?.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {roles
                .filter(
                  (rol) =>
                    rol.nombre !== "ESTUDIANTE" && rol.nombre !== "PROFESOR"
                )
                .map((rol) => (
                  <SelectItem key={rol.id} value={rol.id.toString()}>
                    {rol.nombre}
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
