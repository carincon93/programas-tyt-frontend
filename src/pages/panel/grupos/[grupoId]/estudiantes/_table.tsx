import CustomDialog from "@/components/CustomDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Estudiante, Grupo } from "@/lib/types";
import { fetchGrupoByIdData } from "@/services/grupo.service";
import { EllipsisVertical, ExternalLink, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import EstudianteNotaForm from "./_nota-form";
import EstudianteAsistenciaForm from "./_asistencia-form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface GruposTableProps {
  grupoId: string | undefined;
}

export default function GruposTable({ grupoId }: GruposTableProps) {
  const [grupo, setGrupo] = useState<Grupo>();
  const [openNota, setOpenNota] = useState<boolean>(false);
  const [openAsistencia, setOpenAsistencia] = useState<boolean>(false);
  const [estudianteSelected, setEstudianteSelected] = useState<Estudiante>();

  const fetchGrupoById = async () => {
    if (!grupoId) return;

    const response = await fetchGrupoByIdData(+grupoId);
    if (response.data) setGrupo(response.data);
  };

  useEffect(() => {
    fetchGrupoById();
  }, []);

  console.log(grupo?.estudiantes);

  return (
    <div>
      <h1 className="inline-block bg-amber-500 rounded-md text-white py-1 px-4 ">
        <strong className="mr-1">Programa:</strong> {grupo?.programa.nombre} |{" "}
        <strong className="mr-1">Grupo:</strong> {grupo?.codigoGrupo}
      </h1>

      <CustomDialog
        triggerText={<div className="hidden"></div>}
        open={openNota}
        setOpen={setOpenNota}
      >
        {estudianteSelected?.id && (
          <EstudianteNotaForm
            estudianteId={estudianteSelected?.id}
            setOpenNota={setOpenNota}
          />
        )}
      </CustomDialog>

      <CustomDialog
        triggerText={<div className="hidden"></div>}
        open={openAsistencia}
        setOpen={setOpenAsistencia}
      >
        {estudianteSelected?.id && (
          <EstudianteAsistenciaForm
            estudianteId={estudianteSelected?.id}
            setOpenAsistencia={setOpenAsistencia}
          />
        )}
      </CustomDialog>
      <hr className="mt-6" />
      <Table className="table-fixed w-full text-xs mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left w-[180px] font-bold text-black">
              Código del estudiante
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Nombre
            </TableHead>
            <TableHead className="text-left border font-bold text-black">
              Institución
            </TableHead>
            <TableHead className="text-center font-bold w-[100px] text-black">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grupo && grupo.estudiantes.length > 0 ? (
            grupo.estudiantes.map((estudiante, index) => (
              <>
                <TableRow key={estudiante.id}>
                  <TableCell
                    className={`border ${index % 2 === 0 ? 'bg-slate-200' : 'bg-white'}`}
                    rowSpan={estudiante.notas.length === 0 ? 2 : estudiante.notas.length + 1}
                  >
                    {estudiante.codigoEstudiante}
                  </TableCell>
                  <TableCell className={`border ${index % 2 === 0 ? 'bg-slate-200' : 'bg-white'}`}>
                    {estudiante.user.nombres + " " + estudiante.user.apellidos}
                  </TableCell>
                  <TableCell className={`border ${index % 2 === 0 ? 'bg-slate-200' : 'bg-white'}`}>
                    {estudiante.institucion.nombre}
                  </TableCell>

                  <TableCell className={`text-right ${index % 2 === 0 ? 'bg-slate-200' : 'bg-white'}`}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 block w-full shadow-sm hover:cursor-pointer bg-white hover:bg-slate-100">
                        <EllipsisVertical size="14px" className="mx-auto" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white p-4 shadow space-y-2">
                        <DropdownMenuItem>
                          <button
                            onClick={() => {
                              setOpenNota(true),
                                setEstudianteSelected(estudiante);
                            }}
                            className="flex items-center"
                          >
                            <PlusCircle size="14px" className="mr-1" />
                            Digitar nota
                          </button>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <button
                            onClick={() => {
                              setOpenAsistencia(true),
                                setEstudianteSelected(estudiante);
                            }}
                            className="flex items-center"
                          >
                            <PlusCircle size="14px" className="mr-1" />
                            Digitar asistencia
                          </button>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <a
                            href={`/panel/grupos/${grupo.id}/estudiantes/${estudiante.id}/asignaturas`}
                            className="inline-flex justify-center items-center gap-1 underline hover:opacity-60"
                          >
                            <ExternalLink
                              size={10}
                              className="top-0.5 relative"
                            />
                            Progreso
                          </a>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>

                {estudiante.grupo.horarios &&
                  estudiante.grupo.horarios.length > 0 &&
                  estudiante.grupo.horarios.map((horario) => (
                    <TableRow key={horario.id}>
                      <TableCell className={`border ${index % 2 === 0 ? 'bg-slate-200' : 'bg-white'}`} colSpan={3}>
                        <div className="mb-6 bg-white rounded-md shadow-md">
                          <div className="p-2 border text-center bg-gray-200">
                            <strong>Asignatura:</strong>{" "}
                            {horario.asignaturaProfesor?.asignatura.nombre} |{" "}
                            <strong>Profesor:</strong>{" "}
                            {horario.asignaturaProfesor.profesor.user.nombres +
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
                                {estudiante.notas.find(
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
                                {estudiante.notas.find(
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
                                {estudiante.notas.find(
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
                                {estudiante.notas.find(
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
                                  estudiante.asistencias.filter(
                                    (asistencia) =>
                                      asistencia.asignaturaProfesorId ===
                                        horario.asignaturaProfesor?.id &&
                                      asistencia.periodo === "1" &&
                                      asistencia.asiste === true
                                  )?.length
                                }{" "}
                                veces | No asistió{" "}
                                {
                                  estudiante.asistencias.filter(
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
                                  estudiante.asistencias.filter(
                                    (asistencia) =>
                                      asistencia.asignaturaProfesorId ===
                                        horario.asignaturaProfesor?.id &&
                                      asistencia.periodo === "2" &&
                                      asistencia.asiste === true
                                  )?.length
                                }{" "}
                                veces | No asistió{" "}
                                {
                                  estudiante.asistencias.filter(
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
                                  estudiante.asistencias.filter(
                                    (asistencia) =>
                                      asistencia.asignaturaProfesorId ===
                                        horario.asignaturaProfesor?.id &&
                                      asistencia.periodo === "3" &&
                                      asistencia.asiste === true
                                  )?.length
                                }{" "}
                                veces | No asistió{" "}
                                {
                                  estudiante.asistencias.filter(
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
                                  estudiante.asistencias.filter(
                                    (asistencia) =>
                                      asistencia.asignaturaProfesorId ===
                                        horario.asignaturaProfesor?.id &&
                                      asistencia.periodo === "4" &&
                                      asistencia.asiste === true
                                  )?.length
                                }{" "}
                                veces | No asistió{" "}
                                {
                                  estudiante.asistencias.filter(
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
              </>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No hay datos para mostrar</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
