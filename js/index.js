
let taskInput = document.getElementById("task-input");
let addTaskBtn = document.getElementById("add-task-btn");
let taskList = document.getElementById("task-list");
let saveChanges = document.getElementById("save-changes");
let clearFinished = document.getElementById("clear-completed");
let clearAll = document.getElementById("clear-all");
let counter = 0;
let task = ``;
let taskName = ``;
let checkboxValue = ``;
let taskLenght = ``;

taskInput.addEventListener("keypress",submitButton);
addTaskBtn.addEventListener("click",addTask);
taskList.addEventListener("click",taskInteraction);
saveChanges.addEventListener("click",saveTasks);
clearFinished.addEventListener("click",clearFinishedTasks);
clearAll.addEventListener("click",clearAllTasks);

function submitButton(e){
  e.keyCode === 13 ? addTask() : null;
}

function addTask(){
  if(taskInput.value.length < 3){
    alert("Task need to be long at least 3 characters");
  }
  else{
    task = document.createElement("li");
    task.innerHTML = `
    <input id="checkbox-${counter}" type="checkbox" class="uk-checkbox">
    <p id="task-title-${counter}" class="d-inline task">${taskInput.value}</p>
    <button type="button" class="close" aria-label="Close">&times;</button>`;
    task.id = `task-${counter}`;
    task.className = "task";
    taskList.appendChild(task);
    counter++;
  }
}

function taskInteraction(e){
  if(e.target.type === "checkbox"){
    e.target.parentElement.style.textDecoration = e.target.checked
    ? "line-through" : "none";
    e.target.parentElement.style.color = e.target.checked 
    ? "grey" : "black";
  }
  else if(e.target.tagName === "BUTTON"){
    taskList.removeChild(e.target.parentElement);
  }
}
//Save tasks
function saveTasks(e){
  e.preventDefault();
  let jsonData = [];
  let taskCounter = taskList.children.length;
  for(counter=0;counter<=taskCounter;counter++){
    if(document.getElementById(`task-${counter}`) !== null){
      taskName = document.getElementById(`task-title-${counter}`).innerText;
      checkboxValue = document.getElementById(`checkbox-${counter}`).checked;
      jsonData.push({title:taskName,done:checkboxValue});
    }
  }
  fetch("https://api.myjson.com/bins",{
    method: "POST",
    headers: {
      "Accept": "application/json, text/plain",
      "Content-Type": "application/json, charset=utf-8"
    },
    body:JSON.stringify(jsonData)
  })
  .then(res => res.json())
  .then((data) => {
    localStorage.setItem("userTasks", data.uri);
    UIkit.notification({
      message: '<span uk-icon="check"></span> Your tasks are successfully saved',
      status: 'primary'
    });
  })
}

if(localStorage.getItem("userTasks") !== null){
  fetch(`${localStorage.getItem("userTasks")}`)
  .then(res => res.json())
  .then(data => {
    for(counter = 0;counter<data.length;counter++){
      taskList.innerHTML += `
      <li id="task-${counter}" class="task ${data[counter].done === true ? "done" : ""}">
        <input id="checkbox-${counter}" type="checkbox" ${data[counter].done === true ? `checked` : null} class="uk-checkbox">
        <p id="task-title-${counter}" class="d-inline task">${data[counter].title}</p>
        <button type="button" class="close" aria-label="Close">&times;</button>
      </li>`;
    }
    taskListLength();
  })
}

function taskListLength(){
  document.getElementById("task-counter").innerHTML = taskList.childElementCount;
  requestAnimationFrame(taskListLength);
}

function clearFinishedTasks(){
  let taskNumber = taskList.childElementCount;
  for(counter=0;counter<=taskNumber;counter++){
    if(document.getElementById(`task-${counter}`) !== null){
      document.getElementById(`checkbox-${counter}`).checked === true 
      ? document.getElementById(`task-${counter}`).remove() : console.log(`task-${counter} is unfinished`);
    }
  }
  UIkit.notification({
    message: '<span uk-icon="check"></span> You cleared all your finished tasks',
    status: 'success'
  });
}

function clearAllTasks(){
  taskList.innerHTML = null;
  counter = 0;
  UIkit.notification({
    message: '<span uk-icon="close"></span> You cleared all your tasks',
    status: 'danger'
  });
}