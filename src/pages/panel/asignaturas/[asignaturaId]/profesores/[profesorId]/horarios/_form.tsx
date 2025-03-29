import type {
  Asignatura,
  AsignaturaProfesor,
  AsignaturaGrupo,
  Grupo,
} from "@/lib/types";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateAsignaturaGrupo } from "@/services/asignatura-grupo.service";
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
import { fetchGruposData } from "@/services/grupo.service";
import { toast } from "sonner";

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
  const [grupos, setGrupos] = useState<Grupo[]>([]);
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

    if (result.ok) {
      if (onAsignaturaHorarioCreatedOrUpdated) {
        onAsignaturaHorarioCreatedOrUpdated(result);
      }
      toast(
        `Asignatura ${
          asignaturaGrupo?.id ? "editada" : "agendada"
        } correctamente`
      );
    }
  };

  const fetchGrupos = async () => {
    const response = await fetchGruposData();
    if (response.data) setGrupos(response.data);
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <Label htmlFor="fecha" className="flex items-center gap-1 mb-4">
          Fecha <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="fecha"
          name="fecha"
          type="date"
          className="block"
          value={formData.fecha}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <Label htmlFor="horaInicio" className="flex items-center gap-1 mb-4">
          Hora inicio <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="horaInicio"
          name="horaInicio"
          type="time"
          className="block"
          value={formData.horaInicio}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <Label htmlFor="horaFin" className="flex items-center gap-1 mb-4">
          Hora inicio <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="horaFin"
          name="horaFin"
          type="time"
          className="block"
          value={formData.horaFin}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <Label htmlFor="grupoId" className="flex items-center gap-1 mb-4">
          Grupo <Asterisk size={12} strokeWidth={1} />
        </Label>

        <Select
          name="grupoId"
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, grupoId: +value }))
          }
          defaultValue={formData.grupoId?.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {grupos.map((grupo) => (
                <SelectItem key={grupo.id} value={grupo.id.toString()}>
                  {grupo.codigoGrupo}
                  {" | "}
                  {grupo.programa.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </fieldset>

      <Button type="submit" className="w-full mt-4">
        Guardar
      </Button>
    </form>
  );
}
