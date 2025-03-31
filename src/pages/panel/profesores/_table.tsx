import type { Profesor } from "@/lib/types";
import {
  fetchProfesoresData,
  deleteProfesor,
  createOrUpdateProfesor,
} from "@/services/profesor.service";
import { useEffect, useState } from "react";
import ProfesorForm from "./_form";
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
  Edit2,
  EllipsisVertical,
  PlusCircle,
  Trash2,
  UserCheck,
  UserRoundX,
} from "lucide-react";
import { toast } from "sonner";

interface TableProfesoresProps {
  profesores: Profesor[];
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setProfesorSelected: (profesor: Profesor) => void;
}

const TableProfesores = ({
  profesores,
  setOpen,
  setOpenDelete,
  setProfesorSelected,
}: TableProfesoresProps) => {
  return (
    <Table className="table-fixed w-full text-xs mt-4 border">
      <TableHeader>
        <TableRow>
          <TableHead className="text-left border font-bold text-black">
            Nombre
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
        {profesores.length > 0 ? (
          profesores.map((profesor) => (
            <TableRow key={profesor.id}>
              <TableCell className="border">
                {profesor.user.nombres + " " + profesor.user.apellidos}
              </TableCell>
              <TableCell className="border">
                {profesor.universidad.nombre}
              </TableCell>
              <TableCell className="space-x-2 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 block w-full shadow-sm hover:cursor-pointer hover:bg-slate-100">
                    <EllipsisVertical size="14px" className="mx-auto" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white p-4 shadow space-y-2">
                    <DropdownMenuItem>
                      <button
                        onClick={() => {
                          setOpen(true), setProfesorSelected(profesor);
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
                          setOpenDelete(true), setProfesorSelected(profesor);
                        }}
                        className="flex items-center gap-2 p-2"
                      >
                        {profesor.user.activo ? (
                          <>
                            <UserRoundX size="14px" />
                            Inactivar
                          </>
                        ) : (
                          <>
                            <UserCheck size="14px" />
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
            <TableCell colSpan={3}>No hay datos para mostrar</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default function ProfesoresTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [profesorSelected, setProfesorSelected] = useState<Profesor>();
  const [profesores, setProfesores] = useState<Profesor[]>([]);

  const fetchProfesores = async () => {
    const response = await fetchProfesoresData();
    if (response.data) setProfesores(response.data);
  };

  const refreshProfesores = async () => {
    fetchProfesores();
    setProfesorSelected(undefined);
    setOpen(false);
    setOpenDelete(false);
  };

  const deactivateProfesor = async () => {
    if (!profesorSelected) return;

    const response = await createOrUpdateProfesor(profesorSelected, {
      ...profesorSelected,
      user: { activo: profesorSelected.user.activo ? false : true },
    });

    if (response.ok) {
      refreshProfesores();
      toast(
        `Profesor ${
          profesorSelected.user.activo ? "inactivado" : "activado"
        } correctamente`
      );
    }
  };

  useEffect(() => {
    if (!open) {
      setProfesorSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchProfesores();
  }, []);

  console.log(profesores);

  return (
    <div>
      <div>
        <CustomDialog
          triggerText={
            <Button>
              <PlusCircle />
              Añadir profesor
            </Button>
          }
          dialogContentClassName="h-full overflow-y-auto"
          open={open}
          setOpen={setOpen}
        >
          <ProfesorForm
            key={profesorSelected?.id}
            profesor={profesorSelected}
            onProfesorCreatedOrUpdated={refreshProfesores}
          />
        </CustomDialog>

        <CustomDialog
          triggerText={<div className="hidden"></div>}
          open={openDelete}
          setOpen={setOpenDelete}
        >
          <p className="my-4">
            ¿Está seguro/a que desea{" "}
            {profesorSelected?.user.activo ? "inactivar" : "activar"} el/la
            profesor <strong>{profesorSelected?.user.nombres}</strong>?
          </p>
          <Button onClick={() => deactivateProfesor()} variant="destructive">
            {profesorSelected?.user.activo ? "Inactivar" : "Activar"}
          </Button>
        </CustomDialog>
      </div>

      <h1 className="font-semibold mt-10">Profesores activos</h1>

      <TableProfesores
        profesores={profesores.filter((profesor) => profesor.user.activo)}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
        setProfesorSelected={setProfesorSelected}
      />

      <hr className="my-10" />

      <h1 className="font-semibold">Profesores inactivos</h1>

      <TableProfesores
        profesores={profesores.filter((profesor) => !profesor.user.activo)}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
        setProfesorSelected={setProfesorSelected}
      />
    </div>
  );
}
