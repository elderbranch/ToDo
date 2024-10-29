const list = document.querySelector("#list");
const list2 = document.querySelector('#list2');
const modalButton = document.querySelector("#modalButton");
const modal = document.querySelector("#modal");
const closeModal = document.querySelector("#close-modal");
const overlay = document.querySelector("#overlay");
const taskNameInput = document.getElementById('task-name');
const taskDifficultyInput = document.getElementById('todo__difficulty');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

modalButton.addEventListener("click", openModal);
closeModal.addEventListener("click", closeModalWindow);
overlay.addEventListener("click", closeModalWindow);
document.querySelector('.add-task').addEventListener('click', addTask);
document.addEventListener('keydown', handleKeyDown);

function openModal() {
  modal.style.display = 'block';
  overlay.classList.add("show");
}

function closeModalWindow() {
  modal.style.display = 'none';
  overlay.classList.remove("show");
  clearModalFields();
}

function handleKeyDown(event) {
  if (modal.style.display === 'block' && event.key === 'Enter') {
    event.preventDefault();
    document.querySelector('.add-task').click();
  }
}

function addTask() {
  const taskName = taskNameInput.value.trim();
  const taskDifficulty = taskDifficultyInput.value;
  
  if (taskName) {
    const uniqueID =`id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;;
    const taskElement = createTaskElement(taskName, taskDifficulty, uniqueID, false);
    
    list.appendChild(taskElement);
    closeModalWindow();
    
    tasks.push({ name: taskName, difficulty: taskDifficulty, id: uniqueID, completed: false });
    saveTasks();
  }
}

function createTaskElement(name, difficulty, id, completed) {
  const task = document.createElement('li');
  task.className = 'task_list-elem';
  task.dataset.completed = completed;
  task.dataset.id = id;

  const infoContainer = document.createElement('div');
  infoContainer.className = "elem-info";
  
  const nameElement = createElementWithText('div', 'elem-title', name);
  const difficultyElement = createElementWithText('div', 'elem-layer', difficulty);
  difficultyElement.style.color = getColorByDifficulty(difficulty);
  
  const btnContainer = document.createElement('div');
  btnContainer.classList = 'elem_btn-cont';
  
  const completeButton = createButton('icons/didTask.svg', 'complete', () => completeTask(id, task));
  const deleteButton = createButton('icons/trash.svg', 'delete', () => deleteTask(id, task));
  
  infoContainer.append(nameElement, difficultyElement);
  btnContainer.append(completeButton, deleteButton);
  task.append(infoContainer, btnContainer);
  
  return task;
}

function createButton(iconSrc, className, onClick) {
  const button = document.createElement('button');
  button.innerHTML = `<img src="${iconSrc}" alt="">`;
  button.className = className;
  button.addEventListener('click', onClick);
  return button;
}

function completeTask(id, taskElement) {
  taskElement.dataset.completed = true;
  list2.appendChild(taskElement);

  const taskIndex = tasks.findIndex(item => item.id === id);
  if (taskIndex > -1) tasks[taskIndex].completed = true;
  
  saveTasks();
}

f
function deleteTask(id, taskElement) {
  taskElement.remove();
  tasks = tasks.filter(item => item.id !== id);
  saveTasks();
}

function getColorByDifficulty(difficulty) {
  const colors = {
    'Легко': '#0dff00',
    'Нормально': '#e18e18',
    'Сложно': 'red'
  };

  return colors[difficulty] || 'black';
}


function clearModalFields() {
  taskNameInput.value = '';
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  tasks.forEach(task => {
    const taskElement = createTaskElement(task.name, task.difficulty, task.id, task.completed);
    (task.completed ? list2 : list).appendChild(taskElement);
  });
}

loadTasks();