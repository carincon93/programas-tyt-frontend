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
import { Edit2, PlusCircle, Trash2 } from "lucide-react";
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
      <h1>Grupos</h1>
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
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Código del grupo</TableHead>
            <TableHead className="text-left">Programa</TableHead>
            <TableHead className="text-left">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grupos.map((grupo) => (
            <TableRow key={grupo.id}>
              <TableCell>{grupo.codigoGrupo}</TableCell>
              <TableCell>{grupo.programa.nombre}</TableCell>
              <TableCell className="space-x-2">
                <a href={`/panel/grupos/${grupo.id}/estudiantes`}>
                  Estudiantes
                </a>
                <Button
                  onClick={() => {
                    setOpen(true), setGrupoSelected(grupo);
                  }}
                >
                  <Edit2 />
                </Button>
                <CustomDialog triggerText={<Trash2 color="red" />}>
                  <p className="my-4">
                    ¿Está seguro/a que desea eliminar el <strong>grupo</strong>?
                  </p>
                  <Button
                    onClick={() => removeGrupo(grupo)}
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
