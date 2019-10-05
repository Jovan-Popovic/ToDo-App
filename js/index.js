
let taskInput = document.getElementById("task-input");
let addTaskBtn = document.getElementById("add-task-btn");
let taskList = document.getElementById("task-list");
let counter = 0;
let task = ``;
let taskCounter = 0;
let taskName = ``;
let checkboxValue = ``;
let jsonData = [];

taskInput.addEventListener("keypress",submitButton);
addTaskBtn.addEventListener("click",addTask);
taskList.addEventListener("click",finishedTasks);
document.getElementById("save-changes").addEventListener("click",saveTasks);

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
    <input id=checkbox-${counter} type="checkbox">
    <button type="button" class="close" aria-label="Close">&times;</button>`;
    task.id = `task-${counter}`;
    task.className += "list-group-item";
    taskList.appendChild(task);
    counter++;
  }
}

function finishedTasks(e){
  if(e.target.type === "checkbox"){
    e.target.parentElement.style.textDecoration = e.target.checked
    ? "line-through" : "none";
  }
  else if(e.target.tagName === "BUTTON"){
    taskList.removeChild(e.target.parentElement);
  }
}

function saveTasks(){
  counter = 0;
  taskCounter = taskList.children.length;
  for(counter;counter<taskCounter;counter++){
    taskName = document.getElementById(`task-${counter}`).innerText;
    checkboxValue = document.getElementById(`checkbox-${counter}`).value;
    jsonData += `
    {
      "title" = "${taskName}",
      "done" = ${checkboxValue},
    }`;
  }
  console.log(jsonData);
  jsonData = [];
  JSON.stringify(jsonData);;
  
}