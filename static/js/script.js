/* Task data */

let tasks = [];

let currentFilter = "all";

let editingTaskId = null;

let deletingTaskId = null;


/* DOM elements */

const taskInput = document.getElementById("task-input");

const taskDate = document.getElementById("task-date");

const taskPriority = document.getElementById("task-priority");

const addTaskButton =
    document.getElementById("add-task-button");

const searchInput =
    document.getElementById("search-input");

const taskList =
    document.getElementById("task-list");

const filterButtons =
    document.querySelectorAll(".filter-button");

const totalCount =
    document.getElementById("total-count");

const pendingCount =
    document.getElementById("pending-count");

const completedCount =
    document.getElementById("completed-count");

const taskSummary =
    document.getElementById("task-summary");


/* Edit modal elements */

const editModal =
    document.getElementById("edit-modal");

const editTaskInput =
    document.getElementById("edit-task-input");

const editTaskDate =
    document.getElementById("edit-task-date");

const editTaskPriority =
    document.getElementById("edit-task-priority");

const saveEditButton =
    document.getElementById("save-edit-button");

const cancelEditButton =
    document.getElementById("cancel-edit-button");

const closeEditButton =
    document.getElementById("close-edit-button");


/* Delete modal elements */

const deleteModal =
    document.getElementById("delete-modal");

const cancelDeleteButton =
    document.getElementById("cancel-delete-button");

const confirmDeleteButton =
    document.getElementById("confirm-delete-button");


/* Add task */

addTaskButton.addEventListener("click", addTask);


function addTask() {

    const title =
        taskInput.value.trim();

    const date =
        taskDate.value;

    const priority =
        taskPriority.value;


    if (title === "") {

        taskInput.focus();

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

    taskInput.focus();

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


    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const filteredTasks =
        tasks.filter(function(task) {

            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(searchText);


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

    const taskItem =
        document.createElement("article");


    taskItem.className =
        "task-item";


    if (task.completed) {

        taskItem.classList.add("completed");

    }


    const formattedDate =
        task.date
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
                type="button"
                aria-label="Edit task">

                ✏️

            </button>


            <button
                class="delete-button"
                type="button"
                aria-label="Delete task">

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

        openEditModal(task.id);

    });


    deleteButton.addEventListener("click", function() {

        openDeleteModal(task.id);

    });


    taskList.appendChild(taskItem);

}


/* Complete task */

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            task.completed =
                !task.completed;

        }

        return task;

    });


    renderTasks();

}


/* Open edit modal */

function openEditModal(id) {

    const task =
        tasks.find(function(task) {

            return task.id === id;

        });


    if (!task) {

        return;

    }


    editingTaskId = id;


    editTaskInput.value =
        task.title;


    editTaskDate.value =
        task.date;


    editTaskPriority.value =
        task.priority;


    editModal.classList.add("show");


    setTimeout(function() {

        editTaskInput.focus();

    }, 50);

}


/* Save edited task */

saveEditButton.addEventListener("click", function() {

    saveEditedTask();

});


function saveEditedTask() {

    const task =
        tasks.find(function(task) {

            return task.id === editingTaskId;

        });


    if (!task) {

        closeEditModal();

        return;

    }


    const newTitle =
        editTaskInput.value.trim();


    if (newTitle === "") {

        editTaskInput.focus();

        return;

    }


    task.title =
        newTitle;


    task.date =
        editTaskDate.value;


    task.priority =
        editTaskPriority.value;


    closeEditModal();


    renderTasks();

}


/* Close edit modal */

function closeEditModal() {

    editModal.classList.remove("show");

    editingTaskId = null;

}


/* Edit modal buttons */

cancelEditButton.addEventListener("click", function() {

    closeEditModal();

});


closeEditButton.addEventListener("click", function() {

    closeEditModal();

});


editModal.addEventListener("click", function(event) {

    if (event.target === editModal) {

        closeEditModal();

    }

});


/* Save edit with Enter */

editTaskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        saveEditedTask();

    }

});


/* Open delete modal */

function openDeleteModal(id) {

    deletingTaskId = id;

    deleteModal.classList.add("show");

}


/* Close delete modal */

function closeDeleteModal() {

    deleteModal.classList.remove("show");

    deletingTaskId = null;

}


/* Confirm delete */

confirmDeleteButton.addEventListener("click", function() {

    if (deletingTaskId === null) {

        return;

    }


    tasks =
        tasks.filter(function(task) {

            return task.id !== deletingTaskId;

        });


    closeDeleteModal();


    renderTasks();

});


/* Cancel delete */

cancelDeleteButton.addEventListener("click", function() {

    closeDeleteModal();

});


deleteModal.addEventListener("click", function(event) {

    if (event.target === deleteModal) {

        closeDeleteModal();

    }

});


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

    const total =
        tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    const pending =
        total - completed;


    totalCount.textContent =
        total;


    pendingCount.textContent =
        pending;


    completedCount.textContent =
        completed;


    if (total === 0) {

        taskSummary.textContent =
            "No tasks yet";

    } else {

        taskSummary.textContent =
            `${pending} pending · ${completed} completed`;

    }

}


/* Security */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


/* Initial display */

renderTasks();