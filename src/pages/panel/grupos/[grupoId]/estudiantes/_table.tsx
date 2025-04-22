import CustomDialog from "@/components/CustomDialog";
import type { Estudiante, Grupo } from "@/lib/types";
import { fetchGrupoByIdData } from "@/services/grupo.service";
import { useEffect, useState } from "react";
import EstudianteNotaForm from "./_nota-form";
import EstudianteAsistenciaForm from "./_asistencia-form";

import { EstudianteGrupoDataTable } from "./_data-table";

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

  useEffect(() => {
    fetchGrupoById();
  }, [openNota, openAsistencia]);

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
            estudiante={estudianteSelected}
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
            estudiante={estudianteSelected}
            setOpenAsistencia={setOpenAsistencia}
          />
        )}
      </CustomDialog>
      <hr className="mt-6" />
      <EstudianteGrupoDataTable
        estudiantes={grupo?.estudiantes ?? []}
        setOpenNota={setOpenNota}
        setOpenAsistencia={setOpenAsistencia}
        setEstudianteSelected={setEstudianteSelected}
      />
    </div>
  );
}
