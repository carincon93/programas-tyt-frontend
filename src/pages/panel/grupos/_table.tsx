import type { Grupo } from "@/lib/types";
import { fetchGruposData, deleteGrupo } from "@/services/grupo.service";
import { useEffect, useState } from "react";
import GrupoForm from "./_form";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit2,
  EllipsisVertical,
  ExternalLink,
  PlusCircle,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export default function GruposTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [grupoSelected, setGrupoSelected] = useState<Grupo>();
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  const fetchGrupos = async () => {
    const response = await fetchGruposData();
    if (response.data) setGrupos(response.data);
  };

  const refreshGrupos = async () => {
    fetchGrupos();
    setGrupoSelected(undefined);
    setOpen(false);
    setOpenDelete(false);
  };

  const removeGrupo = async () => {
    if (!grupoSelected) return;

    const response = await deleteGrupo(grupoSelected);
    if (response.ok) {
      refreshGrupos();
      toast("Grupo eliminado correctamente");
    }
  };

  useEffect(() => {
    if (!open) {
      setGrupoSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchGrupos();
  }, []);

  console.log(grupos);

  return (
    <div>
      <div>
        <CustomDialog
          triggerText={
            <Button>
              <PlusCircle />
              Añadir grupo
            </Button>
          }
          open={open}
          setOpen={setOpen}
        >
          <GrupoForm
            key={grupoSelected?.id}
            grupo={grupoSelected}
            onGrupoCreatedOrUpdated={refreshGrupos}
          />
        </CustomDialog>

        <CustomDialog
          triggerText={<div className="hidden"></div>}
          open={openDelete}
          setOpen={setOpenDelete}
        >
          <p className="my-4">
            ¿Está seguro/a que desea eliminar el grupo{" "}
            <strong>{grupoSelected?.codigoGrupo}</strong>?
          </p>
          <Button onClick={() => removeGrupo()} variant="destructive">
            Eliminar
          </Button>
        </CustomDialog>
      </div>
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left border font-bold text-black">
              Código del grupo
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Programa
            </TableHead>
            <TableHead className="text-center font-bold w-[100px] text-black">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grupos.length > 0 ? (
            grupos.map((grupo) => (
              <TableRow key={grupo.id}>
                <TableCell className="border">{grupo.codigoGrupo}</TableCell>
                <TableCell className="border">
                  {grupo.programa.nombre}
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 block w-full shadow-sm hover:cursor-pointer hover:bg-slate-100">
                      <EllipsisVertical size="14px" className="mx-auto" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white p-4 shadow space-y-2">
                      <DropdownMenuItem>
                        <a
                          href={`/panel/grupos/${grupo.id}/estudiantes`}
                          className="inline-flex justify-center items-center gap-1 hover:opacity-60"
                        >
                          <Users size="14px" />
                          Estudiantes
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <button
                          onClick={() => {
                            setOpen(true), setGrupoSelected(grupo);
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
                            setOpenDelete(true), setGrupoSelected(grupo);
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
              <TableCell colSpan={3}>No hay datos para mostrar</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
