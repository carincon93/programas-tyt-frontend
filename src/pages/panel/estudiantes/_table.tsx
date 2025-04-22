import type { Estudiante } from "@/lib/types";
import {
  fetchEstudiantesData,
  createOrUpdateEstudiante,
} from "@/services/estudiante.service";
import { useEffect, useState } from "react";
import EstudianteForm from "./_form";
import { Button } from "@/components/ui/button";
import CustomDialog from "@/components/CustomDialog";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { EstudianteDataTable } from "./_data-table";

interface TableProps {
  estudiantes: Estudiante[];
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setEstudianteSelected: (estudiante: Estudiante) => void;
}

const TableEstudiantes = ({
  estudiantes,
  setOpen,
  setOpenDelete,
  setEstudianteSelected,
}: TableProps) => {
  return (
    <EstudianteDataTable
      estudiantes={estudiantes}
      setOpen={setOpen}
      setOpenDelete={setOpenDelete}
      setEstudianteSelected={setEstudianteSelected}
    />
  );
};

export default function EstudiantesTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [estudianteSelected, setEstudianteSelected] = useState<Estudiante>();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);

  const fetchEstudiantes = async () => {
    const response = await fetchEstudiantesData();
    if (response.data) setEstudiantes(response.data);
  };

  const refreshEstudiantes = async () => {
    fetchEstudiantes();
    setEstudianteSelected(undefined);
    setOpen(false);
    setOpenDelete(false);
  };

  const deactivateEstudiante = async () => {
    if (!estudianteSelected) return;

    const response = await createOrUpdateEstudiante(estudianteSelected, {
      ...estudianteSelected,
      user: { activo: estudianteSelected?.user?.activo ? false : true },
    });

    if (response.ok) {
      refreshEstudiantes();
      toast(
        `Estudiante ${
          estudianteSelected?.user?.activo ? "inactivado" : "activado"
        } correctamente`
      );
    }
  };

  useEffect(() => {
    if (!open) {
      setEstudianteSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  console.log(estudiantes);

  return (
    <div>
      <div>
        <CustomDialog
          triggerText={
            <Button>
              <PlusCircle />
              Añadir estudiante
            </Button>
          }
          dialogContentClassName="h-full overflow-y-auto"
          open={open}
          setOpen={setOpen}
        >
          <EstudianteForm
            key={estudianteSelected?.id}
            estudiante={estudianteSelected}
            onEstudianteCreatedOrUpdated={refreshEstudiantes}
          />
        </CustomDialog>

        <CustomDialog
          triggerText={<div className="hidden"></div>}
          open={openDelete}
          setOpen={setOpenDelete}
        >
          <p className="my-4">
            ¿Está seguro/a que desea{" "}
            {estudianteSelected?.user?.activo ? "inactivar" : "activar"} el/la
            estudiante <strong>{estudianteSelected?.user?.nombres}</strong>?
          </p>
          <Button onClick={() => deactivateEstudiante()} variant="destructive">
            {estudianteSelected?.user?.activo ? "Inactivar" : "Activar"}
          </Button>
        </CustomDialog>
      </div>

      <h1 className="font-semibold mt-10">Estudiantes activos</h1>

      <TableEstudiantes
        estudiantes={estudiantes.filter(
          (estudiante) => estudiante.user?.activo
        )}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
        setEstudianteSelected={setEstudianteSelected}
      />

      <hr className="my-10" />

      <h1 className="font-semibold">Estudiantes inactivos</h1>

      <TableEstudiantes
        estudiantes={estudiantes.filter(
          (estudiante) => !estudiante.user.activo
        )}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
        setEstudianteSelected={setEstudianteSelected}
      />
    </div>
  );
}
