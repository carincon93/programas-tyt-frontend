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
import CustomDialog from "@/components/CustomDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2, EllipsisVertical, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ProgramasTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
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
    setOpenDelete(false);
  };

  const removePrograma = async () => {
    if (!programaSelected) return;

    const response = await deletePrograma(programaSelected);
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
            <Button>
              <PlusCircle />
              Añadir programa
            </Button>
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

        <CustomDialog
          triggerText={<div className="hidden"></div>}
          open={openDelete}
          setOpen={setOpenDelete}
        >
          <p className="my-4">
            ¿Está seguro/a que desea eliminar el programa{" "}
            <strong>{programaSelected?.nombre}</strong>?
          </p>
          <Button onClick={() => removePrograma()} variant="destructive">
            Eliminar
          </Button>
        </CustomDialog>
      </div>
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left border font-bold text-black">
              Nombre
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Código del programa
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Universidad
            </TableHead>
            <TableHead className="text-center font-bold w-[100px] text-black">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programas.length > 0 ? (
            programas.map((programa) => (
              <TableRow key={programa.id}>
                <TableCell className="border">{programa.nombre}</TableCell>
                <TableCell className="border">
                  {programa.codigoPrograma}
                </TableCell>
                <TableCell className="border">
                  {programa.universidad.nombre}
                </TableCell>
                <TableCell className="space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 block w-full shadow-sm hover:cursor-pointer hover:bg-slate-100">
                      <EllipsisVertical size="14px" className="mx-auto" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white p-4 shadow space-y-2">
                      <DropdownMenuItem>
                        <button
                          onClick={() => {
                            setOpen(true), setProgramaSelected(programa);
                          }}
                          className="flex items-center gap-2 p-2"
                        >
                          <Edit2 size="14px" />
                          Editar
                        </button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <button
                          onClick={() => {
                            setOpenDelete(true), setProgramaSelected(programa);
                          }}
                          className="flex items-center gap-2 p-2"
                        >
                          <Trash2 color="red" size="14px" />
                          Eliminar
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
