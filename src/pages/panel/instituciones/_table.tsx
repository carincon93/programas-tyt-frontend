import type { Institucion } from "@/lib/types";
import {
  fetchInstitucionesData,
  deleteInstitucion,
} from "@/services/institucion.service";
import { useEffect, useState } from "react";
import InstitucionForm from "./_form";
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

export default function InstitucionesTable() {
  const [open, setOpen] = useState<boolean>(false);
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
  };

  const removeInstitucion = async (institucion: Institucion) => {
    const response = await deleteInstitucion(institucion);
    if (response.ok) {
      refreshInstituciones();
      toast("Institución eliminada correctamente");
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
            <>
              <PlusCircle />
              Añadir institución
            </>
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
          {instituciones.length > 0 ? (
            instituciones.map((institucion) => (
              <TableRow key={institucion.id}>
                <TableCell>{institucion.nombre}</TableCell>
                <TableCell>{institucion.direccion}</TableCell>
                <TableCell>{institucion.telefono}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    onClick={() => {
                      setOpen(true), setInstitucionSelected(institucion);
                    }}
                    size="sm"
                  >
                    <Edit2 />
                  </Button>
                  <CustomDialog triggerText={<Trash2 color="red" />}>
                    <p className="my-4">
                      ¿Está seguro/a que desea eliminar la{" "}
                      <strong>institución</strong>?
                    </p>
                    <Button
                      onClick={() => removeInstitucion(institucion)}
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
