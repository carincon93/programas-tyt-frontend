import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Ban,
  Check,
  Edit2,
  FileDigit,
  ListTodo,
  MoreVertical,
  UserCheck,
  UserRoundX,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Grupo } from "@/lib/types";

interface ColumnsProps {
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setGrupoSelected: (estudiante: Grupo) => void;
}

export const columns = ({
  setOpen,
  setOpenDelete,
  setGrupoSelected,
}: ColumnsProps): ColumnDef<Grupo>[] => [
  {
    id: "Código del grupo",
    accessorFn: (row) => row.codigoGrupo,
    header: ({ column }) => {
      return (
        <Button
          className="!pl-0 text-xs uppercase text-black"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Código del grupo
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue() as string}</div>
    ),
  },
  {
    id: "Programa",
    accessorFn: (row) => row.programa?.nombre,
    header: ({ column }) => {
      return (
        <Button
          className="!pl-0 text-xs uppercase text-black"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Programa
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

            <DropdownMenuItem>
                <a
                href={`/panel/grupos/${row.original.id}/estudiantes`}
                className="inline-flex justify-center items-center gap-1 hover:opacity-60"
                >
                <Users size="14px" />
                Estudiantes
                </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <button
                onClick={() => {
                    setOpen(true), setGrupoSelected(row.original);
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
                    setOpenDelete(true), setGrupoSelected(row.original);
                }}
                className="flex items-center gap-2 p-2"
                >
                {row.original.activo ? (
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
      );
    },
  },
];
