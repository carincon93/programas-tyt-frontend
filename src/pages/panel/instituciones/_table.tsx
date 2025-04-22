import type { Institucion } from "@/lib/types";
import {
  fetchInstitucionesData,
  deleteInstitucion,
  createOrUpdateInstitucion,
} from "@/services/institucion.service";
import { useEffect, useState } from "react";
import InstitucionForm from "./_form";
import { Button } from "@/components/ui/button";
import CustomDialog from "@/components/CustomDialog";
import {
  PlusCircle
} from "lucide-react";
import { toast } from "sonner";
import { InstitucionDataTable } from "./_data-table";

interface TableProps {
  instituciones: Institucion[];
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setInstitucionSelected: (institucion: Institucion) => void;
}

const TableInstituciones = ({
  instituciones,
  setOpen,
  setOpenDelete,
  setInstitucionSelected,
}: TableProps) => {
  return (
    <InstitucionDataTable instituciones={instituciones} setOpen={setOpen} setOpenDelete={setOpenDelete} setInstitucionSelected={setInstitucionSelected} />
  );
};

export default function InstitucionesTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [institucionSelected, setInstitucionSelected] = useState<Institucion>();
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);

  const fetchInstituciones = async () => {
    const response = await fetchInstitucionesData();
    if (response.data) setInstituciones(response.data);
  };

  const refreshInstituciones = async () => {
    fetchInstituciones();
    setInstitucionSelected(undefined);
    setOpen(false);
    setOpenDelete(false);
  };

  const deactivateInstitucion = async () => {
    if (!institucionSelected) return;

    const response = await createOrUpdateInstitucion(institucionSelected, {
      activo: institucionSelected.activo ? false : true,
    });

    if (response.ok) {
      refreshInstituciones();
      toast(
        `Institución ${
          institucionSelected.activo ? "inactivada" : "activada"
        } correctamente`
      );
    }
  };

  useEffect(() => {
    if (!open) {
      setInstitucionSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchInstituciones();
  }, []);

  console.log(instituciones);

  return (
    <div>
      <div>
        <CustomDialog
          triggerText={
            <Button>
              <PlusCircle />
              Añadir institución
            </Button>
          }
          open={open}
          setOpen={setOpen}
        >
          <InstitucionForm
            key={institucionSelected?.id}
            institucion={institucionSelected}
            onInstitucionCreatedOrUpdated={refreshInstituciones}
          />
        </CustomDialog>

        <CustomDialog
          triggerText={<div className="hidden"></div>}
          open={openDelete}
          setOpen={setOpenDelete}
        >
          <p className="my-4">
            ¿Está seguro/a que desea{" "}
            {institucionSelected?.activo ? "inactivar" : "activar"} la
            institución <strong>{institucionSelected?.nombre}</strong>?
          </p>
          <Button onClick={() => deactivateInstitucion()} variant="destructive">
            {institucionSelected?.activo ? "Inactivar" : "Activar"}
          </Button>
        </CustomDialog>
      </div>

      <h1 className="font-semibold mt-10">Instituciones activas</h1>

      <TableInstituciones
        instituciones={instituciones.filter(
          (institucion) => institucion.activo
        )}
        setInstitucionSelected={setInstitucionSelected}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
      />

      <hr className="my-10" />

      <h1 className="font-semibold mt-10">Instituciones inactivas</h1>

      <TableInstituciones
        instituciones={instituciones.filter(
          (institucion) => !institucion.activo
        )}
        setInstitucionSelected={setInstitucionSelected}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
      />
    </div>
  );
}
