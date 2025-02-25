document.addEventListener("DOMContentLoaded", () => {
  // Referencias al DOM
  const titleUser = document.getElementById("nameUserSession");
  const contentSections = document.querySelectorAll(".content-section");
  const menuButtons = document.querySelectorAll(".menu-btn");
  const contentHorarios = document.getElementById("contentHorarios");
  const studentOutput = document.getElementById("studentOutput");
  const exitSession = document.getElementById("exitSession");

  // Simulación de datos
  const grades = [
      { subject: "Matemáticas", grade: "4.5" },
      { subject: "Programación", grade: "4.8" },
      { subject: "Bases de Datos", grade: "4.3" },
  ];

  const schedule = [
      { day: "Lunes", time: "8:00 AM - 10:00 AM", subject: "Matemáticas" },
      { day: "Martes", time: "10:00 AM - 12:00 PM", subject: "Programación" },
      { day: "Miércoles", time: "2:00 PM - 4:00 PM", subject: "Bases de Datos" },
  ];

  const schools = [
      { name: "Colegio Nacional", location: "Manizales", students: 500 },
      { name: "Instituto Técnico", location: "Villamaría", students: 350 },
      { name: "Liceo Moderno", location: "Chinchiná", students: 400 },
  ];

  const professors = [
      { name: "Juan Pérez", subject: "Matemáticas" },
      { name: "María Rodríguez", subject: "Programación" },
      { name: "Carlos Gómez", subject: "Bases de Datos" },
  ];

  // Mostrar nombre del usuario
  if (localStorage.getItem("name")) {
      titleUser.textContent = `Bienvenido ${localStorage.getItem("name")}`;
  }

  // Ocultar botones según el rol
  const userRole = localStorage.getItem("role");
  if (userRole === "student") document.getElementById("btnColegios").style.display = "none";
  if (userRole === "teacher") document.getElementById("btnTablero").style.display = "none";

  // Función para cambiar de sección
  function showSection(targetId) {
      contentSections.forEach(section => section.classList.remove("active"));
      document.getElementById(targetId).classList.add("active");
  }

  // Función para mostrar horarios
  function showSchedule() {
      contentHorarios.innerHTML = "<h3>Horarios:</h3>";
      schedule.forEach(item => {
          contentHorarios.innerHTML += `<p>${item.day}, ${item.time}: ${item.subject}</p>`;
      });
  }

  // Función para mostrar notas
  function showGrades() {
      studentOutput.innerHTML = "<h3>Notas:</h3>";
      grades.forEach(item => {
          studentOutput.innerHTML += `<p>${item.subject}: ${item.grade}</p>`;
      });
  }

  // Función para mostrar colegios
  function showSchools() {
      studentOutput.innerHTML = "<h3>Colegios:</h3>";
      schools.forEach(item => {
          studentOutput.innerHTML += `<p><strong>${item.name}</strong> - ${item.location} (${item.students} estudiantes)</p>`;
      });
  }

  // Función para mostrar profesores
  function showProfessors() {
      studentOutput.innerHTML = "<h3>Profesores:</h3>";
      professors.forEach(item => {
          studentOutput.innerHTML += `<p><strong>${item.name}</strong> - Materia: ${item.subject}</p>`;
      });
  }

  // Evento para manejar clics en el menú
  menuButtons.forEach(button => {
      button.addEventListener("click", () => {
          const targetId = button.getAttribute("data-target");
          showSection(targetId);

          // Lógica para mostrar datos específicos según la sección
          if (targetId === "content1") showSchools();
          if (targetId === "content2") showSchedule();
          if (targetId === "content3") showGrades();
          if (targetId === "content4") showProfessors();
      });
  });

  // Evento de cierre de sesión
  exitSession.addEventListener("click", () => {
      if (confirm("¿Seguro que deseas salir?")) {
          localStorage.clear();
          window.location.href = "index.html";
      }
  });
});
