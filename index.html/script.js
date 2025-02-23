document.addEventListener("DOMContentLoaded", function () {
    let currentYear = new Date().getFullYear();
    let selectedDay = null;
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};

    const currentYearElement = document.getElementById("currentYear");
    const calendarElement = document.getElementById("calendar");
    const modal = document.getElementById("taskModal");
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const closeModal = document.querySelector(".close");

    currentYearElement.textContent = currentYear;

    // 🗓️ Change Year
    document.getElementById("prevYear").addEventListener("click", () => {
        currentYear--;
        renderCalendar();
    });

    document.getElementById("nextYear").addEventListener("click", () => {
        currentYear++;
        renderCalendar();
    });

    // 📅 Render Calendar
    function renderCalendar() {
        currentYearElement.textContent = currentYear;
        calendarElement.innerHTML = "";

        for (let month = 0; month < 12; month++) {
            const monthDiv = document.createElement("div");
            monthDiv.className = "month";
            monthDiv.innerHTML = `<h3>${new Date(currentYear, month).toLocaleString('default', { month: 'long' })}</h3>`;

            const daysDiv = document.createElement("div");
            daysDiv.className = "days";

            let daysInMonth = new Date(currentYear, month + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayDiv = document.createElement("div");
                dayDiv.className = "day";
                dayDiv.textContent = day;
                dayDiv.dataset.date = `${currentYear}-${month + 1}-${day}`;
                dayDiv.addEventListener("click", () => openTaskModal(dayDiv.dataset.date));

                if (tasks[dayDiv.dataset.date]) {
                    const completedTasks = tasks[dayDiv.dataset.date].filter(task => task.completed).length;
                    if (completedTasks > 0) {
                        dayDiv.classList.add("completed");
                    }
                    dayDiv.title = `Tasks: ${tasks[dayDiv.dataset.date].length}, Completed: ${completedTasks}`;
                }

                daysDiv.appendChild(dayDiv);
            }
            monthDiv.appendChild(daysDiv);
            calendarElement.appendChild(monthDiv);
        }
    }

    // 🎯 Open Task Modal
    function openTaskModal(date) {
        selectedDay = date;
        renderTasks();
        modal.style.display = "block";
    }

    function showSection(sectionId) {
        // Hide all sections first
        document.querySelectorAll(".section").forEach((section) => {
            section.style.display = "none";
            section.classList.remove("fullscreen");
        });
    
        // Show the selected section
        let section = document.getElementById(sectionId);
        if (section) {
            section.style.display = "block";
            section.classList.add("fullscreen");
    
            // Remove any existing back buttons
            let existingBackButton = section.querySelector(".back-button");
            if (existingBackButton) {
                existingBackButton.remove();
            }
    
            // Create and add a back button
            let backButton = document.createElement("button");
            backButton.innerText = "← Back";
            backButton.classList.add("back-button");
            backButton.onclick = function () {
                section.style.display = "none"; // Hide section on back button click
            };
    
            section.prepend(backButton);
        }
    }
    

    // ❌ Close Modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // ✅ Add Task
    addTaskButton.addEventListener("click", () => {
        const task = taskInput.value.trim();
        if (task && selectedDay) {
            if (!tasks[selectedDay]) tasks[selectedDay] = [];
            tasks[selectedDay].push({ task, completed: false });
            taskInput.value = "";
            saveTasks();
            renderTasks();
            renderCalendar();
            alert("Task Successfully Assigned!");
        }
    });

    // 📝 Render Tasks in Modal
    function renderTasks() {
        taskList.innerHTML = "";
        if (tasks[selectedDay]) {
            tasks[selectedDay].forEach((taskObj, index) => {
                const li = document.createElement("li");
                li.textContent = taskObj.task;

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = taskObj.completed;
                checkbox.addEventListener("change", () => {
                    taskObj.completed = checkbox.checked;
                    saveTasks();
                    renderCalendar();
                    renderTasks();
                });

                li.prepend(checkbox);
                if (taskObj.completed) li.style.textDecoration = "line-through";

                taskList.appendChild(li);
            });
        }
    }

    // 💾 Save Tasks to Local Storage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // 📌 Hamburger Menu
    document.querySelector(".hamburger").addEventListener("click", function () {
        document.getElementById("menuContent").classList.toggle("show");
    });

    // 🎭 Show Sections with Back Button
    window.showSection = function (sectionId) {
        document.querySelectorAll(".section").forEach((section) => {
            section.style.display = "none";
        });

        let section = document.getElementById(sectionId);
        if (section) {
            section.style.display = "block";
            section.classList.add("fullscreen");

            let backButton = document.createElement("button");
            backButton.innerText = "← Back";
            backButton.classList.add("back-button");
            backButton.onclick = function () {
                section.style.display = "none";
                section.classList.remove("fullscreen");
            };

            // Prevent multiple back buttons from appearing
            if (!section.querySelector(".back-button")) {
                section.prepend(backButton);
            }
        }
    };

    // ✅ Task Checkbox Logic in Day Planner
    document.querySelectorAll(".daily-task").forEach((task) => {
        task.addEventListener("change", function () {
            if (this.checked) {
                this.parentElement.style.textDecoration = "line-through";
            } else {
                this.parentElement.style.textDecoration = "none";
            }
        });
    });

    // 🔄 Initial Render
    renderCalendar();
});
