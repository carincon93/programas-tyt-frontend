import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ExternalLink,
  MoreVertical,
  PlusCircle,
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
  setOpenNota: (open: boolean) => void;
  setOpenAsistencia: (open: boolean) => void;
  setEstudianteSelected: (estudiante: Estudiante) => void;
}

export const columns = ({
  setOpenNota,
  setOpenAsistencia,
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
          <DropdownMenuContent align="end" className="space-y-2">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                setOpenNota(true), setEstudianteSelected(row.original);
              }}
            >
              <PlusCircle size="14px" className="mr-1" />
              Digitar nota
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setOpenAsistencia(true), setEstudianteSelected(row.original);
              }}
            >
              <PlusCircle size="14px" className="mr-1" />
              Digitar asistencia
            </DropdownMenuItem>

            <DropdownMenuItem>
              <a
                href={`/panel/grupos/${row.original.grupo.id}/estudiantes/${row.original.id}/asignaturas`}
                className="inline-flex justify-center items-center gap-1 underline hover:opacity-60"
              >
                <ExternalLink size={10} className="top-0.5 relative mr-2" />
                Progreso
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
