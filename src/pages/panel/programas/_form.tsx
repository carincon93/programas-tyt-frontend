import type { Programa, Universidad } from "@/lib/types";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Asterisk } from "lucide-react";
import { createOrUpdatePrograma } from "@/services/programa.service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchUniversidadesData } from "@/services/universidad.service";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ProgramaFormProps {
  programa?: Programa;
  onProgramaCreatedOrUpdated?: (result: {
    ok: boolean;
    success?: string;
    error?: string;
  }) => Promise<void>;
}

export default function ProgramaForm({
  programa,
  onProgramaCreatedOrUpdated,
}: ProgramaFormProps) {
  const [universidades, setUniversidades] = useState<Universidad[]>([]);
  const [formData, setFormData] = useState<Partial<Programa>>({
    nombre: programa?.nombre || "",
    codigoPrograma: programa?.codigoPrograma || "",
    universidadId: programa?.universidadId || undefined,
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

    const result = await createOrUpdatePrograma(programa, formData);

    if (result.ok) {
      if (onProgramaCreatedOrUpdated) {
        onProgramaCreatedOrUpdated(result);
      }
      toast(`Programa ${programa?.id ? "editado" : "creado"} correctamente`);
    }
  };

  const fetchUniversidades = async () => {
    const response = await fetchUniversidadesData();
    if (response.data) setUniversidades(response.data);
  };

  useEffect(() => {
    fetchUniversidades();
  }, []);

  console.log(programa);

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <Label htmlFor="nombre" className="flex items-center gap-1 mb-4">
          Nombre <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset>
        <Label
          htmlFor="codigoPrograma"
          className="flex items-center gap-1 mb-4"
        >
          Código del programa <Asterisk size={12} strokeWidth={1} />
        </Label>
        <Input
          id="codigoPrograma"
          name="codigoPrograma"
          type="text"
          value={formData.codigoPrograma}
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

      <Button type="submit" className="w-full mt-4">
        Guardar
      </Button>
    </form>
  );
}
