import type { Estudiante, Asistencia, AsignaturaProfesor } from "@/lib/types";
import {
  deleteAsistencia,
  fetchAsistenciasByEstudianteData,
} from "@/services/asistencia.service";
import { fetchEstudianteByIdData } from "@/services/estudiante.service";
import { useEffect, useState, type ReactNode } from "react";
import AsistenciaForm from "./_form";
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

interface EstudianteAsistenciasTableProps {
  asignaturaProfesorId: string | undefined;
  estudianteId: string | undefined;
}

export default function EstudianteAsistenciasTable({
  asignaturaProfesorId,
  estudianteId,
}: EstudianteAsistenciasTableProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [asistenciaSelected, setAsistenciaSelected] = useState<Asistencia>();
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [estudiante, setEstudiante] = useState<Estudiante>();
  const [asignaturaProfesor, setAsignaturaProfesor] =
    useState<AsignaturaProfesor>();

  const fetchAsistenciasByEstudiante = async () => {
    if (!estudianteId) return;

    const response = await fetchAsistenciasByEstudianteData(+estudianteId);
    if (response.data) setAsistencias(response.data);
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

  const refreshAsistencias = async () => {
    fetchAsistenciasByEstudiante();
    setAsistenciaSelected(undefined);
    setOpen(false);
  };

  const removeAsistencia = async (asistencia: Asistencia) => {
    const response = await deleteAsistencia(asistencia);
    if (response.ok) {
      refreshAsistencias();
      toast("Asistencia eliminada correctamente");
    }
  };

  useEffect(() => {
    if (!open) {
      setAsistenciaSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchAsistenciasByEstudiante();
    fetchEstudianteById();
    fetchAsignaturaByProfesor();
  }, []);

  console.log(asistencias);

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
                Añadir asistencia
              </>
            }
            open={open}
            setOpen={setOpen}
          >
            <AsistenciaForm
              key={asistenciaSelected?.id}
              asistencia={asistenciaSelected}
              estudianteId={+estudianteId}
              asignaturaProfesorId={+asignaturaProfesorId}
              onAsistenciaCreatedOrUpdated={refreshAsistencias}
            />
          </CustomDialog>
        )}
      </div>
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left border font-bold text-black">
              Asignatura
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              ¿Asistió?
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
          {asistencias.length > 0 ? (
            asistencias.map((asistencia) => (
              <TableRow key={asistencia.id}>
                <TableCell className="border">
                  {asistencia.asignaturaProfesor.asignatura.nombre}
                </TableCell>
                <TableCell className="border">
                  {asistencia.asiste ? "Si" : "No"}
                </TableCell>
                <TableCell className="border">{asistencia.fecha}</TableCell>
                <TableCell className="border">
                  {asistencia.observacion}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    onClick={() => {
                      setOpen(true), setAsistenciaSelected(asistencia);
                    }}
                    size="sm"
                  >
                    <Edit2 />
                  </Button>
                  <CustomDialog triggerText={<Trash2 color="red" />}>
                    <p className="my-4">
                      ¿Está seguro/a que desea eliminar la{" "}
                      <strong>asistencia</strong>?
                    </p>
                    <Button
                      onClick={() => removeAsistencia(asistencia)}
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
