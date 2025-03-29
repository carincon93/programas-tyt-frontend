import type { Profesor } from "@/lib/types";
import {
  fetchProfesoresData,
  deleteProfesor,
} from "@/services/profesor.service";
import { useEffect, useState } from "react";
import ProfesorForm from "./_form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import CustomDialog from "@/components/CustomDialog";
import { toast } from "sonner";

export default function ProfesoresTable() {
  const [open, setOpen] = useState<boolean>(false);
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
  };

  const removeProfesor = async (profesor: Profesor) => {
    const response = await deleteProfesor(profesor);
    if (response.ok) {
      refreshProfesores();
      toast("Profesor eliminado correctamente");
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
            <>
              <PlusCircle />
              Añadir profesor
            </>
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
      </div>

      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Nombre</TableHead>
            <TableHead className="text-left">Universidad</TableHead>
            <TableHead className="text-right w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profesores.length > 0 ? (
            profesores.map((profesor) => (
              <TableRow key={profesor.id}>
                <TableCell>
                  {profesor.user.nombres + " " + profesor.user.apellidos}
                </TableCell>
                <TableCell>{profesor.universidad.nombre}</TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button
                    onClick={() => {
                      setOpen(true), setProfesorSelected(profesor);
                    }}
                    size="sm"
                  >
                    <Edit2 />
                  </Button>
                  <CustomDialog triggerText={<Trash2 color="red" />}>
                    <p className="my-4">
                      ¿Está seguro/a que desea eliminar el/la{" "}
                      <strong>profesor</strong>?
                    </p>
                    <Button
                      onClick={() => removeProfesor(profesor)}
                      variant="destructive"
                    >
                      Eliminar
                    </Button>
                  </CustomDialog>
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
