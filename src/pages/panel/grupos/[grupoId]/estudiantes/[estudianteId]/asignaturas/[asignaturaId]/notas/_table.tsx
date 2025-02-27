import type { Estudiante, Nota } from "@/lib/types";
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
  }, []);

  console.log(notas);

  return (
    <div>
      <h1 className="uppercase">{estudiante?.user.nombres}</h1>
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
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Asignatura</TableHead>
            <TableHead className="text-left">Nota</TableHead>
            <TableHead className="text-left">Fecha</TableHead>
            <TableHead className="text-left">Observación</TableHead>
            <TableHead className="text-left">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notas.map((nota) => (
            <TableRow key={nota.id}>
              <TableCell>{nota.asignaturaProfesor.asignatura.nombre}</TableCell>
              <TableCell>{nota.nota}</TableCell>
              <TableCell>{nota.fecha}</TableCell>
              <TableCell>{nota.observacion}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  onClick={() => {
                    setOpen(true), setNotaSelected(nota);
                  }}
                >
                  <Edit2 />
                </Button>
                <CustomDialog triggerText={<Trash2 color="red" />}>
                  <p className="my-4">
                    ¿Está seguro/a que desea eliminar la <strong>nota</strong>?
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
