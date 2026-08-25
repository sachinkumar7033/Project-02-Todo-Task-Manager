/* Task data */

let tasks = [];

let currentFilter = "all";


/* DOM elements */

const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskPriority = document.getElementById("task-priority");

const addTaskButton = document.getElementById("add-task-button");

const searchInput = document.getElementById("search-input");

const taskList = document.getElementById("task-list");

const filterButtons = document.querySelectorAll(".filter-button");

const totalCount = document.getElementById("total-count");
const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");


/* Add task */

addTaskButton.addEventListener("click", addTask);


function addTask() {

    const title = taskInput.value.trim();

    const date = taskDate.value;

    const priority = taskPriority.value;


    if (title === "") {

        alert("Please enter a task.");

        return;
    }


    const task = {

        id: Date.now(),

        title: title,

        date: date,

        priority: priority,

        completed: false

    };


    tasks.push(task);


    taskInput.value = "";

    taskDate.value = "";

    taskPriority.value = "medium";


    renderTasks();

}


/* Enter key */

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


/* Display tasks */

function renderTasks() {

    taskList.innerHTML = "";


    const searchText = searchInput.value
        .trim()
        .toLowerCase();


    let filteredTasks = tasks.filter(function(task) {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);


        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "pending" && !task.completed) ||
            (currentFilter === "completed" && task.completed);


        return matchesSearch && matchesFilter;

    });


    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-message">
                No tasks found.
            </div>
        `;

    }


    filteredTasks.forEach(function(task) {

        createTaskElement(task);

    });


    updateCounter();

}


/* Create task element */

function createTaskElement(task) {

    const taskItem = document.createElement("article");

    taskItem.className = "task-item";


    if (task.completed) {

        taskItem.classList.add("completed");

    }


    const formattedDate = task.date
        ? `Due: ${task.date}`
        : "No due date";


    taskItem.innerHTML = `

        <div class="task-left">

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <div class="task-content">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-date">
                    ${formattedDate}
                </div>

            </div>

        </div>


        <span class="task-priority priority-${task.priority}">
            ${task.priority}
        </span>


        <div class="task-actions">

            <button
                class="edit-button"
                type="button">
                ✏️
            </button>

            <button
                class="delete-button"
                type="button">
                🗑️
            </button>

        </div>

    `;


    const checkbox =
        taskItem.querySelector(".task-checkbox");


    const editButton =
        taskItem.querySelector(".edit-button");


    const deleteButton =
        taskItem.querySelector(".delete-button");


    checkbox.addEventListener("change", function() {

        toggleTask(task.id);

    });


    editButton.addEventListener("click", function() {

        editTask(task.id);

    });


    deleteButton.addEventListener("click", function() {

        deleteTask(task.id);

    });


    taskList.appendChild(taskItem);

}


/* Complete task */

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            task.completed = !task.completed;

        }

        return task;

    });


    renderTasks();

}


/* Delete task */

function deleteTask(id) {

    const confirmed =
        confirm("Are you sure you want to delete this task?");


    if (!confirmed) {

        return;

    }


    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    renderTasks();

}


/* Edit task */

function editTask(id) {

    const task = tasks.find(function(task) {

        return task.id === id;

    });


    if (!task) {

        return;

    }


    const newTitle =
        prompt("Edit task:", task.title);


    if (newTitle === null) {

        return;

    }


    const updatedTitle = newTitle.trim();


    if (updatedTitle === "") {

        alert("Task cannot be empty.");

        return;

    }


    task.title = updatedTitle;


    renderTasks();

}


/* Search */

searchInput.addEventListener("input", function() {

    renderTasks();

});


/* Filters */

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        filterButtons.forEach(function(item) {

            item.classList.remove("active");

        });


        button.classList.add("active");


        currentFilter =
            button.dataset.filter;


        renderTasks();

    });

});


/* Counter */

function updateCounter() {

    const total = tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    const pending =
        total - completed;


    totalCount.textContent = total;

    pendingCount.textContent = pending;

    completedCount.textContent = completed;

}


/* Security */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* Initial display */

renderTasks();