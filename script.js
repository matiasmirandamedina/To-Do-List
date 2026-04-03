// =========================
// ESTADO GLOBAL
// =========================

// Array donde se guardan todas las tareas
let tasks = [];

// Filtro actual (all | completed | pending)
let filter = "all";


// =========================
// SELECTORES DEL DOM
// =========================

// Input donde escribís la tarea
const input = document.getElementById("taskInput");

// Botón para agregar tarea
const btn = document.getElementById("addBtn");

// Lista (ul) donde se renderizan las tareas
const list = document.getElementById("taskList");

// Botones de filtrado
const allBtn = document.getElementById("allBtn");
const completedBtn = document.getElementById("completedBtn");
const pendingBtn = document.getElementById("pendingBtn");


// =========================
// CARGA INICIAL (localStorage)
// =========================

// Intenta recuperar tareas guardadas
const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    // Convierte de JSON a array real
    tasks = JSON.parse(savedTasks);

    // Renderiza tareas al cargar la página
    renderTasks();
}


// =========================
// EVENTOS
// =========================

// Enter en el input crea tarea
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter")
        createAndSaveTasks();
});

// Click en botón agregar
btn.addEventListener("click", function () {
    createAndSaveTasks();
});

// Filtro: mostrar todas
allBtn.addEventListener("click", function () {
    filter = "all";
    renderTasks();
});

// Filtro: completadas
completedBtn.addEventListener("click", function () {
    filter = "completed";
    renderTasks();
});

// Filtro: pendientes
pendingBtn.addEventListener("click", function () {
    filter = "pending";
    renderTasks();
});


// =========================
// RENDERIZADO
// =========================

function renderTasks() {

    // Copia base de tareas (se va a filtrar después)
    let filteredTasks = tasks;

    // Limpia la lista antes de volver a renderizar
    list.innerHTML = "";

    // Si no hay tareas, muestra mensaje
    if (filteredTasks.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No hay tareas";
        list.appendChild(li);
        return;
    }

    // Aplica filtro según estado
    if (filter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    // Recorre tareas y crea DOM
    filteredTasks.forEach(function (task) {

        // Elementos base
        const li = document.createElement("li");
        const p = document.createElement("p");
        const button = document.createElement("button");
        const container = document.createElement("div");

        // Texto de la tarea
        p.textContent = task.text;

        // Clases CSS
        p.classList.add('adjustMargin');
        button.classList.add('button');
        container.classList.add("display");

        // Texto del botón
        button.textContent = "eliminar";

        // Estructura:
        // li
        //  └─ div (flex)
        //      ├─ p
        //      └─ button
        container.appendChild(p);
        container.appendChild(button);
        li.appendChild(container);

        // Si está completada → tachado
        if (task.completed) {
            p.classList.add('lined-through');
        } else {
            p.classList.remove('lined-through');
        }

        // Click simple → cambiar estado (completado / pendiente)
        p.addEventListener("click", function () {
            changeTask(task.id);
        });

        // Doble click → editar tarea
        p.addEventListener("dblclick", function () {
            editTask(task.id)
        });

        // Botón eliminar
        button.addEventListener("click", function () {
            removeTask(task.id);
        });

        // Agrega al DOM
        list.appendChild(li);
    });
}


// =========================
// ACCIONES SOBRE TAREAS
// =========================

// Elimina tarea por id
function removeTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRenderTasks();
}


// Cambia estado completed
function changeTask(id) {
    const changedTask = tasks.find(task => task.id == id);

    // Si no existe, corta ejecución
    if (!changedTask) return;

    // Toggle (true/false)
    changedTask.completed = !changedTask.completed;

    saveAndRenderTasks();
}


// Edita texto de tarea
function editTask(id) {

    // Pide nuevo texto
    const edit = prompt("Edita tu tarea.");

    // Si cancela → salir
    if (!edit) return;

    // edit es string (prompt), input es DOM → usar edit.trim()
    const newTask = edit.trim();

    if (!newTask) return;

    let changedTask = tasks.find(t => t.id == id);

    if (!changedTask) return;

    // Actualiza texto
    changedTask.text = newTask;

    saveAndRenderTasks();
}


// =========================
// PERSISTENCIA + RENDER
// =========================

// Guarda en localStorage y re-renderiza
function saveAndRenderTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}


// =========================
// CREAR TAREA
// =========================

function createAndSaveTasks() {

    // Toma valor del input
    const text = input.value.trim();

    // Evita tareas vacías
    if (text === "") return;

    // Nueva tarea
    const newTask = {
        id: Date.now(), // id único simple
        text: text,
        completed: false
    };

    // Agrega al array
    tasks.push(newTask);

    // Guarda y renderiza
    saveAndRenderTasks();

    // Limpia input
    input.value = "";
}