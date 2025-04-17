import type { AsignaturaProfesor, Estudiante, Nota } from "@/lib/types";
import {
  deleteNota,
  fetchNotasByEstudianteData,
} from "@/services/nota.service";
import { fetchEstudianteByIdData } from "@/services/estudiante.service";
import { useEffect, useState } from "react";
import NotaForm from "./_form";
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
import { toast } from "sonner";
import { Edit2, EllipsisVertical, PlusCircle, Trash2 } from "lucide-react";
import { fetchAsignaturaByProfesorIdData } from "@/services/profesor.service";

interface EstudianteNotasTableProps {
  asignaturaProfesorId: string | undefined;
  estudianteId: string | undefined;
}

export default function EstudianteNotasTable({
  asignaturaProfesorId,
  estudianteId,
}: EstudianteNotasTableProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [notaSelected, setNotaSelected] = useState<Nota>();
  const [notas, setNotas] = useState<Nota[]>([]);
  const [estudiante, setEstudiante] = useState<Estudiante>();
  const [asignaturaProfesor, setAsignaturaProfesor] =
    useState<AsignaturaProfesor>();

  const fetchNotasByEstudiante = async () => {
    if (!estudianteId) return;

    const response = await fetchNotasByEstudianteData(+estudianteId);
    if (response.data) setNotas(response.data);
  };

  const fetchEstudianteById = async () => {
    if (!estudianteId) return;

    const response = await fetchEstudianteByIdData(+estudianteId);
    if (response.data) setEstudiante(response.data);
  };

  const fetchAsignaturaByProfesor = async () => {
    if (!asignaturaProfesorId) return;

    const response = await fetchAsignaturaByProfesorIdData(
      +asignaturaProfesorId
    );
    if (response.data) setAsignaturaProfesor(response.data);
  };

  const refreshNotas = async () => {
    fetchNotasByEstudiante();
    setNotaSelected(undefined);
    setOpen(false);
    setOpenDelete(false);
  };

  const removeNota = async () => {
    if (!notaSelected) return;

    const response = await deleteNota(notaSelected);
    if (response.ok) {
      refreshNotas();
      toast("Nota eliminada correctamente");
    }
  };

  useEffect(() => {
    if (!open) {
      setNotaSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchNotasByEstudiante();
    fetchEstudianteById();
    fetchAsignaturaByProfesor();
  }, []);

  console.log(notas);

  return (
    <div>
      <div>
        <span className="bg-blue-400 py-1 px-4 rounded-md text-white">
          <strong>Asignatura:</strong>
          {asignaturaProfesor ? (
            <span className="ml-2">
              {asignaturaProfesor?.asignatura.nombre}
            </span>
          ) : (
            <>Cargando..</>
          )}
        </span>
        <span className="bg-green-500 py-1 px-4 rounded-md text-white mx-2 ">
          <strong>Profesor:</strong>
          {asignaturaProfesor ? (
            <span className="ml-2">
              {asignaturaProfesor?.profesor.user.nombres +
                " " +
                asignaturaProfesor?.profesor.user.apellidos}
            </span>
          ) : (
            <>Cargando..</>
          )}
        </span>
        <span className="bg-amber-500 py-1 px-4 rounded-md text-white">
          <strong>Estudiante:</strong>
          {estudiante ? (
            <span className="ml-2">
              {estudiante?.user.nombres + " " + estudiante?.user.apellidos}
            </span>
          ) : (
            <>Cargando..</>
          )}
        </span>
      </div>
      <hr className="my-6" />
      <div>
        {estudianteId && asignaturaProfesorId && (
          <CustomDialog
            triggerText={
              <Button>
                <PlusCircle />
                Añadir nota
              </Button>
            }
            open={open}
            setOpen={setOpen}
          >
            <NotaForm
              key={notaSelected?.id}
              nota={notaSelected}
              estudianteId={+estudianteId}
              asignaturaProfesorId={+asignaturaProfesorId}
              onNotaCreatedOrUpdated={refreshNotas}
            />
          </CustomDialog>
        )}

        <CustomDialog
          triggerText={<div className="hidden"></div>}
          open={openDelete}
          setOpen={setOpenDelete}
        >
          <p className="my-4">
            ¿Está seguro/a que desea eliminar la <strong>nota</strong>
            ?
          </p>
          <Button
            onClick={() => removeNota()}
            variant="destructive"
          >
            Eliminar
          </Button>
        </CustomDialog>
      </div>
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left border font-bold text-black">
              Asignatura
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Nota
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Fecha
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Observación
            </TableHead>
            <TableHead className="text-center font-bold w-[100px] text-black">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notas.length > 0 ? (
            notas.map((nota) => (
              <TableRow key={nota.id}>
                <TableCell className="border">
                  {nota.asignaturaProfesor?.asignatura.nombre}
                </TableCell>
                <TableCell className="border">{nota.nota}</TableCell>
                <TableCell className="border">{nota.fecha}</TableCell>
                <TableCell className="border">{nota.observacion}</TableCell>
                <TableCell className="space-x-2">
                  <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 block w-full shadow-sm hover:cursor-pointer hover:bg-slate-100">
                        <EllipsisVertical size="14px" className="mx-auto" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white p-4 shadow space-y-2">
                        <DropdownMenuItem>
                          <button
                            onClick={() => {
                              setOpen(true), setNotaSelected(nota);
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
                                setNotaSelected(nota);
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
              <TableCell colSpan={5}>No hay datos para mostrar</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
