import type { Rol } from "@/lib/types";
import { fetchRolesData, deleteRol } from "@/services/rol.service";
import { useEffect, useState } from "react";
import RolForm from "./_form";
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

export default function RolesTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [rolSelected, setRolSelected] = useState<Rol>();
  const [roles, setRoles] = useState<Rol[]>([]);

  const fetchRoles = async () => {
    const response = await fetchRolesData();
    if (response.data) setRoles(response.data);
  };

  const refreshRoles = async () => {
    fetchRoles();
    setRolSelected(undefined);
    setOpen(false);
  };

  const removeRol = async (rol: Rol) => {
    const response = await deleteRol(rol);
    if (response.ok) {
      refreshRoles();
      toast("Rol eliminado correctamente");
    }
  };

  useEffect(() => {
    if (!open) {
      setRolSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchRoles();
  }, []);

  console.log(roles);

  return (
    <div>
      {/* <div>
        <CustomDialog
          triggerText={
            <>
              <PlusCircle />
              Añadir rol
            </>
          }
          open={open}
          setOpen={setOpen}
        >
          <RolForm
            key={rolSelected?.id}
            rol={rolSelected}
            onRolCreatedOrUpdated={refreshRoles}
          />
        </CustomDialog>
      </div> */}

      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left border font-bold text-black">
              Nombre
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Descripción
            </TableHead>
            {/* <TableHead className="text-center font-bold w-[100px] text-black">
              Acciones
            </TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length > 0 ? (
            roles.map((rol) => (
              <TableRow key={rol.id}>
                <TableCell className="border">{rol.nombre}</TableCell>
                <TableCell className="border">{rol.descripcion}</TableCell>
                {/* <TableCell className="space-x-2">
                  <Button
                    onClick={() => {
                      setOpen(true), setRolSelected(rol);
                    }}
                    size="sm"
                  >
                    <Edit2 />
                  </Button>
                  <CustomDialog triggerText={<Trash2 color="red" />}>
                    <p className="my-4">
                      ¿Está seguro/a que desea eliminar el <strong>rol</strong>?
                    </p>
                    <Button
                      onClick={() => removeRol(rol)}
                      variant="destructive"
                    >
                      Eliminar
                    </Button>
                  </CustomDialog>
                </TableCell> */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2}>No hay datos para mostrar</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
