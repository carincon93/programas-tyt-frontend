import {
    useReactTable,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
  } from "@tanstack/react-table";
  import { ChevronDown } from "lucide-react";
  
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Input } from "@/components/ui/input";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { columns } from "./_columns";
  import { Fragment, useState } from "react";
  import type { Estudiante } from "@/lib/types";
  
  interface EstudianteGrupoDataTableProps {
    estudiantes: Estudiante[];
    setOpenNota: (open: boolean) => void;
    setOpenAsistencia: (open: boolean) => void;
    setEstudianteSelected: (estudiante: Estudiante) => void;
  }
  
  export function EstudianteGrupoDataTable({
    estudiantes,
    setOpenNota,
    setOpenAsistencia,
    setEstudianteSelected,
  }: EstudianteGrupoDataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  
    const table = useReactTable({
      data: estudiantes,
      columns: columns({ setOpenNota, setOpenAsistencia, setEstudianteSelected }),
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
      },
    });
  
    const [columnToFilter, setColumnToFilter] = useState("Nombres");
    const [rowSelection, setRowSelection] = useState<string>("");
  
    const toggleSelection = (id: string) => {
      if (id === rowSelection) {
        setRowSelection("");
        return;
      }
  
      setRowSelection(id);
    };
  
    return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder={`Filtrar por`}
              value={
                (table.getColumn(columnToFilter)?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn(columnToFilter)
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto text-xs">
                  {columnToFilter} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuItem
                        className={`text-xs ${
                          columnToFilter === column.id ? "font-semibold" : ""
                        }`}
                        key={column.id}
                        onClick={() => setColumnToFilter(column.id)}
                      >
                        {column.id}
                      </DropdownMenuItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto text-xs">
                Columnas a mostrar <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      className="text-xs"
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table className="text-xs">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => toggleSelection(row.id)}
                      className={`cursor-pointer ${
                        rowSelection === row.id ? "bg-slate-200" : "bg-white"
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
  
                    {row.original.grupo.horarios &&
                      row.original.grupo.horarios.length > 0 &&
                      row.original.grupo.horarios.map((horario) => (
                        <TableRow
                          key={horario.id}
                          hidden={!(rowSelection === row.id)}
                        >
                          <TableCell
                            className={`border ${
                              rowSelection === row.id
                                ? "bg-slate-200"
                                : "bg-white"
                            }`}
                            colSpan={table.getAllColumns().length}
                          >
                            <div className="mb-6 bg-white rounded-md shadow-md">
                              <div className="p-2 border text-center bg-gray-200">
                                <strong>Asignatura:</strong>{" "}
                                {horario.asignaturaProfesor?.asignatura.nombre} |{" "}
                                <strong>Profesor:</strong>{" "}
                                {horario.asignaturaProfesor.profesor.user
                                  .nombres +
                                  " " +
                                  horario.asignaturaProfesor.profesor.user
                                    .apellidos}
                              </div>
                              <div className="p-2 text-center border bg-gray-100">
                                <strong>Notas</strong>{" "}
                              </div>
  
                              <div className="grid grid-cols-4">
                                <div className="border text-center p-2">
                                  <strong>Periodo 1</strong>
                                  <div className="mt-2">
                                    {row.original.notas.find(
                                      (nota) =>
                                        nota.asignaturaProfesorId ===
                                          horario.asignaturaProfesor?.id &&
                                        nota.periodo === "1"
                                    )?.nota || "Sin nota"}
                                  </div>
                                </div>
  
                                <div className="border text-center p-2">
                                  <strong>Periodo 2</strong>
                                  <div className="mt-2">
                                    {row.original.notas.find(
                                      (nota) =>
                                        nota.asignaturaProfesorId ===
                                          horario.asignaturaProfesor?.id &&
                                        nota.periodo === "2"
                                    )?.nota || "Sin nota"}
                                  </div>
                                </div>
  
                                <div className="border text-center p-2">
                                  <strong>Periodo 3</strong>
                                  <div className="mt-2">
                                    {row.original.notas.find(
                                      (nota) =>
                                        nota.asignaturaProfesorId ===
                                          horario.asignaturaProfesor?.id &&
                                        nota.periodo === "3"
                                    )?.nota || "Sin nota"}
                                  </div>
                                </div>
  
                                <div className="border text-center p-2">
                                  <strong>Periodo 4</strong>
                                  <div className="mt-2">
                                    {row.original.notas.find(
                                      (nota) =>
                                        nota.asignaturaProfesorId ===
                                          horario.asignaturaProfesor?.id &&
                                        nota.periodo === "4"
                                    )?.nota || "Sin nota"}
                                  </div>
                                </div>
                              </div>
  
                              <div className="p-2 text-center border bg-gray-100">
                                <strong>Asistencias</strong>{" "}
                              </div>
  
                              <div className="grid grid-cols-4">
                                <div className="border text-center p-2">
                                  <strong>Periodo 1</strong>
                                  <div className="mt-2">
                                    Asistió{" "}
                                    {
                                      row.original.asistencias.filter(
                                        (asistencia) =>
                                          asistencia.asignaturaProfesorId ===
                                            horario.asignaturaProfesor?.id &&
                                          asistencia.periodo === "1" &&
                                          asistencia.asiste === true
                                      )?.length
                                    }{" "}
                                    veces | No asistió{" "}
                                    {
                                      row.original.asistencias.filter(
                                        (asistencia) =>
                                          asistencia.asignaturaProfesorId ===
                                            horario.asignaturaProfesor?.id &&
                                          asistencia.periodo === "1" &&
                                          asistencia.asiste === false
                                      )?.length
                                    }{" "}
                                  </div>
                                </div>
  
                                <div className="border text-center p-2">
                                  <strong>Periodo 2</strong>
                                  <div className="mt-2">
                                    Asistió{" "}
                                    {
                                      row.original.asistencias.filter(
                                        (asistencia) =>
                                          asistencia.asignaturaProfesorId ===
                                            horario.asignaturaProfesor?.id &&
                                          asistencia.periodo === "2" &&
                                          asistencia.asiste === true
                                      )?.length
                                    }{" "}
                                    veces | No asistió{" "}
                                    {
                                      row.original.asistencias.filter(
                                        (asistencia) =>
                                          asistencia.asignaturaProfesorId ===
                                            horario.asignaturaProfesor?.id &&
                                          asistencia.periodo === "2" &&
                                          asistencia.asiste === false
                                      )?.length
                                    }{" "}
                                  </div>
                                </div>
  
                                <div className="border text-center p-2">
                                  <strong>Periodo 3</strong>
                                  <div className="mt-2">
                                    Asistió{" "}
                                    {
                                      row.original.asistencias.filter(
                                        (asistencia) =>
                                          asistencia.asignaturaProfesorId ===
                                            horario.asignaturaProfesor?.id &&
                                          asistencia.periodo === "3" &&
                                          asistencia.asiste === true
                                      )?.length
                                    }{" "}
                                    veces | No asistió{" "}
                                    {
                                      row.original.asistencias.filter(
                                        (asistencia) =>
                                          asistencia.asignaturaProfesorId ===
                                            horario.asignaturaProfesor?.id &&
                                          asistencia.periodo === "3" &&
                                          asistencia.asiste === false
                                      )?.length
                                    }{" "}
                                  </div>
                                </div>
  
                                <div className="border text-center p-2">
                                  <strong>Periodo 4</strong>
                                  <div className="mt-2">
                                    Asistió{" "}
                                    {
                                      row.original.asistencias.filter(
                                        (asistencia) =>
                                          asistencia.asignaturaProfesorId ===
                                            horario.asignaturaProfesor?.id &&
                                          asistencia.periodo === "4" &&
                                          asistencia.asiste === true
                                      )?.length
                                    }{" "}
                                    veces | No asistió{" "}
                                    {
                                      row.original.asistencias.filter(
                                        (asistencia) =>
                                          asistencia.asignaturaProfesorId ===
                                            horario.asignaturaProfesor?.id &&
                                          asistencia.periodo === "4" &&
                                          asistencia.asiste === false
                                      )?.length
                                    }{" "}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    Sin resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div> */}
      </div>
    );
  }
  