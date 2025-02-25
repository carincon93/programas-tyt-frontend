const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
let sendForm = document.getElementById('sendForm')



let users = [
  {id:1, name:"rome", role:"student", password:'1234567', email:"aromero@gmail.com"},
  {id:2, name:"Juan", role:"teacher", password:'1234567', email:"juan@gmail.com"},
  {id:3, name:"jorge", role:"teacher", password:'1234567', email:"jorge@gmail.com"}
]

sendForm.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Hola")
    let loginSuccess = false
    const emailInput = (document.getElementById('email')).value;
    const passwordInput = (document.getElementById('password')).value;

    if (!validateEmail(emailInput)) {
        displayError('Please enter a valid email address.');
        return;
    }

    if (!passwordInput) {
        displayError('Password cannot be empty.');
        return;
    }

    try {
      let getUser = users.filter((item)=>(item.password == passwordInput && item.email == emailInput))
      console.log(getUser)
      if (getUser) {
        loginSuccess = true
      } else {
        loginSuccess = false
      }
        if (loginSuccess) {
            localStorage.setItem("id", getUser[0].id);
            localStorage.setItem("name", getUser[0].name);
            localStorage.setItem("role", getUser[0].role);
            window.location.href = './menu.html'
        } else {
            displayError('Invalid email or password.');
        }
    } catch (error) {
        displayError('An error occurred. Please try again later.');
    }
});

function validateEmail(email){   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function displayError(message){
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}


// Obtén referencias a los elementos del DOM
const menuLinks = document.querySelectorAll(".menu a");
const iframe = document.querySelector(".web-page");
const welcomeMessage = document.querySelector(".content h2");

// Define las acciones para cada enlace
const actions = {
  Estudiante: "cargar_estudiante.html",
  Profesor: "cargar_profesor.html",
  Horarios: "cargar_horarios.html",
  Colegios: "cargar_colegios.html",
  Tablero: "cargar_tablero.html",
  Salir: "logout",
};

// Añade un evento de clic a cada enlace del menú
menuLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const text = (event.target).textContent || "";

    if (text === "Salir") {
      // Lógica para salir
      salir();
    } else {
      // Cambiar contenido del iframe y mensaje de bienvenida
      cargarVista(text);
    }
  });
});



