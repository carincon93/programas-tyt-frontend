import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Ban,
  Check,
  Edit2,
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
import type { Asignatura } from "@/lib/types";
import CustomDialog from "@/components/CustomDialog";
import AsignaturaProfesoresForm from "./_form-profesores";

interface ColumnsProps {
  setOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  setAsignaturaSelected: (asignatura: Asignatura) => void;
  refreshAsignaturas: () => Promise<void>;
}

export const columns = ({
  setOpen,
  setOpenDelete,
  setAsignaturaSelected,
  refreshAsignaturas,
}: ColumnsProps): ColumnDef<Asignatura>[] => [
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
    id: "Profsores",
    accessorKey: "profesores",
    header: ({ column }) => {
      return (
        <Button
          className="!pl-0 text-xs uppercase text-black"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Profsores
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
        <div>
            {row.original.asignaturaProfesores?.map((asignaturaProfesor) => (
                <div key={asignaturaProfesor.id}>
                {asignaturaProfesor.profesor.user?.nombres}{" "}
                {asignaturaProfesor.profesor.user?.apellidos}
                {" - "}
                <a
                    href={`/panel/asignaturas/${asignaturaProfesor.id}/profesores/${asignaturaProfesor.profesor.id}/horarios`}
                    className="inline-flex justify-center items-center gap-1 underline hover:opacity-60"
                >
                    <ExternalLink size={10} className="top-0.5 relative" />
                    Revisar horario
                </a>
                </div>
            ))}
            <div className="mt-4">
                <CustomDialog
                triggerText={
                    <small className="inline-flex items-center gap-2">
                    <PlusCircle size={10} /> Asociar
                    </small>
                }
                title="Asignar profesores"
                >
                <AsignaturaProfesoresForm
                    asignatura={row.original}
                    onAsignaturaProfesoresCreatedOrUpdated={refreshAsignaturas}
                />
                </CustomDialog>
            </div>
          </div>
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
                setOpen(true), setAsignaturaSelected(row.original);
              }}
            >
              <Edit2 />
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setOpenDelete(true), setAsignaturaSelected(row.original);
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
