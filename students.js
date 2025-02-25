// Event Listeners
viewGradesButton.addEventListener("click", showGrades);
viewScheduleButton.addEventListener("click", showSchedule);


// Referencias a los elementos del DOM
const viewClassesButton = document.getElementById("viewClasses") 
const viewStudentsButton = document.getElementById("viewStudents") 
const teacherOutput = document.getElementById("teacherOutput") 

// Datos simulados
const classes = [
  { className: "Programación Avanzada", schedule: "Lunes 10:00 AM - 12:00 PM" },
  { className: "Algoritmos", schedule: "Miércoles 2:00 PM - 4:00 PM" },
  { className: "Bases de Datos", schedule: "Viernes 8:00 AM - 10:00 AM" },
];

const students = [
  { name: "Juan Pérez", id: "S1234", class: "Programación Avanzada" },
  { name: "María López", id: "S5678", class: "Algoritmos" },
  { name: "Carlos Ramírez", id: "S9101", class: "Bases de Datos" },
];

// Función para mostrar clases
function showClasses(){
  teacherOutput.innerHTML = "<h3>Clases Asignadas:</h3>";
  classes.forEach((item) => {
    teacherOutput.innerHTML += `<p>${item.className} - ${item.schedule}</p>`;
  });
}

// Función para mostrar estudiantes
function showStudents(){
  teacherOutput.innerHTML = "<h3>Estudiantes:</h3>";
  students.forEach((item) => {
    teacherOutput.innerHTML += `<p>${item.name} (${item.id}) - ${item.class}</p>`;
  });
}

// Event Listeners
viewClassesButton.addEventListener("click", showClasses);
viewStudentsButton.addEventListener("click", showStudents);
