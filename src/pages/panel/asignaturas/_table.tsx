import type { Asignatura } from "@/lib/types";
import {
  fetchAsignaturasData,
  deleteAsignatura,
  createOrUpdateAsignatura,
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
  Ban,
  Check,
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
import { AsignaturaDataTable } from "./_data-table";

interface TableProps {
  asignaturas: Asignatura[];
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setAsignaturaSelected: (asignatura: Asignatura) => void;
  refreshAsignaturas: () => Promise<void>;
}

const TableAsignaturas = ({
  asignaturas,
  setOpen,
  setOpenDelete,
  setAsignaturaSelected,
  refreshAsignaturas,
}: TableProps) => {
  return (
    <AsignaturaDataTable asignaturas={asignaturas} setOpen={setOpen} setOpenDelete={setOpenDelete} setAsignaturaSelected={setAsignaturaSelected} refreshAsignaturas={refreshAsignaturas} />
  );
};

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

  const deactivateAsignatura = async () => {
    if (!asignaturaSelected) return;

    const response = await createOrUpdateAsignatura(asignaturaSelected, {
      activo: asignaturaSelected.activo ? false : true
    });

    if (response.ok) {
      refreshAsignaturas();
      toast(
        `Asignatura ${
          asignaturaSelected.activo ? "inactivada" : "activada"
        } correctamente`
      );
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
            ¿Está seguro/a que desea{" "}
            {asignaturaSelected?.activo ? "inactivar" : "activar"} la asignatura{" "}
            <strong>{asignaturaSelected?.nombre}</strong>?
          </p>
          <Button onClick={() => deactivateAsignatura()} variant="destructive">
            {asignaturaSelected?.activo ? "Inactivar" : "Activar"}
          </Button>
        </CustomDialog>
      </div>

      <h1 className="font-semibold mt-10">Asignaturas activas</h1>

      <TableAsignaturas
        asignaturas={asignaturas.filter((asignatura) => asignatura.activo)}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
        setAsignaturaSelected={setAsignaturaSelected}
        refreshAsignaturas={refreshAsignaturas}
      />

      <hr className="my-10" />

      <h1 className="font-semibold">Asignaturas inactivas</h1>

      <TableAsignaturas
        asignaturas={asignaturas.filter((asignatura) => !asignatura.activo)}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
        setAsignaturaSelected={setAsignaturaSelected}
        refreshAsignaturas={refreshAsignaturas}
      />
    </div>
  );
}
