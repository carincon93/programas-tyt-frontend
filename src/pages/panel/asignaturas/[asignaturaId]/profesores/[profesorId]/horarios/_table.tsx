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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2, EllipsisVertical, PlusCircle, Trash2 } from "lucide-react";

interface HorarioTableProps {
  asignaturaProfesorId: string | undefined;
  profesorId: string | undefined;
}

export default function HorarioTable({
  asignaturaProfesorId,
  profesorId,
}: HorarioTableProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
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
    setOpenDelete(false);
  };

  const removeAsignaturaGrupo = async () => {
    if (!asignaturaGrupoSelected) return;

    const response = await deleteAsignaturaGrupo(asignaturaGrupoSelected);
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
              <Button>
                <PlusCircle />
                Añadir horario
              </Button>
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

        <CustomDialog
            triggerText={<div className="hidden"></div>}
            open={openDelete}
            setOpen={setOpenDelete}
          >
            <p className="my-4">
              ¿Está seguro/a que desea eliminar el{" "}
              <strong>horario</strong>?
            </p>
            <Button
              onClick={() => removeAsignaturaGrupo()}
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
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 block w-full shadow-sm hover:cursor-pointer hover:bg-slate-100">
                            <EllipsisVertical size="14px" className="mx-auto" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white p-4 shadow space-y-2">
                            <DropdownMenuItem>
                              <button
                                onClick={() => {
                                  setOpen(true), setAsignaturaGrupoelected(horario);
                                }}
                                className="flex items-center gap-2 p-2"
                              >
                                <Edit2 size="14px" />
                                Editar
                              </button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                             
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
