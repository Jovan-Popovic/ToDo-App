
let counter = 0;
let task = ``;
let taskInput = document.getElementById("task-input");
let addTaskBtn = document.getElementById("add-task-btn");
let taskList = document.getElementById("task-list");

taskInput.addEventListener("keypress",submitButton);
addTaskBtn.addEventListener("click",addTask);
taskList.addEventListener("click",finishedTasks);

function submitButton(e){
    e.keyCode === 13 ? addTask() : null;
}

function addTask(){
  if(taskInput.value === ""){
    alert("Enter task first")
  }
  else{
    task = document.createElement("li");
    task.innerHTML = `
    ${taskInput.value}
    <input type="checkbox">
    <button type="button" class="close" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>`
    task.id = `task-${counter}`;
    task.className += "list-group-item";
    taskList.appendChild(task);
    task = ``;
    counter++;
  }
}

function finishedTasks(e){
  if(e.target.type === "checkbox"){
    e.target.parentElement.style.textDecoration = e.target.checked
    ? "line-through" : "none";
  }
  else if(e.target.textContent === "&times;"){
    taskList.removeChild(e.target.parentElement);
  }
}