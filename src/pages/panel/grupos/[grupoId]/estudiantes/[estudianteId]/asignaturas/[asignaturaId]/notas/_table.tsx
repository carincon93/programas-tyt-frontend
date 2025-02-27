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
import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import CustomDialog from "@/components/CustomDialog";
import { toast } from "sonner";
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
  };

  const removeNota = async (nota: Nota) => {
    const response = await deleteNota(nota);
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
              <>
                <PlusCircle />
                Añadir nota
              </>
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
      </div>
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Asignatura</TableHead>
            <TableHead className="text-left">Nota</TableHead>
            <TableHead className="text-left">Fecha</TableHead>
            <TableHead className="text-left">Observación</TableHead>
            <TableHead className="text-right w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notas.length > 0 ? (
            notas.map((nota) => (
              <TableRow key={nota.id}>
                <TableCell>
                  {nota.asignaturaProfesor.asignatura.nombre}
                </TableCell>
                <TableCell>{nota.nota}</TableCell>
                <TableCell>{nota.fecha}</TableCell>
                <TableCell>{nota.observacion}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    onClick={() => {
                      setOpen(true), setNotaSelected(nota);
                    }}
                    size="sm"
                  >
                    <Edit2 />
                  </Button>
                  <CustomDialog triggerText={<Trash2 color="red" />}>
                    <p className="my-4">
                      ¿Está seguro/a que desea eliminar la <strong>nota</strong>
                      ?
                    </p>
                    <Button
                      onClick={() => removeNota(nota)}
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
              <TableCell colSpan={5}>No hay datos para mostrar</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
