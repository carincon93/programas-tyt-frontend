import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Edit2,
  FileDigit,
  ListTodo,
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
import type { Estudiante } from "@/lib/types";

interface ColumnsProps {
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setEstudianteSelected: (estudiante: Estudiante) => void;
}

export const columns = ({
  setOpen,
  setOpenDelete,
  setEstudianteSelected,
}: ColumnsProps): ColumnDef<Estudiante>[] => [
  {
    id: "Código del estudiante",
    accessorFn: (row) => row.codigoEstudiante,
    header: () => {
      return <div className="uppercase text-black">Código del estudiante</div>;
    },
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue() as string}</div>
    ),
  },
  {
    id: "Nombres",
    accessorFn: (row) => row.user?.nombres,
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
    accessorFn: (row) => row.user?.apellidos,
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
    id: "Institución",
    accessorFn: (row) => row.institucion.nombre,
    header: ({ column }) => {
      return (
        <Button
          className="!pl-0 text-xs uppercase text-black"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Institución
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
    accessorFn: (row) => row.grupo.programa?.nombre,
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
                href={`/panel/estudiantes/${row.original.id}/notas`}
                className="inline-flex justify-center items-center gap-1 hover:opacity-60"
              >
                <FileDigit size={10} />
                Histórico de notas
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a
                href={`/panel/estudiantes/${row.original.id}/asistencias`}
                className="inline-flex justify-center items-center gap-1 hover:opacity-60"
              >
                <ListTodo size={10} />
                Histórico de asistencias
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                setOpen(true), setEstudianteSelected(row.original);
              }}
            >
              <Edit2 />
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setOpenDelete(true), setEstudianteSelected(row.original);
              }}
            >
              {row.original.user.activo ? (
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
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
