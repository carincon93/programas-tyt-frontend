import type { Asignatura, Nota } from "@/lib/types";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateNota } from "@/services/nota.service";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchAsignaturasData } from "@/services/asignatura.service";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EstudianteNotaFormProps {
  estudianteId: number;
  setOpenNota: (open: boolean) => void;
  onNotaCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function EstudianteNotaForm({
  estudianteId,
  setOpenNota,
  onNotaCreatedOrUpdated,
}: EstudianteNotaFormProps) {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [formData, setFormData] = useState<Partial<Nota>>({
    asignaturaProfesorId: 0,
    estudianteId: estudianteId,
    nota: 0,
    periodo: "",
    fecha: "",
    observacion: "",
  });

  const fetchAsignaturas = async () => {
    const response = await fetchAsignaturasData();
    if (response.data) setAsignaturas(response.data);
  };

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

    const result = await createOrUpdateNota(
      formData.asignaturaProfesorId!,
      formData.estudianteId!,
      undefined,
      formData
    );

    if (result.ok)
      if (onNotaCreatedOrUpdated) {
        onNotaCreatedOrUpdated(result);
      }
    setOpenNota(false);
    toast(`Nota creada correctamente`);
  };

  useEffect(() => {
    fetchAsignaturas();
  }, []);

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <Label
          htmlFor="asignaturaProfesorId"
          className="flex items-center gap-1 mb-4"
        >
          Asignatura <Asterisk size={12} strokeWidth={1} />
        </Label>

        {asignaturas.length > 0 ? (
          <Select
            name="asignaturaProfesorId"
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, asignaturaProfesorId: +value }))
            }
            defaultValue={formData.asignaturaProfesorId?.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {asignaturas.map((asignatura) => (
                  <>
                    {asignatura.asignaturaProfesores?.map(
                      (asignaturaProfesor, index) => (
                        <SelectItem
                          key={index}
                          value={asignaturaProfesor.id.toString()}
                        >
                          {asignatura.nombre} /{" "}
                          {asignaturaProfesor.profesor.user.nombres}
                        </SelectItem>
                      )
                    )}
                  </>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <div>No hay datos para mostrar</div>
        )}
      </fieldset>

      <fieldset>
        <Label htmlFor="periodo" className="flex items-center gap-1 mb-4">
          Periodo <Asterisk size={12} strokeWidth={1} />
        </Label>

        <Select
          name="periodo"
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, periodo: value }))
          }
          defaultValue={formData.asignaturaProfesorId?.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </fieldset>

      <fieldset>
        <Label htmlFor="nota" className="flex items-center gap-1 mb-4">
          Nota <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="nota"
          name="nota"
          type="number"
          min="0"
          max="5"
          step={0.1}
          value={formData.nota}
          onChange={handleChange}
          required
        />
      </fieldset>

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
        <Label htmlFor="observacion" className="flex items-center gap-1 mb-4">
          Observación
        </Label>
        <Textarea
          id="observacion"
          name="observacion"
          value={formData.observacion}
          onChange={handleChange}
        />
      </fieldset>

      <Button type="submit" className="w-full mt-4">
        Guardar
      </Button>
    </form>
  );
}
