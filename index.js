const list = document.querySelector("#list");
const list2 = document.querySelector('#list2');
const modalButton = document.querySelector("#modalButton");
const modal = document.querySelector("#modal");
const closeModal = document.querySelector("#close-modal");
const overlay = document.querySelector("#overlay");

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
console.log(tasks)


modalButton.addEventListener("click", () => {
  modal.style.display = 'block';
  overlay.classList.add("show");
});

closeModal.addEventListener("click", () => {
  modal.style.display = 'none';
  overlay.classList.remove("show");
  clearModalFields();
});

overlay.addEventListener("click", () => {
  modal.style.display = 'none';
  overlay.classList.remove("show");
  clearModalFields();
});

document.querySelector('.add-task').addEventListener('click', addTask);

function addTask() {
  const taskName = document.getElementById('task-name').value;
  const taskDifficulty = document.getElementById('todo__difficulty').value;
  const uniqueID = `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const completed = false;

  if (taskName.trim()) {
    const taskElement = createTaskElement(taskName, taskDifficulty, uniqueID, completed);
    list.appendChild(taskElement);
    modal.style.display = 'none';
    overlay.classList.remove("show");
    clearModalFields();

    tasks.push({ name: taskName, difficulty: taskDifficulty, id: uniqueID, completed: completed });
    save();
  }
}

function createTaskElement(name, difficulty, id, completed) {
  const task = document.createElement('li');
  task.className = 'task_list-elem';

  task.dataset.completed = completed;
  task.dataset.id = id;

  const infoContainer = document.createElement('div');
  infoContainer.className = "elem-info";

  const nameElement = document.createElement('div');
  nameElement.classList = "elem-title";
  nameElement.textContent = name;

  const difficultyElement = document.createElement('div');
  difficultyElement.className = "elem-layer";
  difficultyElement.textContent = difficulty;
  difficultyElement.style.color = getColorByDifficulty(difficulty);

  const btnContainer = document.createElement('div');
  btnContainer.classList = 'elem_btn-cont';

  const completeButton = document.createElement('button');
  completeButton.innerHTML = '<img src="icons/didTask.svg" alt="">';
  completeButton.className = 'complete';
  completeButton.addEventListener('click', () => {
    task.dataset.completed = true;
    list2.appendChild(task);

    const taskIndex = tasks.findIndex(item => item.id === id);
    if (taskIndex > -1) tasks[taskIndex].completed = true;
    save();
  });

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = '<img src="icons/trash.svg" alt="">';
  deleteButton.className = 'delete';
  deleteButton.addEventListener('click', () => {
    task.remove();
    
    tasks = tasks.filter(item => item.id !== id);
    save();
  });

  infoContainer.append(nameElement, difficultyElement);
  btnContainer.append(completeButton, deleteButton);
  task.append(infoContainer, btnContainer);

  return task;
}

function getColorByDifficulty(difficulty) {
  switch (difficulty) {
    case 'Легко':
      return '#0dff00';
    case 'Нормально':
      return '#e18e18';
    case 'Сложно':
      return 'red';
    default:
      return 'black';
  }
}

const clearModalFields = () => {
  document.getElementById('task-name').value = '';
};

document.addEventListener('keydown', (event) => {
  if (modal.style.display === 'block' && event.key === 'Enter') {
    event.preventDefault();
    document.querySelector('.add-task').click();
  }
});

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  tasks.forEach(task => {
    const taskElement = createTaskElement(task.name, task.difficulty, task.id, task.completed);
    if (task.completed) {
      list2.appendChild(taskElement);
    } else {
      list.appendChild(taskElement);
    }
  });
}

loadTasks();
