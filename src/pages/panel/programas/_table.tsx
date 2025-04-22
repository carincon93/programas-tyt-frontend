import type { Programa } from "@/lib/types";
import {
  fetchProgramasData,
  deletePrograma,
  createOrUpdatePrograma,
} from "@/services/programa.service";
import { useEffect, useState } from "react";
import ProgramaForm from "./_form";
import { Button } from "@/components/ui/button";
import CustomDialog from "@/components/CustomDialog";
import {
  PlusCircle
} from "lucide-react";
import { toast } from "sonner";
import { ProgramaDataTable } from "./_data-table";

interface TableProps {
  programas: Programa[];
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setProgramaSelected: (programa: Programa) => void;
}

const TableProgramas = ({
  programas,
  setOpen,
  setOpenDelete,
  setProgramaSelected,
}: TableProps) => {
  return (
    <ProgramaDataTable programas={programas} setOpen={setOpen} setOpenDelete={setOpenDelete} setProgramaSelected={setProgramaSelected} />
  );
};

export default function ProgramasTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [programaSelected, setProgramaSelected] = useState<Programa>();
  const [programas, setProgramas] = useState<Programa[]>([]);

  const fetchProgramas = async () => {
    const response = await fetchProgramasData();
    if (response.data) setProgramas(response.data);
  };

  const refreshProgramas = async () => {
    fetchProgramas();
    setProgramaSelected(undefined);
    setOpen(false);
    setOpenDelete(false);
  };

  const deactivatePrograma = async () => {
    if (!programaSelected) return;

    const response = await createOrUpdatePrograma(programaSelected, {
      activo: programaSelected.activo ? false : true,
    });

    if (response.ok) {
      refreshProgramas();
      toast(
        `Programa ${
          programaSelected.activo ? "inactivado" : "activado"
        } correctamente`
      );
    }
  };

  useEffect(() => {
    if (!open) {
      setProgramaSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchProgramas();
  }, []);

  console.log(programas);

  return (
    <div>
      <div>
        <CustomDialog
          triggerText={
            <Button>
              <PlusCircle />
              Añadir programa
            </Button>
          }
          open={open}
          setOpen={setOpen}
        >
          <ProgramaForm
            key={programaSelected?.id}
            programa={programaSelected}
            onProgramaCreatedOrUpdated={refreshProgramas}
          />
        </CustomDialog>

        <CustomDialog
          triggerText={<div className="hidden"></div>}
          open={openDelete}
          setOpen={setOpenDelete}
        >
          <p className="my-4">
            ¿Está seguro/a que desea{" "}
            {programaSelected?.activo ? "inactivar" : "activar"}
            el programa <strong>{programaSelected?.nombre}</strong>?
          </p>
          <Button onClick={() => deactivatePrograma()} variant="destructive">
            {programaSelected?.activo ? "Inactivar" : "Activar"}
          </Button>
        </CustomDialog>
      </div>

      <h1 className="font-semibold mt-10">Programas activos</h1>

      <TableProgramas
        programas={programas.filter((programa) => programa.activo)}
        setProgramaSelected={setProgramaSelected}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
      />

      <hr className="my-10" />

      <h1 className="font-semibold mt-10">Programas inactivos</h1>

      <TableProgramas
        programas={programas.filter((programa) => !programa.activo)}
        setProgramaSelected={setProgramaSelected}
        setOpen={setOpen}
        setOpenDelete={setOpenDelete}
      />
    </div>
  );
}
