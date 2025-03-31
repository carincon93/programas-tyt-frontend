import type { User } from "@/lib/types";
import { fetchUsersData, deleteUser } from "@/services/user.service";
import { useEffect, useState } from "react";
import UserForm from "./_form";
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
import { Edit2, EllipsisVertical, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function UsersTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [userSelected, setUserSelected] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const response = await fetchUsersData();
    if (response.data) setUsers(response.data);
  };

  const refreshUsers = async () => {
    fetchUsers();
    setUserSelected(undefined);
    setOpen(false);
    setOpenDelete(false);
  };

  const removeUser = async () => {
    if (!userSelected) return;

    const response = await deleteUser(userSelected);
    if (response.ok) {
      refreshUsers();
      toast("User eliminado correctamente");
    }
  };

  useEffect(() => {
    if (!open && !openDelete) {
      setUserSelected(undefined);
    }
  }, [open || openDelete]);

  useEffect(() => {
    fetchUsers();
  }, []);

  console.log(users);

  return (
    <div>
      <div>
        <CustomDialog
          triggerText={
            <Button>
              <PlusCircle />
              Añadir usuario
            </Button>
          }
          open={open}
          setOpen={setOpen}
        >
          <UserForm
            key={userSelected?.id}
            user={userSelected}
            onUserCreatedOrUpdated={refreshUsers}
          />
        </CustomDialog>

        <CustomDialog
          triggerText={<div className="hidden"></div>}
          open={openDelete}
          setOpen={setOpenDelete}
        >
          <p className="my-4">
            ¿Está seguro/a que desea eliminar a{" "}
            <strong>{userSelected?.nombres}</strong>?
          </p>
          <Button onClick={() => removeUser()} variant="destructive">
            Eliminar
          </Button>
        </CustomDialog>
      </div>

      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left border font-bold text-black">
              Nombre
            </TableHead>
            <TableHead className="text-center w-[180px] font-bold text-black">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="border">
                  {user.nombres + " " + user.apellidos}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 block w-full shadow-sm hover:cursor-pointer hover:bg-slate-100">
                      <EllipsisVertical size="14px" className="mx-auto" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white p-4 shadow space-y-2">
                      <DropdownMenuItem>
                        <button
                          onClick={() => {
                            setOpen(true), setUserSelected(user);
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
                            setUserSelected(user), setOpenDelete(true);
                          }}
                          className="flex items-center gap-2 p-2"
                        >
                          <Trash2 color="red" size="14px" />
                          Eliminar
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No hay datos para mostrar</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
