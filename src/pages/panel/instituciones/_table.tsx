import type { Institucion } from "@/lib/types";
import {
  fetchInstitucionesData,
  deleteInstitucion,
  createOrUpdateInstitucion,
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
import CustomDialog from "@/components/CustomDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ban,
  Check,
  Edit2,
  EllipsisVertical,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

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
    <Table className="table-fixed w-full text-xs mt-4 border">
      <TableHeader>
        <TableRow>
          <TableHead className="text-left border font-bold text-black">
            Nombre
          </TableHead>
          <TableHead className="text-left border font-bold text-black">
            Dirección
          </TableHead>
          <TableHead className="text-left border font-bold text-black">
            Teléfono
          </TableHead>
          <TableHead className="text-center font-bold w-[100px] text-black">
            Acciones
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {instituciones.length > 0 ? (
          instituciones.map((institucion) => (
            <TableRow key={institucion.id}>
              <TableCell className="border">{institucion.nombre}</TableCell>
              <TableCell className="border">{institucion.direccion}</TableCell>
              <TableCell className="border">{institucion.telefono}</TableCell>
              <TableCell className="space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 block w-full shadow-sm hover:cursor-pointer hover:bg-slate-100">
                    <EllipsisVertical size="14px" className="mx-auto" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white p-4 shadow space-y-2">
                    <DropdownMenuItem>
                      <button
                        onClick={() => {
                          setOpen(true), setInstitucionSelected(institucion);
                        }}
                        className="flex items-center gap-2 p-2"
                      >
                        <Edit2 size="14px" />
                        Editar
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button
                        onClick={() => {
                          setOpenDelete(true),
                            setInstitucionSelected(institucion);
                        }}
                        className="flex items-center gap-2 p-2"
                      >
                        {institucion.activo ? (
                          <>
                            <Ban size="14px" />
                            Inactivar
                          </>
                        ) : (
                          <>
                            <Check size="14px" />
                            Activar
                          </>
                        )}
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
