import type { Universidad } from "@/lib/types";
import {
  fetchUniversidadesData,
  deleteUniversidad,
  createOrUpdateUniversidad,
} from "@/services/universidad.service";
import { useEffect, useState } from "react";
import UniversidadForm from "./_form";
import { Button } from "@/components/ui/button";
import {
  PlusCircle
} from "lucide-react";
import CustomDialog from "@/components/CustomDialog";
import { toast } from "sonner";
import { UniversidadDataTable } from "./_data-table";

interface TableProps {
  universidades: Universidad[];
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setUniversidadSelected: (universidad: Universidad) => void;
}

const TableUniversidades = ({
  universidades,
  setOpen,
  setOpenDelete,
  setUniversidadSelected,
}: TableProps) => {
  return (
    <UniversidadDataTable universidades={universidades} setOpen={setOpen} setOpenDelete={setOpenDelete} setUniversidadSelected={setUniversidadSelected} />
  );
};

export default function UniversidadesTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [universidadSelected, setUniversidadSelected] = useState<Universidad>();
  const [universidades, setUniversidades] = useState<Universidad[]>([]);

  const fetchUniversidades = async () => {
    const response = await fetchUniversidadesData();
    if (response.data) setUniversidades(response.data);
  };

  const refreshUniversidades = async () => {
    fetchUniversidades();
    setUniversidadSelected(undefined);
    setOpen(false);
    setOpenDelete(false);
  };

  const deactivateUniversidad = async () => {
    if (!universidadSelected) return;

    const response = await createOrUpdateUniversidad(universidadSelected, {
      activo: universidadSelected.activo ? false : true,
    });

    if (response.ok) {
      refreshUniversidades();
      toast(
        `Universidad ${
          universidadSelected.activo ? "inactivada" : "activada"
        } correctamente`
      );
    }
  };

  useEffect(() => {
    if (!open) {
      setUniversidadSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchUniversidades();
  }, []);

  console.log(universidades);

  return (
    <div>
      <div>
        <CustomDialog
          triggerText={
            <Button>
              <PlusCircle />
              Añadir universidad
            </Button>
          }
          open={open}
          setOpen={setOpen}
        >
          <UniversidadForm
            key={universidadSelected?.id}
            universidad={universidadSelected}
            onUniversidadCreatedOrUpdated={refreshUniversidades}
          />
        </CustomDialog>

        <CustomDialog
          triggerText={<div className="hidden"></div>}
          open={openDelete}
          setOpen={setOpenDelete}
        >
          <p className="my-4">
            ¿Está seguro/a que desea{" "}
            {universidadSelected?.activo ? "inactivar" : "activar"} la
            universidad <strong>{universidadSelected?.nombre}</strong>?
          </p>
          <Button onClick={() => deactivateUniversidad()} variant="destructive">
            {universidadSelected?.activo ? "Inactivar" : "Activar"}
          </Button>
        </CustomDialog>
      </div>

      <h1 className="font-semibold mt-10">Universidades activas</h1>

      <TableUniversidades
        universidades={universidades.filter(
          (universidad) => universidad.activo
        )}
        setUniversidadSelected={setUniversidadSelected}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
      />

      <hr className="my-10" />

      <h1 className="font-semibold mt-10">Universidades inactivas</h1>

      <TableUniversidades
        universidades={universidades.filter(
          (universidad) => !universidad.activo
        )}
        setUniversidadSelected={setUniversidadSelected}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
      />
    </div>
  );
}
