import type { Profesor } from "@/lib/types";
import {
  fetchProfesoresData,
  deleteProfesor,
  createOrUpdateProfesor,
} from "@/services/profesor.service";
import { useEffect, useState } from "react";
import ProfesorForm from "./_form";
import { Button } from "@/components/ui/button";
import CustomDialog from "@/components/CustomDialog";
import {
  PlusCircle
} from "lucide-react";
import { toast } from "sonner";
import { ProfesorDataTable } from "./_data-table";

interface TableProfesoresProps {
  profesores: Profesor[];
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setProfesorSelected: (profesor: Profesor) => void;
}

const TableProfesores = ({
  profesores,
  setOpen,
  setOpenDelete,
  setProfesorSelected,
}: TableProfesoresProps) => {
  return (
    <ProfesorDataTable profesores={profesores} setOpen={setOpen} setOpenDelete={setOpenDelete} setProfesorSelected={setProfesorSelected} />
  );
};

export default function ProfesoresTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [profesorSelected, setProfesorSelected] = useState<Profesor>();
  const [profesores, setProfesores] = useState<Profesor[]>([]);

  const fetchProfesores = async () => {
    const response = await fetchProfesoresData();
    if (response.data) setProfesores(response.data);
  };

  const refreshProfesores = async () => {
    fetchProfesores();
    setProfesorSelected(undefined);
    setOpen(false);
    setOpenDelete(false);
  };

  const deactivateProfesor = async () => {
    if (!profesorSelected) return;

    const response = await createOrUpdateProfesor(profesorSelected, {
      ...profesorSelected,
      user: { activo: profesorSelected.user.activo ? false : true },
    });

    if (response.ok) {
      refreshProfesores();
      toast(
        `Profesor ${
          profesorSelected.user.activo ? "inactivado" : "activado"
        } correctamente`
      );
    }
  };

  useEffect(() => {
    if (!open) {
      setProfesorSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchProfesores();
  }, []);

  console.log(profesores);

  return (
    <div>
      <div>
        <CustomDialog
          triggerText={
            <Button>
              <PlusCircle />
              Añadir profesor
            </Button>
          }
          dialogContentClassName="h-full overflow-y-auto"
          open={open}
          setOpen={setOpen}
        >
          <ProfesorForm
            key={profesorSelected?.id}
            profesor={profesorSelected}
            onProfesorCreatedOrUpdated={refreshProfesores}
          />
        </CustomDialog>

        <CustomDialog
          triggerText={<div className="hidden"></div>}
          open={openDelete}
          setOpen={setOpenDelete}
        >
          <p className="my-4">
            ¿Está seguro/a que desea{" "}
            {profesorSelected?.user.activo ? "inactivar" : "activar"} el/la
            profesor <strong>{profesorSelected?.user.nombres}</strong>?
          </p>
          <Button onClick={() => deactivateProfesor()} variant="destructive">
            {profesorSelected?.user.activo ? "Inactivar" : "Activar"}
          </Button>
        </CustomDialog>
      </div>

      <h1 className="font-semibold mt-10">Profesores activos</h1>

      <TableProfesores
        profesores={profesores.filter((profesor) => profesor.user.activo)}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
        setProfesorSelected={setProfesorSelected}
      />

      <hr className="my-10" />

      <h1 className="font-semibold">Profesores inactivos</h1>

      <TableProfesores
        profesores={profesores.filter((profesor) => !profesor.user.activo)}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
        setProfesorSelected={setProfesorSelected}
      />
    </div>
  );
}
