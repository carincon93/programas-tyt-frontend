import type { AsignaturaGrupo, AsignaturaProfesor } from "@/lib/types";
import { fetchAsignaturasByProfesorData } from "@/services/profesor.service";
import { useEffect, useState } from "react";
import AsignaturaHorarioForm from "./_form";
import { deleteAsignaturaGrupo } from "@/services/asignatura-grupo.service";
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

interface HorarioTableProps {
  asignaturaProfesorId: string | undefined;
  profesorId: string | undefined;
}

export default function HorarioTable({
  asignaturaProfesorId,
  profesorId,
}: HorarioTableProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [asignaturaGrupoSelected, setAsignaturaGrupoelected] =
    useState<AsignaturaGrupo>();

  const [asignaturasProfesor, setAsignaturasProfesor] = useState<
    AsignaturaProfesor[]
  >([]);

  const fetchHorario = async () => {
    if (!profesorId) return;

    const response = await fetchAsignaturasByProfesorData(+profesorId);
    if (response.data) setAsignaturasProfesor(response.data);
  };

  const refreshHorario = async () => {
    fetchHorario();
    setAsignaturaGrupoelected(undefined);
    setOpen(false);
  };

  const removeAsignaturaGrupo = async (asignaturaGrupo: AsignaturaGrupo) => {
    const response = await deleteAsignaturaGrupo(asignaturaGrupo);
    if (response.ok) refreshHorario();
  };

  useEffect(() => {
    fetchHorario();
  }, []);

  console.log(asignaturasProfesor);

  return (
    <div>
      <h1>Horario</h1>
      <div>
        {asignaturaProfesorId && (
          <CustomDialog
            triggerText={
              <>
                <PlusCircle />
                Añadir horario
              </>
            }
            open={open}
            setOpen={setOpen}
          >
            <AsignaturaHorarioForm
              key={asignaturaGrupoSelected?.id}
              asignaturaGrupo={asignaturaGrupoSelected}
              asignaturaProfesorId={+asignaturaProfesorId}
              onAsignaturaHorarioCreatedOrUpdated={refreshHorario}
            />
          </CustomDialog>
        )}
      </div>
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Fecha</TableHead>
            <TableHead className="text-left">Programa / Grupo</TableHead>
            <TableHead className="text-left">Hora inicio / Hora fin</TableHead>
            <TableHead className="text-left">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asignaturasProfesor.map((asignaturaProfesor) => (
            <>
              {asignaturaProfesor.horarios.length > 0 ? (
                asignaturaProfesor.horarios.map((horario) => (
                  <TableRow key={horario.id}>
                    <TableCell>{horario.fecha}</TableCell>
                    <TableCell>
                      {horario.grupo.programa.nombre} {" / "}
                      {horario.grupo.codigoGrupo}
                    </TableCell>
                    <TableCell>
                      {horario.horaInicio}
                      {" - "}
                      {horario.horaFin}
                    </TableCell>

                    <TableCell className="space-x-2">
                      <Button
                        onClick={() => {
                          setOpen(true), setAsignaturaGrupoelected(horario);
                        }}
                      >
                        <Edit2 />
                      </Button>
                      <CustomDialog triggerText={<Trash2 color="red" />}>
                        <p className="my-4">
                          ¿Está seguro/a que desea eliminar el{" "}
                          <strong>horario</strong>?
                        </p>
                        <Button
                          onClick={() => removeAsignaturaGrupo(horario)}
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
                  <TableCell colSpan={4}>No hay datos para mostrar</TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
