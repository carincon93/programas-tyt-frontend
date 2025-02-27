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
import { Edit2, ExternalLink, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function GruposTable() {
  const [open, setOpen] = useState<boolean>(false);
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
  };

  const removeGrupo = async (grupo: Grupo) => {
    const response = await deleteGrupo(grupo);
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
            <>
              <PlusCircle />
              Añadir grupo
            </>
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
      </div>
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Código del grupo</TableHead>
            <TableHead className="text-left">Programa</TableHead>
            <TableHead className="text-right w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grupos.length > 0 ? (
            grupos.map((grupo) => (
              <TableRow key={grupo.id}>
                <TableCell>{grupo.codigoGrupo}</TableCell>
                <TableCell>{grupo.programa.nombre}</TableCell>
                <TableCell className="space-x-2 text-right">
                  <a
                    href={`/panel/grupos/${grupo.id}/estudiantes`}
                    className="inline-flex justify-center items-center gap-1 underline hover:opacity-60"
                  >
                    <ExternalLink size={10} className="top-0.5 relative" />
                    Estudiantes
                  </a>

                  <div className="space-x-2 mt-4">
                    <Button
                      onClick={() => {
                        setOpen(true), setGrupoSelected(grupo);
                      }}
                      size="sm"
                    >
                      <Edit2 />
                    </Button>
                    <CustomDialog triggerText={<Trash2 color="red" />}>
                      <p className="my-4">
                        ¿Está seguro/a que desea eliminar el{" "}
                        <strong>grupo</strong>?
                      </p>
                      <Button
                        onClick={() => removeGrupo(grupo)}
                        variant="destructive"
                      >
                        Eliminar
                      </Button>
                    </CustomDialog>
                  </div>
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
