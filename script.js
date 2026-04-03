let tasks = [];

const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");

// button.addEventListener("click", function() {
//     console.log(input.value);
// });

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);

    renderTasks();
}

button.addEventListener("click", function () {
    const text = input.value.trim();
    
    if (text === "") return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();

    input.value = "";
});


function renderTasks() {
    list.innerHTML = "";

    tasks.forEach(function (task) {
        const li = document.createElement("li"); 

        li.textContent = task.text;

        if (task.completed)
            li.classList.add('lined-through');
        else
            li.classList.remove('lined-through');

        li.addEventListener("click", function () {
            changeTask(task.id);
        });

        list.appendChild(li);
    });
}

function removeTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();
}

function changeTask(id) {
    var changedTask = tasks.find(task => task.id == id);

    changedTask.completed = !changedTask.completed

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();
}