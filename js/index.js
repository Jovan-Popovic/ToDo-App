
let taskInput = document.getElementById("task-input");
let addTaskBtn = document.getElementById("add-task-btn");
let taskList = document.getElementById("task-list");
let counter = 0;
let task = ``;
let taskName = ``;
let checkboxValue = ``;
let taskLenght = ``;

taskInput.addEventListener("keypress",submitButton);
addTaskBtn.addEventListener("click",addTask);
taskList.addEventListener("click",finishedTasks);
document.getElementById("save-changes").addEventListener("click",saveTasks);

function submitButton(e){
    e.keyCode === 13 ? addTask() : null;
}

function addTask(){
  if(taskInput.value === ""){
    alert("Enter task first");
  }
  else{
    task = document.createElement("li");
    task.innerHTML = `
    <span id="task-title-${counter}">${taskInput.value}</span>
    <input id="checkbox-${counter}" type="checkbox">
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

function saveTasks(e){
  e.preventDefault();
  let jsonData = [];
  counter = 0;
  let taskCounter = taskList.children.length;
  for(counter;counter<=taskCounter;counter++){
    if(document.getElementById(`task-${counter}`) !== null){
      taskName = document.getElementById(`task-title-${counter}`).innerText;
      checkboxValue = document.getElementById(`checkbox-${counter}`).checked;
      jsonData.push({title:taskName,done:checkboxValue});
    }
  }
  fetch("https://api.myjson.com/bins",{
    method:"POST",
    headers: {
      "Accept": "application/json, text/plain",
      "Content-Type": "application/json, charset=utf-8"
    },
    body:JSON.stringify(jsonData)
  })
  .then(res => res.json())
  .then((data) => {
    localStorage.setItem("userTasks", data.uri);
  })
}
//load saved tasks
if(localStorage.getItem("userTasks") !== null){
  fetch(`${localStorage.getItem("userTasks")}`)
  .then(res => res.json())
  .then(data => {
    for(counter=0;counter<data.length;counter++){
      taskList.innerHTML += `
      <li id="task-${counter}" class="list-group-item">
        <span id="task-title-${counter}">${data[counter].title}</span>
        <input id="checkbox-${counter}" type="checkbox" ${data[counter].done === true ? "checked" : null}>
        <button type="button" class="close" aria-label="Close">&times;</button>
      </li>`;
    }
  })
}