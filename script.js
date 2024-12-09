// DOM Elements
const authContainer = document.getElementById('authContainer');
const loginContainer = document.getElementById('loginContainer');
const signupContainer = document.getElementById('signupContainer');
const todoContainer = document.getElementById('todoContainer');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const welcomeModal = document.getElementById('welcomeModal');
const welcomeMessage = document.getElementById('welcomeMessage');
const closeModal = document.getElementById('closeModal');
const logoutBtn = document.getElementById('logoutBtn');
const userGreeting = document.getElementById('userGreeting');
const taskCount = document.getElementById('taskCount');
const clearCompleted = document.getElementById('clearCompleted');
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');

// UI Navigation
document.getElementById('showLoginBtn').addEventListener('click', () => {
    loginContainer.classList.remove('hidden');
    signupContainer.classList.add('hidden');
});

document.getElementById('showSignupBtn').addEventListener('click', () => {
    loginContainer.classList.add('hidden');
    signupContainer.classList.remove('hidden');
});

document.getElementById('showLoginBtn2').addEventListener('click', () => {
    loginContainer.classList.remove('hidden');
    signupContainer.classList.add('hidden');
});

document.getElementById('showSignupBtn2').addEventListener('click', () => {
    loginContainer.classList.add('hidden');
    signupContainer.classList.remove('hidden');
});

// Get users from localStorage or initialize empty object
let users = JSON.parse(localStorage.getItem('users')) || {};

// Current user
let currentUser = null;

// Global variable to store the index of the todo to be deleted
let todoToDeleteIndex = null;

// Signup Form Handler
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (users[username]) {
        alert('Username already exists!');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Create new user
    users[username] = {
        password: password,
        todos: [],
        lastLogin: null
    };
    localStorage.setItem('users', JSON.stringify(users));
    
    // Switch to login form
    loginContainer.classList.remove('hidden');
    signupContainer.classList.add('hidden');
    signupForm.reset();
    alert('Account created successfully! Please login.');
});

// Login Form Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (users[username] && users[username].password === password) {
        currentUser = username;
        authContainer.classList.add('hidden');
        todoContainer.classList.remove('hidden');
        
        // Check if this is the first login
        const isFirstLogin = !users[username].lastLogin;
        if (isFirstLogin) {
            welcomeMessage.textContent = `Welcome to Modern TODO!`;
            users[username].lastLogin = new Date().toISOString();
            localStorage.setItem('users', JSON.stringify(users));
        } else {
            welcomeMessage.textContent = `Welcome back, ${username}!`;
        }
        
        userGreeting.textContent = `Hello, ${username}`;
        welcomeModal.classList.remove('hidden');
        loadTodos();
        loginForm.reset();
    } else {
        alert('Invalid username or password');
    }
});

// Load todos from localStorage
const loadTodos = () => {
    const userTodos = users[currentUser].todos;
    todoList.innerHTML = '';
    userTodos.forEach((todo, index) => {
        addTodoToList(todo, index);
    });
    updateTaskCount();
};

// Update task count
const updateTaskCount = () => {
    const totalTasks = users[currentUser].todos.length;
    const completedTasks = users[currentUser].todos.filter(todo => todo.completed).length;
    taskCount.textContent = `${completedTasks}/${totalTasks} tasks`;
};

// Add todo to the list
const addTodoToList = (todo, index) => {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between p-4 bg-white/10 rounded-lg group';
    li.innerHTML = `
        <div class="flex items-center gap-3">
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                class="w-5 h-5 rounded border-white/20 bg-white/10 checked:bg-teal-600 checked:border-teal-600" 
                onchange="toggleTodo(${index})">
            <span class="${todo.completed ? 'line-through text-white/50' : 'text-white'}">${todo.text}</span>
        </div>
        <button onclick="deleteTodo(${index})" 
            class="text-white/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <i class="fas fa-trash"></i>
        </button>
    `;
    todoList.appendChild(li);
};

// Add new todo
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        users[currentUser].todos.push({ text, completed: false });
        localStorage.setItem('users', JSON.stringify(users));
        addTodoToList({ text, completed: false }, users[currentUser].todos.length - 1);
        todoInput.value = '';
        updateTaskCount();
    }
});

// Toggle todo completion
window.toggleTodo = (index) => {
    users[currentUser].todos[index].completed = !users[currentUser].todos[index].completed;
    localStorage.setItem('users', JSON.stringify(users));
    loadTodos();
};

// Delete todo (show confirmation modal)
window.deleteTodo = (index) => {
    todoToDeleteIndex = index;
    deleteConfirmModal.classList.remove('hidden');
};

// Cancel delete
cancelDelete.addEventListener('click', () => {
    deleteConfirmModal.classList.add('hidden');
    todoToDeleteIndex = null;
});

// Confirm delete
confirmDelete.addEventListener('click', () => {
    if (todoToDeleteIndex !== null) {
        users[currentUser].todos.splice(todoToDeleteIndex, 1);
        localStorage.setItem('users', JSON.stringify(users));
        loadTodos();
        deleteConfirmModal.classList.add('hidden');
        todoToDeleteIndex = null;
    }
});

// Clear completed todos
clearCompleted.addEventListener('click', () => {
    users[currentUser].todos = users[currentUser].todos.filter(todo => !todo.completed);
    localStorage.setItem('users', JSON.stringify(users));
    loadTodos();
});

// Close welcome modal
closeModal.addEventListener('click', () => {
    welcomeModal.classList.add('hidden');
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    todoContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
    loginContainer.classList.remove('hidden');
    signupContainer.classList.add('hidden');
    loginForm.reset();
});
