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
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left border font-bold text-black">
              Fecha
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Programa / Grupo
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Hora inicio / Hora fin
            </TableHead>
            <TableHead className="text-center font-bold w-[100px] text-black">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asignaturasProfesor.length > 0 ? (
            asignaturasProfesor.map((asignaturaProfesor) => (
              <>
                {asignaturaProfesor.horarios.length > 0 ? (
                  asignaturaProfesor.horarios.map((horario) => (
                    <TableRow key={horario.id}>
                      <TableCell className="border">{horario.fecha}</TableCell>
                      <TableCell className="border">
                        {horario.grupo.programa.nombre} {" / "}
                        {horario.grupo.codigoGrupo}
                      </TableCell>
                      <TableCell className="border">
                        {horario.horaInicio}
                        {" - "}
                        {horario.horaFin}
                      </TableCell>

                      <TableCell className="space-x-2">
                        <Button
                          onClick={() => {
                            setOpen(true), setAsignaturaGrupoelected(horario);
                          }}
                          size="sm"
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No hay datos para mostrar</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
