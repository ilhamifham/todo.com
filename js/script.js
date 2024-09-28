const input = document.querySelector("input");
const validationText = document.querySelector(".text-danger");
const addTaskButton = document.querySelector(".btn-primary");
const themeButton = document.querySelector(".btn-success");
const ul = document.querySelector("ul");
let taskList = [];

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute(
    "data-bs-theme",
    localStorage.getItem("theme")
  );

  themeButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });

  const taskListItems = JSON.parse(localStorage.getItem("taskList")) || [];
  taskListItems.forEach((taskListItem) => {
    addTasks(taskListItem.title, taskListItem.isChecked);
  });

  addTaskButton.addEventListener("click", (event) => {
    event.preventDefault();

    const taskValue = input.value.trim();
    let errorMessages;

    if (taskValue.length === 0) {
      errorMessages = "A task is required";
      validationText.textContent = errorMessages;
      validationText.classList.remove("d-none");
      input.focus();
    } else if (taskValue.length < 3) {
      errorMessages = "Task word should be more than 3 words";
      validationText.textContent = errorMessages;
      validationText.classList.remove("d-none");
      input.focus();
    } else {
      validationText.textContent = null;
      validationText.classList.add("d-none");
      input.value = "";
      addTasks(taskValue);
      localStorage.setItem("taskList", JSON.stringify(taskList));
    }
  });

  function addTasks(taskValue, checkValue) {
    const task = {
      isChecked: checkValue || false,
      title: taskValue
    }

    const task_li = document.createElement("li");
    task_li.className = "list-group-item d-flex align-items-center pe-2";

    const task_checkbox = document.createElement("input");
    task_checkbox.type = "checkbox";
    task_checkbox.checked = task.isChecked;
    task_checkbox.className = "form-check-input mt-0";
    task_checkbox.addEventListener("change", isChecked);

    function isChecked() {
      task.isChecked = task_checkbox.checked;
      localStorage.removeItem("taskList");
      localStorage.setItem("taskList", JSON.stringify(taskList));
    }

    const task_p = document.createElement("p");
    task_p.className = "mb-0 mx-3 w-100 editable";
    task_p.innerHTML = task.title;

    const task_edit_button = document.createElement("button");
    task_edit_button.className = "btn btn-secondary bg-gradient me-3";
    task_edit_button.innerHTML = '<i class="bi bi-pencil-square"></i>';
    task_edit_button.addEventListener("click", editTask);

    function editTask() {
      if (task_checkbox.checked) {
        return false;
      }
      if (task_p.innerHTML.length === 0) {
        deleteTask();
      } else {
        const isEditable = task_p.isContentEditable;
        task_p.setAttribute("contenteditable", !isEditable);
        task_edit_button.innerHTML = !isEditable
          ? '<i class="bi bi-floppy-fill"></i>'
          : '<i class="bi bi-pencil-square"></i>';
        task_checkbox.disabled = !isEditable;
        if (!isEditable) {
          task_p.focus();
        }
        task.title = task_p.innerText;
        localStorage.removeItem("taskList");
        localStorage.setItem("taskList", JSON.stringify(taskList));
      }
    }

    const task_delete_button = document.createElement("button");
    task_delete_button.className = "btn btn-danger bg-gradient";
    task_delete_button.innerHTML = '<i class="bi bi-x-square-fill"></i>';
    task_delete_button.addEventListener("click", deleteTask);

    function deleteTask() {
      taskList = taskList.filter((taskListItem) => taskListItem.title !== task.title);
      localStorage.setItem("taskList", JSON.stringify(taskList));
      task_li.remove();
    }

    task_li.appendChild(task_checkbox);
    task_li.appendChild(task_p);
    task_li.appendChild(task_edit_button);
    task_li.appendChild(task_delete_button);

    ul.prepend(task_li);
    taskList.push(task);
  }
});
