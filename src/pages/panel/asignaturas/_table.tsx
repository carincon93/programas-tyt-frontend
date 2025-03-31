import type { Asignatura } from "@/lib/types";
import {
  fetchAsignaturasData,
  deleteAsignatura,
} from "@/services/asignatura.service";
import { useEffect, useState } from "react";
import AsignaturaForm from "./_form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Edit2,
  EllipsisVertical,
  ExternalLink,
  PlusCircle,
  Trash2,
} from "lucide-react";
import CustomDialog from "@/components/CustomDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AsignaturaProfesoresForm from "./_form-profesores";
import { toast } from "sonner";

export default function AsignaturasTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [asignaturaSelected, setAsignaturaSelected] = useState<Asignatura>();
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);

  const fetchAsignaturas = async () => {
    const response = await fetchAsignaturasData();
    if (response.data) setAsignaturas(response.data);
  };

  const refreshAsignaturas = async () => {
    fetchAsignaturas();
    setAsignaturaSelected(undefined);
    setOpen(false);
    setOpenDelete(false);
  };

  const removeAsignatura = async () => {
    if (!asignaturaSelected) return;

    const response = await deleteAsignatura(asignaturaSelected);
    if (response.ok) {
      refreshAsignaturas();
      toast("Asignatura eliminada correctamente");
    }
  };

  useEffect(() => {
    if (!open) {
      setAsignaturaSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchAsignaturas();
  }, []);

  console.log(asignaturas);

  return (
    <div>
      <div>
        <CustomDialog
          triggerText={
            <Button>
              <PlusCircle />
              Añadir asignatura
            </Button>
          }
          open={open}
          setOpen={setOpen}
        >
          <AsignaturaForm
            key={asignaturaSelected?.id}
            asignatura={asignaturaSelected}
            onAsignaturaCreatedOrUpdated={refreshAsignaturas}
          />
        </CustomDialog>

        <CustomDialog
          triggerText={<div className="hidden"></div>}
          open={openDelete}
          setOpen={setOpenDelete}
        >
          <p className="my-4">
            ¿Está seguro/a que desea eliminar la asignatura{" "}
            <strong>{asignaturaSelected?.nombre}</strong>?
          </p>
          <Button onClick={() => removeAsignatura()} variant="destructive">
            Eliminar
          </Button>
        </CustomDialog>
      </div>
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left w-[110px]">Código</TableHead>
            <TableHead className="text-left border font-bold text-black">
              Nombre
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Profesores
            </TableHead>
            <TableHead className="text-center font-bold w-[100px] text-black">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asignaturas.length > 0 ? (
            asignaturas.map((asignatura) => (
              <TableRow key={asignatura.id}>
                <TableCell className="border">
                  {asignatura.codigoAsignatura}
                </TableCell>
                <TableCell className="border">{asignatura.nombre}</TableCell>
                <TableCell className="border">
                  {asignatura.asignaturaProfesores.map((asignaturaProfesor) => (
                    <div key={asignaturaProfesor.id}>
                      {asignaturaProfesor.profesor.user?.nombres}{" "}
                      {asignaturaProfesor.profesor.user?.apellidos}
                      {" - "}
                      <a
                        href={`/panel/asignaturas/${asignaturaProfesor.id}/profesores/${asignaturaProfesor.profesor.id}/horarios`}
                        className="inline-flex justify-center items-center gap-1 underline hover:opacity-60"
                      >
                        <ExternalLink size={10} className="top-0.5 relative" />
                        Revisar horario
                      </a>
                    </div>
                  ))}
                  <div className="mt-4">
                    <CustomDialog
                      triggerText={
                        <small className="inline-flex items-center gap-2">
                          <PlusCircle size={10} /> Asociar
                        </small>
                      }
                      title="Asignar profesores"
                    >
                      <AsignaturaProfesoresForm
                        asignatura={asignatura}
                        onAsignaturaProfesoresCreatedOrUpdated={
                          refreshAsignaturas
                        }
                      />
                    </CustomDialog>
                  </div>
                </TableCell>
                <TableCell className="border">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 block w-full shadow-sm hover:cursor-pointer hover:bg-slate-100">
                      <EllipsisVertical size="14px" className="mx-auto" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white p-4 shadow space-y-2">
                      <DropdownMenuItem>
                        <button
                          onClick={() => {
                            setOpen(true), setAsignaturaSelected(asignatura);
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
                              setAsignaturaSelected(asignatura);
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
              <TableCell colSpan={4}>No hay datos para mostrar</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
