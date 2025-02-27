import type { Asignatura } from "@/lib/types";
import {
  fetchAsignaturasData,
  deleteAsignatura,
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
import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import CustomDialog from "@/components/CustomDialog";
import AsignaturaProfesoresForm from "./_form-profesores";
import { toast } from "sonner";

export default function AsignaturasTable() {
  const [open, setOpen] = useState<boolean>(false);
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
  };

  const removeAsignatura = async (asignatura: Asignatura) => {
    const response = await deleteAsignatura(asignatura);
    if (response.ok) {
      refreshAsignaturas();
      toast("Asignatura eliminada correctamente");
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
      <h1>Asignaturas</h1>
      <div>
        <CustomDialog
          triggerText={
            <>
              <PlusCircle />
              Añadir asignatura
            </>
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
      </div>
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Código</TableHead>
            <TableHead className="text-left">Nombre</TableHead>
            <TableHead className="text-left">Profesores</TableHead>
            <TableHead className="text-left">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asignaturas.map((asignatura) => (
            <TableRow key={asignatura.id}>
              <TableCell>{asignatura.codigoAsignatura}</TableCell>
              <TableCell>{asignatura.nombre}</TableCell>
              <TableCell>
                {asignatura.asignaturaProfesores.map((asignaturaProfesor) => (
                  <div key={asignaturaProfesor.id}>
                    {asignaturaProfesor.profesor.user?.nombres}{" "}
                    {asignaturaProfesor.profesor.user?.apellidos}
                    <a
                      href={`/panel/asignaturas/${asignaturaProfesor.id}/profesores/${asignaturaProfesor.profesor.id}/horarios`}
                    >
                      Horarios
                    </a>
                  </div>
                ))}
                <CustomDialog
                  triggerText="Profesores"
                  title="Asignar profesores"
                >
                  <AsignaturaProfesoresForm
                    asignatura={asignatura}
                    onAsignaturaProfesoresCreatedOrUpdated={refreshAsignaturas}
                  />
                </CustomDialog>
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  onClick={() => {
                    setOpen(true), setAsignaturaSelected(asignatura);
                  }}
                >
                  <Edit2 />
                </Button>
                <CustomDialog triggerText={<Trash2 color="red" />}>
                  <p className="my-4">
                    ¿Está seguro/a que desea eliminar la{" "}
                    <strong>asignatura</strong>?
                  </p>
                  <Button
                    onClick={() => removeAsignatura(asignatura)}
                    variant="destructive"
                  >
                    Eliminar
                  </Button>
                </CustomDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
