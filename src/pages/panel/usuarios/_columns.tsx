import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Edit2,
  MoreVertical,
  UserCheck,
  UserRoundX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/lib/types";

interface ColumnsProps {
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setUserSelected: (user: User) => void;
}

export const columns = ({
  setOpen,
  setOpenDelete,
  setUserSelected,
}: ColumnsProps): ColumnDef<User>[] => [
  {
    id: "Nombres",
    accessorFn: (row) => row.nombres,
    header: ({ column }) => {
      return (
        <Button
          className="!pl-0 text-xs uppercase text-black"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombres
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue() as string}</div>
    ),
  },
  {
    id: "Apellidos",
    accessorFn: (row) => row.apellidos,
    header: ({ column }) => {
      return (
        <Button
          className="!pl-0 text-xs uppercase text-black"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Apellidos
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue() as string}</div>
    ),
  },
  {
    id: "Rol",
    accessorFn: (row) => row.rol.nombre,
    header: ({ column }) => {
      return (
        <Button
          className="!pl-0 text-xs uppercase text-black"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rol
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue() as string}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                setOpen(true), setUserSelected(row.original);
              }}
            >
              <Edit2 />
              Editar
            </DropdownMenuItem>

            {/* <DropdownMenuItem
              onClick={() => {
                setOpenDelete(true), setUserSelected(row.original);
              }}
            >
              {row.original.activo ? (
                <>
                  <UserRoundX size="14px" />
                  Inactivar
                </>
              ) : (
                <>
                  <UserCheck size="14px" />
                  Activar
                </>
              )}
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
