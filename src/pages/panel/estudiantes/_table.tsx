import type { Estudiante } from "@/lib/types";
import {
  fetchEstudiantesData,
  deleteEstudiante,
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
import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function EstudiantesTable() {
  const [open, setOpen] = useState<boolean>(false);
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
  };

  const removeEstudiante = async (estudiante: Estudiante) => {
    const response = await deleteEstudiante(estudiante);
    if (response.ok) {
      refreshEstudiantes();
      toast("Estudiante eliminado correctamente");
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
      <h1>Estudiantes</h1>
      <div>
        <CustomDialog
          triggerText={
            <>
              <PlusCircle />
              Añadir estudiante
            </>
          }
          open={open}
          setOpen={setOpen}
        >
          <EstudianteForm
            key={estudianteSelected?.id}
            estudiante={estudianteSelected}
            onEstudianteCreatedOrUpdated={refreshEstudiantes}
          />
        </CustomDialog>
      </div>

      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Código</TableHead>
            <TableHead className="text-left">Nombre</TableHead>
            <TableHead className="text-left">Institución</TableHead>
            <TableHead className="text-left">Programa / Grupo</TableHead>
            <TableHead className="text-left">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estudiantes.map((estudiante) => (
            <TableRow key={estudiante.id}>
              <TableCell>{estudiante.codigoEstudiante}</TableCell>
              <TableCell>
                {estudiante.user.nombres + " " + estudiante.user.apellidos}
              </TableCell>
              <TableCell>{estudiante.institucion.nombre}</TableCell>
              <TableCell>
                {estudiante?.grupo?.programa?.nombre}
                {" / "}
                {estudiante.grupo.codigoGrupo}
              </TableCell>
              <TableCell className="space-x-2">
                <a href={`/panel/estudiantes/${estudiante.id}/notas`}>Notas</a>
                <a href={`/panel/estudiantes/${estudiante.id}/asistencias`}>
                  Asistencias
                </a>
                <Button
                  onClick={() => {
                    setOpen(true), setEstudianteSelected(estudiante);
                  }}
                >
                  <Edit2 />
                </Button>
                <CustomDialog triggerText={<Trash2 color="red" />}>
                  <p className="my-4">
                    ¿Está seguro/a que desea eliminar el{" "}
                    <strong>estudiante</strong>?
                  </p>
                  <Button
                    onClick={() => removeEstudiante(estudiante)}
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
