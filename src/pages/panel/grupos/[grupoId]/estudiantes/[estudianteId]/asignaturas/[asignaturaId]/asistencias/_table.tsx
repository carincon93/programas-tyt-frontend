import type { Estudiante, Asistencia } from "@/lib/types";
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
  }, []);

  console.log(asistencias);

  return (
    <div>
      <h1 className="uppercase">{estudiante?.user.nombres}</h1>
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
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Asignatura</TableHead>
            <TableHead className="text-left">¿Asistió?</TableHead>
            <TableHead className="text-left">Fecha</TableHead>
            <TableHead className="text-left">Observación</TableHead>
            <TableHead className="text-left">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asistencias.map((asistencia) => (
            <TableRow key={asistencia.id}>
              <TableCell>
                {asistencia.asignaturaProfesor.asignatura.nombre}
              </TableCell>
              <TableCell>{asistencia.asiste ? "Si" : "No"}</TableCell>
              <TableCell>{asistencia.fecha}</TableCell>
              <TableCell>{asistencia.observacion}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  onClick={() => {
                    setOpen(true), setAsistenciaSelected(asistencia);
                  }}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
