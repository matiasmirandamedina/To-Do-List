let tasks = [];

const input = document.getElementById("taskInput");
const btn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

const allBtn = document.getElementById("allBtn");
const completedBtn = document.getElementById("completedBtn");
const pendingBtn = document.getElementById("pendingBtn");

let filter = "all";

// btn.addEventListener("click", function() {
//     console.log(input.value);
// });

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);

    renderTasks();
}

btn.addEventListener("click", function () {
    const text = input.value.trim();

    if (text === "") return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveAndRenderTasks();

    input.value = "";
});

allBtn.addEventListener("click", function () {
    filter = "all";

    renderTasks();
});

completedBtn.addEventListener("click", function () {
    filter = "completed";

    renderTasks();
});

pendingBtn.addEventListener("click", function () {
    filter = "pending";

    renderTasks();
});


function renderTasks() {
    let filteredTasks = tasks;

    list.innerHTML = "";

    if (filter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    filteredTasks.forEach(function (task) {
        const li = document.createElement("li");
        const p = document.createElement("p");
        const button = document.createElement("button");

        p.textContent = task.text;

        button.textContent = "eliminar";

        li.appendChild(p);
        li.appendChild(button)

        if (task.completed) {
            li.classList.add('lined-through');
        } else {
            li.classList.remove('lined-through');
        }

        p.addEventListener("click", function () {
            changeTask(task.id);
        });

        button.addEventListener("click", function () {
            removeTask(task.id);
        });

        list.appendChild(li);
    });
}

function removeTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveAndRenderTasks();
}

function changeTask(id) {
    const changedTask = tasks.find(task => task.id == id);

    changedTask.completed = !changedTask.completed

    saveAndRenderTasks();
}

function saveAndRenderTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();
}