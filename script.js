document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("task-list");
    const taskNameInput = document.getElementById("task-name");
    const taskDueDateInput = document.getElementById("task-due-date");
    const taskImportanceInput = document.getElementById("task-importance");
    const addTaskButton = document.getElementById("add-task");
    const clearAllButton = document.getElementById("clear-all-tasks");
    const themeSelector = document.getElementById("theme-selector");
    const clockContainer = document.getElementById("live-clock");
    const clockTime = document.getElementById("clock-time");
    const timezoneSelector = document.getElementById("timezone-selector");
    let tasks = [];

    // Function to update the live clock based on selected timezone
    function updateClock() {
        const selectedTimezone = timezoneSelector.value;
        const now = new Date().toLocaleString("en-US", { timeZone: selectedTimezone });
        const [date, time] = now.split(', ');
        clockTime.textContent = time; // Display time in digital format
    }

    // Set initial clock update interval
    setInterval(updateClock, 1000);

    // Show the clock only when scrolling up
    let lastScrollPosition = window.scrollY;
    window.addEventListener('scroll', function () {
        if (window.scrollY < lastScrollPosition) {
            clockContainer.style.display = 'block'; // Show the clock
        } else {
            clockContainer.style.display = 'none'; // Hide the clock when scrolling down
        }
        lastScrollPosition = window.scrollY;
    });

    // Handle theme selection
    themeSelector.addEventListener('change', function () {
        const selectedTheme = themeSelector.value;
        document.body.className = selectedTheme;
    });

    // Add a new task
    addTaskButton.addEventListener("click", function () {
        const name = taskNameInput.value.trim();
        const dueDate = taskDueDateInput.value;
        const importance = taskImportanceInput.value;

        if (name && dueDate) {
            if (new Date(dueDate) < new Date()) {
                alert("The due date cannot be in the past!");
                return;
            }
            if (new Date(dueDate) > new Date().setFullYear(new Date().getFullYear() + 2)) {
                alert("The due date cannot be more than two years in the future!");
                return;
            }
            createTask(name, dueDate, importance);
            taskNameInput.value = "";
            taskDueDateInput.value = "";
        }
    });

    // Create a task and append it to the list
    function createTask(name, dueDate, importance) {
        const task = {
            id: Date.now(),
            name,
            dueDate,
            importance,
            completed: false
        };
        tasks.push(task);
        renderTasks();
    }

    // Render tasks in the table
    function renderTasks() {
        taskList.innerHTML = "";
        tasks.sort((a, b) => {
            if (a.importance === b.importance) {
                return new Date(a.dueDate) - new Date(b.dueDate); // Order by due date if importance is the same
            }
            const importanceOrder = { low: 3, medium: 2, high: 1 };
            return importanceOrder[a.importance] - importanceOrder[b.importance]; // Order by importance
        });

        tasks.forEach(task => {
            const taskRow = document.createElement("tr");
            taskRow.classList.toggle("completed", task.completed);

            taskRow.innerHTML = `
                <td><input type="checkbox" class="task-completed" data-id="${task.id}" ${task.completed ? 'checked' : ''}></td>
                <td contenteditable="true" class="task-name" data-id="${task.id}">${task.name}</td>
                <td contenteditable="true" class="task-due-date" data-id="${task.id}">${task.dueDate}</td>
                <td contenteditable="true" class="task-importance" data-id="${task.id}">${task.importance}</td>
                <td><button class="delete-task" data-id="${task.id}">Delete</button></td>
            `;

            // Add event listeners for editing task
            taskRow.querySelector('.task-name').addEventListener('blur', editTask);
            taskRow.querySelector('.task-due-date').addEventListener('blur', editTask);
            taskRow.querySelector('.task-importance').addEventListener('blur', editTask);
            taskRow.querySelector('.task-completed').addEventListener('change', toggleCompletion);
            taskRow.querySelector('.delete-task').addEventListener('click', deleteTask);

            taskList.appendChild(taskRow);
        });
    }

    // Edit task details (name, due date, importance)
    function editTask(event) {
        const id = event.target.dataset.id;
        const task = tasks.find(task => task.id == id);
        if (!task) return;

        if (event.target.classList.contains('task-name')) {
            task.name = event.target.textContent.trim();
        } else if (event.target.classList.contains('task-due-date')) {
            task.dueDate = event.target.textContent.trim();
        } else if (event.target.classList.contains('task-importance')) {
            task.importance = event.target.textContent.trim();
        }

        renderTasks();
    }

    // Toggle task completion
    function toggleCompletion(event) {
        const id = event.target.dataset.id;
        const task = tasks.find(task => task.id == id);
        if (task) {
            task.completed = event.target.checked;
            renderTasks();
        }
    }

    // Delete a task
    function deleteTask(event) {
        const id = event.target.dataset.id;
        tasks = tasks.filter(task => task.id != id);
        renderTasks();
    }

    // Clear all tasks
    clearAllButton.addEventListener('click', function () {
        tasks = [];
        renderTasks();
    });

    // Initial render
    renderTasks();
});
