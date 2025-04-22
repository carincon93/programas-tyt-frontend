import type { User } from "@/lib/types";
import { fetchUsersData, deleteUser } from "@/services/user.service";
import { useEffect, useState } from "react";
import UserForm from "./_form";
import { Button } from "@/components/ui/button";
import CustomDialog from "@/components/CustomDialog";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { UserDataTable } from "./_data-table";

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

      <UserDataTable users={users} setOpen={setOpen} setOpenDelete={setOpenDelete} setUserSelected={setUserSelected} />
    </div>
  );
}
