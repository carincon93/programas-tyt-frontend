import type { Programa } from "@/lib/types";
import {
  fetchProgramasData,
  deletePrograma,
  createOrUpdatePrograma,
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
import {
  Ban,
  Check,
  Edit2,
  EllipsisVertical,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface TableProps {
  programas: Programa[];
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setProgramaSelected: (programa: Programa) => void;
}

const TableProgramas = ({
  programas,
  setOpen,
  setOpenDelete,
  setProgramaSelected,
}: TableProps) => {
  return (
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
                        {programa.activo ? (
                          <>
                            <Ban size="14px" />
                            Inactivar
                          </>
                        ) : (
                          <>
                            <Check size="14px" />
                            Activar
                          </>
                        )}
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
  );
};

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

  const deactivatePrograma = async () => {
    if (!programaSelected) return;

    const response = await createOrUpdatePrograma(programaSelected, {
      activo: programaSelected.activo ? false : true,
    });

    if (response.ok) {
      refreshProgramas();
      toast(
        `Programa ${
          programaSelected.activo ? "inactivado" : "activado"
        } correctamente`
      );
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
            ¿Está seguro/a que desea{" "}
            {programaSelected?.activo ? "inactivar" : "activar"}
            el programa <strong>{programaSelected?.nombre}</strong>?
          </p>
          <Button onClick={() => deactivatePrograma()} variant="destructive">
            {programaSelected?.activo ? "Inactivar" : "Activar"}
          </Button>
        </CustomDialog>
      </div>

      <h1 className="font-semibold mt-10">Programas activos</h1>

      <TableProgramas
        programas={programas.filter((programa) => programa.activo)}
        setProgramaSelected={setProgramaSelected}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
      />

      <hr className="my-10" />

      <h1 className="font-semibold mt-10">Programas inactivos</h1>

      <TableProgramas
        programas={programas.filter((programa) => !programa.activo)}
        setProgramaSelected={setProgramaSelected}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
      />
    </div>
  );
}
