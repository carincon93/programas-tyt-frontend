import type { Grupo } from "@/lib/types";
import {
  fetchGruposData,
  deleteGrupo,
  createOrUpdateGrupo,
} from "@/services/grupo.service";
import { useEffect, useState } from "react";
import GrupoForm from "./_form";

import { Button } from "@/components/ui/button";
import CustomDialog from "@/components/CustomDialog";

import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { GrupoDataTable } from "./_data-table";

interface TableProps {
  grupos: Grupo[];
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setGrupoSelected: (grupo: Grupo) => void;
}

const TableGrupos = ({
  grupos,
  setOpen,
  setOpenDelete,
  setGrupoSelected,
}: TableProps) => {
  return (
    <GrupoDataTable grupos={grupos} setOpen={setOpen} setOpenDelete={setOpenDelete} setGrupoSelected={setGrupoSelected} />
  );
};

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

  const deactivateGrupo = async () => {
    if (!grupoSelected) return;

    const response = await createOrUpdateGrupo(grupoSelected, {
      activo: grupoSelected.activo ? false : true,
    });

    if (response.ok) {
      refreshGrupos();
      toast(
        `Grupo ${
          grupoSelected.activo ? "inactivado" : "activado"
        } correctamente`
      );
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
            ¿Está seguro/a que desea{" "}
            {grupoSelected?.activo ? "inactivar" : "activar"} el grupo{" "}
            <strong>{grupoSelected?.codigoGrupo}</strong>?
          </p>
          <Button onClick={() => deactivateGrupo()} variant="destructive">
            {grupoSelected?.activo ? "Inactivar" : "Activar"}
          </Button>
        </CustomDialog>
      </div>

      <h1 className="font-semibold mt-10">Grupos activos</h1>
      <TableGrupos
        grupos={grupos.filter((grupo) => grupo.activo)}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
        setGrupoSelected={setGrupoSelected}
      />

      <hr className="my-10" />

      <h1 className="font-semibold">Grupos inactivos</h1>

      <TableGrupos
        grupos={grupos.filter((grupo) => !grupo.activo)}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
        setGrupoSelected={setGrupoSelected}
      />
    </div>
  );
}
