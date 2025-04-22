import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Ban,
  Check,
  Edit2,
  MoreVertical,
 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Programa } from "@/lib/types";

interface ColumnsProps {
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setProgramaSelected: (programa: Programa) => void;
}

export const columns = ({
  setOpen,
  setOpenDelete,
  setProgramaSelected,
}: ColumnsProps): ColumnDef<Programa>[] => [
  {
    id: "Nombre",
    accessorFn: (row) => row.nombre,
    header: ({ column }) => {
      return (
        <Button
          className="!pl-0 text-xs uppercase text-black"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue() as string}</div>
    ),
  },
  {
    id: "Código del programa",
    accessorFn: (row) => row.codigoPrograma,
    header: ({ column }) => {
      return (
        <Button
          className="!pl-0 text-xs uppercase text-black"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Código del programa
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue() as string}</div>
    ),
  },
  {
    id: "Universidad",
    accessorFn: (row) => row.universidad.nombre,
    header: ({ column }) => {
      return (
        <Button
          className="!pl-0 text-xs uppercase text-black"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Universidad
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
                setOpen(true), setProgramaSelected(row.original);
              }}
            >
              <Edit2 />
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setOpenDelete(true), setProgramaSelected(row.original);
              }}
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
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
