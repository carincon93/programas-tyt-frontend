import type { Estudiante } from "@/lib/types";
import {
  fetchEstudiantesData,
  deleteEstudiante,
  createOrUpdateEstudiante,
} from "@/services/estudiante.service";
import { useEffect, useState } from "react";
import EstudianteForm from "./_form";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit2,
  EllipsisVertical,
  FileDigit,
  ListTodo,
  PlusCircle,
  UserCheck,
  UserRoundX,
} from "lucide-react";
import { toast } from "sonner";

interface TableProps {
  estudiantes: Estudiante[];
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setEstudianteSelected: (estudiante: Estudiante) => void;
}

const TableEstudiantes = ({
  estudiantes,
  setOpen,
  setOpenDelete,
  setEstudianteSelected,
}: TableProps) => {
  return (
    <Table className="table-fixed w-full text-xs mt-4 border">
      <TableHeader>
        <TableRow>
          <TableHead className="text-left w-[115px] font-bold text-black">
            Código
          </TableHead>
          <TableHead className="text-left border font-bold text-black">
            Nombre
          </TableHead>
          <TableHead className="text-left border font-bold text-black">
            Institución
          </TableHead>
          <TableHead className="text-left border font-bold text-black">
            Programa / Grupo
          </TableHead>
          <TableHead className="text-center w-[180px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {estudiantes.length > 0 ? (
          estudiantes.map((estudiante) => (
            <TableRow key={estudiante.id}>
              <TableCell className="border">
                {estudiante.codigoEstudiante}
              </TableCell>
              <TableCell className="border">
                {estudiante.user.nombres + " " + estudiante.user.apellidos}
              </TableCell>
              <TableCell className="border">
                {estudiante.institucion.nombre}
              </TableCell>
              <TableCell className="border">
                {estudiante?.grupo?.programa?.nombre}
                {" / "}
                {estudiante.grupo.codigoGrupo}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 block w-full shadow-sm hover:cursor-pointer hover:bg-slate-100">
                    <EllipsisVertical size="14px" className="mx-auto" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white p-4 shadow space-y-2">
                    <DropdownMenuItem>
                      <a
                        href={`/panel/estudiantes/${estudiante.id}/notas`}
                        className="inline-flex justify-center items-center gap-1 hover:opacity-60"
                      >
                        <FileDigit size={10} />
                        Notas
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a
                        href={`/panel/estudiantes/${estudiante.id}/asistencias`}
                        className="inline-flex justify-center items-center gap-1 hover:opacity-60"
                      >
                        <ListTodo size={10} />
                        Asistencias
                      </a>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <button
                        onClick={() => {
                          setOpen(true), setEstudianteSelected(estudiante);
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
                            setEstudianteSelected(estudiante);
                        }}
                        className="flex items-center gap-2 p-2"
                      >
                        {estudiante.user.activo ? (
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
            <TableCell colSpan={5}>No hay datos para mostrar</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default function EstudiantesTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [estudianteSelected, setEstudianteSelected] = useState<Estudiante>();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);

  const fetchEstudiantes = async () => {
    const response = await fetchEstudiantesData();
    if (response.data) setEstudiantes(response.data);
  };

  const refreshEstudiantes = async () => {
    fetchEstudiantes();
    setEstudianteSelected(undefined);
    setOpen(false);
    setOpenDelete(false);
  };

  const deactivateEstudiante = async () => {
    if (!estudianteSelected) return;

    const response = await createOrUpdateEstudiante(estudianteSelected, {
      ...estudianteSelected,
      user: { activo: estudianteSelected.user.activo ? false : true },
    });

    if (response.ok) {
      refreshEstudiantes();
      toast(
        `Estudiante ${
          estudianteSelected.user.activo ? "inactivado" : "activado"
        } correctamente`
      );
    }
  };

  useEffect(() => {
    if (!open) {
      setEstudianteSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  console.log(estudiantes);

  return (
    <div>
      <div>
        <CustomDialog
          triggerText={
            <Button>
              <PlusCircle />
              Añadir estudiante
            </Button>
          }
          dialogContentClassName="h-full overflow-y-auto"
          open={open}
          setOpen={setOpen}
        >
          <EstudianteForm
            key={estudianteSelected?.id}
            estudiante={estudianteSelected}
            onEstudianteCreatedOrUpdated={refreshEstudiantes}
          />
        </CustomDialog>

        <CustomDialog
          triggerText={<div className="hidden"></div>}
          open={openDelete}
          setOpen={setOpenDelete}
        >
          <p className="my-4">
            ¿Está seguro/a que desea{" "}
            {estudianteSelected?.user.activo ? "inactivar" : "activar"} el/la
            estudiante <strong>{estudianteSelected?.user.nombres}</strong>?
          </p>
          <Button onClick={() => deactivateEstudiante()} variant="destructive">
            {estudianteSelected?.user.activo ? "Inactivar" : "Activar"}
          </Button>
        </CustomDialog>
      </div>

      <h1 className="font-semibold mt-10">Estudiantes activos</h1>

      <TableEstudiantes
        estudiantes={estudiantes.filter((estudiante) => estudiante.user.activo)}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
        setEstudianteSelected={setEstudianteSelected}
      />

      <hr className="my-10" />

      <h1 className="font-semibold">Estudiantes inactivos</h1>

      <TableEstudiantes
        estudiantes={estudiantes.filter(
          (estudiante) => !estudiante.user.activo
        )}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
        setEstudianteSelected={setEstudianteSelected}
      />
    </div>
  );
}
