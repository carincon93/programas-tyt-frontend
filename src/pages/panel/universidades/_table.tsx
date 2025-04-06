import type { Universidad } from "@/lib/types";
import {
  fetchUniversidadesData,
  deleteUniversidad,
  createOrUpdateUniversidad,
} from "@/services/universidad.service";
import { useEffect, useState } from "react";
import UniversidadForm from "./_form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Ban,
  Check,
  Edit2,
  EllipsisVertical,
  PlusCircle,
  Trash2,
} from "lucide-react";
import CustomDialog from "@/components/CustomDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface TableProps {
  universidades: Universidad[];
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setUniversidadSelected: (universidad: Universidad) => void;
}

const TableUniversidades = ({
  universidades,
  setOpen,
  setOpenDelete,
  setUniversidadSelected,
}: TableProps) => {
  return (
    <Table className="table-fixed w-full text-xs mt-4 border">
      <TableHeader>
        <TableRow>
          <TableHead className="text-left border font-bold text-black">
            Nombre
          </TableHead>
          <TableHead className="text-left border font-bold text-black">
            Dirección
          </TableHead>
          <TableHead className="text-left border font-bold text-black">
            Teléfono
          </TableHead>
          <TableHead className="text-center font-bold w-[100px] text-black">
            Acciones
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {universidades.length > 0 ? (
          universidades.map((universidad) => (
            <TableRow key={universidad.id}>
              <TableCell className="border">{universidad.nombre}</TableCell>
              <TableCell className="border">{universidad.direccion}</TableCell>
              <TableCell className="border">{universidad.telefono}</TableCell>
              <TableCell className="space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 block w-full shadow-sm hover:cursor-pointer hover:bg-slate-100">
                    <EllipsisVertical size="14px" className="mx-auto" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white p-4 shadow space-y-2">
                    <DropdownMenuItem>
                      <button
                        onClick={() => {
                          setOpen(true), setUniversidadSelected(universidad);
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
                          setOpenDelete(true),
                            setUniversidadSelected(universidad);
                        }}
                        className="flex items-center gap-2 p-2"
                      >
                        {universidad.activo ? (
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

export default function UniversidadesTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [universidadSelected, setUniversidadSelected] = useState<Universidad>();
  const [universidades, setUniversidades] = useState<Universidad[]>([]);

  const fetchUniversidades = async () => {
    const response = await fetchUniversidadesData();
    if (response.data) setUniversidades(response.data);
  };

  const refreshUniversidades = async () => {
    fetchUniversidades();
    setUniversidadSelected(undefined);
    setOpen(false);
    setOpenDelete(false);
  };

  const deactivateUniversidad = async () => {
    if (!universidadSelected) return;

    const response = await createOrUpdateUniversidad(universidadSelected, {
      activo: universidadSelected.activo ? false : true,
    });

    if (response.ok) {
      refreshUniversidades();
      toast(
        `Universidad ${
          universidadSelected.activo ? "inactivada" : "activada"
        } correctamente`
      );
    }
  };

  useEffect(() => {
    if (!open) {
      setUniversidadSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchUniversidades();
  }, []);

  console.log(universidades);

  return (
    <div>
      <div>
        <CustomDialog
          triggerText={
            <Button>
              <PlusCircle />
              Añadir universidad
            </Button>
          }
          open={open}
          setOpen={setOpen}
        >
          <UniversidadForm
            key={universidadSelected?.id}
            universidad={universidadSelected}
            onUniversidadCreatedOrUpdated={refreshUniversidades}
          />
        </CustomDialog>

        <CustomDialog
          triggerText={<div className="hidden"></div>}
          open={openDelete}
          setOpen={setOpenDelete}
        >
          <p className="my-4">
            ¿Está seguro/a que desea{" "}
            {universidadSelected?.activo ? "inactivar" : "activar"} la
            universidad <strong>{universidadSelected?.nombre}</strong>?
          </p>
          <Button onClick={() => deactivateUniversidad()} variant="destructive">
            {universidadSelected?.activo ? "Inactivar" : "Activar"}
          </Button>
        </CustomDialog>
      </div>

      <h1 className="font-semibold mt-10">Universidades activas</h1>

      <TableUniversidades
        universidades={universidades.filter(
          (universidad) => universidad.activo
        )}
        setUniversidadSelected={setUniversidadSelected}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
      />

      <hr className="my-10" />

      <h1 className="font-semibold mt-10">Universidades inactivas</h1>

      <TableUniversidades
        universidades={universidades.filter(
          (universidad) => !universidad.activo
        )}
        setUniversidadSelected={setUniversidadSelected}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
      />
    </div>
  );
}
