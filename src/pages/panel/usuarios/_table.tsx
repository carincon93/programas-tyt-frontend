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
import { Edit2, ExternalLink, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function UsersTable() {
  const [open, setOpen] = useState<boolean>(false);
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
  };

  const removeUser = async (user: User) => {
    const response = await deleteUser(user);
    if (response.ok) {
      refreshUsers();
      toast("User eliminado correctamente");
    }
  };

  useEffect(() => {
    if (!open) {
      setUserSelected(undefined);
    }
  }, [open]);

  useEffect(() => {
    fetchUsers();
  }, []);

  console.log(users);

  return (
    <div>
      <div>
        <CustomDialog
          triggerText={
            <>
              <PlusCircle />
              Añadir usuario
            </>
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
      </div>

      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Nombre</TableHead>
            <TableHead className="text-right w-[180px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nombres + " " + user.apellidos}</TableCell>
                <TableCell className="text-right">
                  <div>
                    <div className="space-x-2 mt-4">
                      <Button
                        onClick={() => {
                          setOpen(true), setUserSelected(user);
                        }}
                        size="sm"
                      >
                        <Edit2 />
                      </Button>
                      <CustomDialog triggerText={<Trash2 color="red" />}>
                        <p className="my-4">
                          ¿Está seguro/a que desea eliminar el{" "}
                          <strong>user</strong>?
                        </p>
                        <Button
                          onClick={() => removeUser(user)}
                          variant="destructive"
                        >
                          Eliminar
                        </Button>
                      </CustomDialog>
                    </div>
                  </div>
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
