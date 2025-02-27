import type { Asignatura, AsignaturaProfesor, Profesor } from "@/lib/types";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { assignAsignaturaProfesores } from "@/services/asignatura.service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchProfesoresData } from "@/services/profesor.service";
import { toast } from "sonner";

interface AsignaturaProfesoresFormProps {
  asignatura?: Asignatura;
  onAsignaturaProfesoresCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function AsignaturaProfesoresForm({
  asignatura,
  onAsignaturaProfesoresCreatedOrUpdated,
}: AsignaturaProfesoresFormProps) {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    if (!asignatura) return;
    e.preventDefault();

    const result = await assignAsignaturaProfesores(asignatura, selectedIds);
    if (onAsignaturaProfesoresCreatedOrUpdated) {
      onAsignaturaProfesoresCreatedOrUpdated(result);
    }
    if (result.ok) {
      toast(`Asignación creada correctamente`);
    }
  };

  const fetchProfesores = async () => {
    const response = await fetchProfesoresData();
    if (response.data) setProfesores(response.data);
  };

  useEffect(() => {
    fetchProfesores();
    setSelectedIds(
      asignatura?.asignaturaProfesores.map((ap) => ap.profesor.id) || []
    );
  }, []);

  console.log(asignatura);

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        {profesores.map((profesor) => (
          <div key={profesor.id} className="flex items-center gap-2">
            <Checkbox
              id={`profesor-${profesor.id}`}
              checked={selectedIds.includes(profesor.id)}
              onCheckedChange={(checked) => {
                setSelectedIds((prev) =>
                  checked
                    ? [...prev, profesor.id]
                    : prev.filter((id) => id !== profesor.id)
                );
              }}
            />
            <Label htmlFor={`profesor-${profesor.id}`} className="text-sm">
              {profesor.user.nombres}
            </Label>
          </div>
        ))}
      </fieldset>

      <Button type="submit" className="w-full mt-4">
        Guardar
      </Button>
    </form>
  );
}
