import LoginForm from "@/pages/login/_form";

export default function Login() {
  return (
    <main className="bg-gray-200 flex flex-row items-center justify-center">
      <div className="w-8/12 md:w-5/12 xl:w-4/12 2xl:w-3/12 ">
        <div className="bg-white rounded-md p-4 space-y-4 shadow-md">
          <h1 className="text-center font-medium text-2xl">
            Programas Técnicos y Tecnológicos
          </h1>

          <div className="flex items-center justify-center space-x-4">
            <img
              src="/Logo-UManizales-color.svg"
              alt="Logo Universidad de Manizales"
              width={80}
            />

            <img
              src="/logo-U_en_tu_colegio.png"
              alt="Logo U en tu colegio"
              width={80}
            />
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
