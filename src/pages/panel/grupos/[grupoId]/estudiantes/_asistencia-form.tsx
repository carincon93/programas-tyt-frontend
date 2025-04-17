import type { Asignatura, Asistencia } from "@/lib/types";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateAsistencia } from "@/services/asistencia.service";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchAsignaturasData } from "@/services/asignatura.service";

interface EstudianteAsistenciaFormProps {
  estudianteId: number;
  setOpenAsistencia: (open: boolean) => void;
  onAsistenciaCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function EstudianteAsistenciaForm({
  estudianteId,
  setOpenAsistencia,
  onAsistenciaCreatedOrUpdated,
}: EstudianteAsistenciaFormProps) {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);

  const [formData, setFormData] = useState<Partial<Asistencia>>({
    asignaturaProfesorId: undefined,
    estudianteId: undefined,
    asiste: false,
    fecha: "",
    periodo: "",
    observacion: "",
  });

  const fetchAsignaturas = async () => {
    const response = await fetchAsignaturasData();
    if (response.data) setAsignaturas(response.data);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await createOrUpdateAsistencia(
      formData.asignaturaProfesorId!,
      estudianteId!,
      undefined,
      formData
    );

    if (result.ok) {
      if (onAsistenciaCreatedOrUpdated) {
        onAsistenciaCreatedOrUpdated(result);
      }
      setOpenAsistencia(false);
      toast(`Asistencia creada correctamente`);
    }
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
        <Label htmlFor="asistencia" className="flex items-center gap-1 mb-4">
          ¿Asistió? <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Select
          name="asiste"
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              asiste: value === "true",
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="true">Si</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
