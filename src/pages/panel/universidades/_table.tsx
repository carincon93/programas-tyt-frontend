import type { Universidad } from "@/lib/types";
import {
  fetchUniversidadesData,
  deleteUniversidad,
} from "@/services/universidad.service";
import { useEffect, useState } from "react";
import UniversidadForm from "./_form";
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

export default function UniversidadesTable() {
  const [open, setOpen] = useState<boolean>(false);
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
  };

  const removeUniversidad = async (universidad: Universidad) => {
    const response = await deleteUniversidad(universidad);
    if (response.ok) {
      refreshUniversidades();
      toast("Universidad eliminada correctamente");
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
            <>
              <PlusCircle />
              Añadir universidad
            </>
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
      </div>

      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Nombre</TableHead>
            <TableHead className="text-left">Dirección</TableHead>
            <TableHead className="text-left">Teléfono</TableHead>
            <TableHead className="text-right w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {universidades.length > 0 ? (
            universidades.map((universidad) => (
              <TableRow key={universidad.id}>
                <TableCell>{universidad.nombre}</TableCell>
                <TableCell>{universidad.direccion}</TableCell>
                <TableCell>{universidad.telefono}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    onClick={() => {
                      setOpen(true), setUniversidadSelected(universidad);
                    }}
                    size="sm"
                  >
                    <Edit2 />
                  </Button>
                  <CustomDialog triggerText={<Trash2 color="red" />}>
                    <p className="my-4">
                      ¿Está seguro/a que desea eliminar la{" "}
                      <strong>universidad</strong>?
                    </p>
                    <Button
                      onClick={() => removeUniversidad(universidad)}
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
              <TableCell colSpan={4}>No hay datos para mostrar</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
