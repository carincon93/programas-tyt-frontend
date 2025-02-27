import type { Programa } from "@/lib/types";
import {
  fetchProgramasData,
  deletePrograma,
} from "@/services/programa.service";
import { useEffect, useState } from "react";
import ProgramaForm from "./_form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import CustomDialog from "@/components/CustomDialog";
import { toast } from "sonner";

export default function ProgramasTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [programaSelected, setProgramaSelected] = useState<Programa>();
  const [programas, setProgramas] = useState<Programa[]>([]);

  const fetchProgramas = async () => {
    const response = await fetchProgramasData();
    if (response.data) setProgramas(response.data);
  };

  const refreshProgramas = async () => {
    fetchProgramas();
    setProgramaSelected(undefined);
    setOpen(false);
  };

  const removePrograma = async (programa: Programa) => {
    const response = await deletePrograma(programa);
    if (response.ok) {
      refreshProgramas();
      toast("Programa eliminado correctamente");
    }
  };

  useEffect(() => {
    if (!open) {
      setProgramaSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchProgramas();
  }, []);

  console.log(programas);

  return (
    <div>
      <div>
        <CustomDialog
          triggerText={
            <>
              <PlusCircle />
              Añadir programa
            </>
          }
          open={open}
          setOpen={setOpen}
        >
          <ProgramaForm
            key={programaSelected?.id}
            programa={programaSelected}
            onProgramaCreatedOrUpdated={refreshProgramas}
          />
        </CustomDialog>
      </div>
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Nombre</TableHead>
            <TableHead className="text-left">Código del programa</TableHead>
            <TableHead className="text-left">Universidad</TableHead>
            <TableHead className="text-right w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programas.length > 0 ? (
            programas.map((programa) => (
              <TableRow key={programa.id}>
                <TableCell>{programa.nombre}</TableCell>
                <TableCell>{programa.codigoPrograma}</TableCell>
                <TableCell>{programa.universidad.nombre}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    onClick={() => {
                      setOpen(true), setProgramaSelected(programa);
                    }}
                    size="sm"
                  >
                    <Edit2 />
                  </Button>
                  <CustomDialog triggerText={<Trash2 color="red" />}>
                    <p className="my-4">
                      ¿Está seguro/a que desea eliminar el{" "}
                      <strong>programa</strong>?
                    </p>
                    <Button
                      onClick={() => removePrograma(programa)}
                      variant="destructive"
                    >
                      Eliminar
                    </Button>
                  </CustomDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No hay datos para mostrar</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
