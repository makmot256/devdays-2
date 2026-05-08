const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

// Load todos from localStorage
function loadTodos() {
  const savedTodos = localStorage.getItem("todos");
  return savedTodos ? JSON.parse(savedTodos) : [];
}

// Save todos to localStorage
function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Render all todos
function renderTodos() {
  todoList.innerHTML = "";
  const todos = loadTodos();

  if (todos.length === 0) {
    todoList.innerHTML =
      '<div class="empty-state">No todos yet. Add one to get started!</div>';
    return;
  }

  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;
    li.innerHTML = `
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? "checked" : ""}
                data-index="${index}"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;
    todoList.appendChild(li);
  });

  // Add event listeners to checkboxes and delete buttons
  document.querySelectorAll(".todo-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", toggleTodo);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", deleteTodo);
  });
}

// Add a new todo
function addTodo() {
  const text = todoInput.value.trim();

  if (text === "") {
    alert("Please enter a todo!");
    return;
  }

  const todos = loadTodos();
  todos.push({ text, completed: false });
  saveTodos(todos);
  renderTodos();
  todoInput.value = "";
  todoInput.focus();
}

// Toggle todo completion
function toggleTodo(e) {
  const index = e.target.dataset.index;
  const todos = loadTodos();
  todos[index].completed = !todos[index].completed;
  saveTodos(todos);
  renderTodos();
}

// Delete a todo
function deleteTodo(e) {
  const index = e.target.dataset.index;
  const todos = loadTodos();
  todos.splice(index, 1);
  saveTodos(todos);
  renderTodos();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Event listeners
addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

// Initial render
renderTodos();
