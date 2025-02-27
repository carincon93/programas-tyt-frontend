import LoginForm from "@/pages/login/_form";

export default function Login() {
  return (
    <div className="min-h-full bg-gray-200 flex flex-row items-center justify-center">
      <div className="grid grid-cols-3 gap-7 md:w-11/12 xl:w-6/12">
        <div className="bg-white rounded-md p-4 space-y-4 shadow-md">
          <h1 className="text-center font-medium text-2xl">
            Programas Técnicos y Tecnológicos
          </h1>

          <img
            src="/Logo-UManizales-color.svg"
            alt="Logo Universidad de Manizales"
            width={80}
            className="mx-auto"
          />
          <LoginForm />
        </div>
        <div className="col-span-2 px-22 xl:px-35">
          <video
            autoPlay={true}
            loop={true}
            muted={true}
            className="object-cover h-full"
          >
            <source src="/video1.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
