import type { Grupo, Programa } from "@/lib/types";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdateGrupo } from "@/services/grupo.service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchProgramasData } from "@/services/programa.service";

interface GrupoFormProps {
  grupo?: Grupo;
  onGrupoCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function GrupoForm({
  grupo,
  onGrupoCreatedOrUpdated,
}: GrupoFormProps) {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [formData, setFormData] = useState<Partial<Grupo>>({
    codigoGrupo: grupo?.codigoGrupo || "",
    programaId: grupo?.programaId || undefined,
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

    const result = await createOrUpdateGrupo(grupo, formData);

    if (result.ok) {
      if (onGrupoCreatedOrUpdated) {
        onGrupoCreatedOrUpdated(result);
      }
      toast(`Grupo ${grupo?.id ? "editado" : "creado"} correctamente`);
    }
  };

  const fetchProgramas = async () => {
    const response = await fetchProgramasData();
    if (response.data) setProgramas(response.data);
  };

  useEffect(() => {
    fetchProgramas();
  }, []);

  console.log(grupo);

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <Label htmlFor="programaId" className="flex items-center gap-1 mb-4">
          Programa <Asterisk size={12} strokeWidth={1} />
        </Label>

        <Select
          name="programaId"
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, programaId: +value }))
          }
          defaultValue={formData.programaId?.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {programas.map((programa) => (
                <SelectItem key={programa.id} value={programa.id.toString()}>
                  {programa.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </fieldset>

      <fieldset>
        <Label htmlFor="codigoGrupo" className="flex items-center gap-1 mb-4">
          Código del grupo <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="codigoGrupo"
          name="codigoGrupo"
          type="text"
          value={formData.codigoGrupo}
          onChange={handleChange}
          required
        />
      </fieldset>

      <Button type="submit" className="w-full mt-4">
        Guardar
      </Button>
    </form>
  );
}
