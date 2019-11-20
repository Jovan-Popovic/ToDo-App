//Define all html elements in variables
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const saveChanges = document.getElementById("save-changes");
const clearFinished = document.getElementById("clear-completed");
const clearAll = document.getElementById("clear-all");

let counter = 0;
let task = ``;
let taskName = ``;
let checkboxValue = ``;

//Add all event listeners
taskInput.addEventListener("keypress", submitButton);
addTaskBtn.addEventListener("click", addTask);
taskList.addEventListener("click", taskInteraction);
saveChanges.addEventListener("click", saveTasks);
clearFinished.addEventListener("click", clearFinishedTasks);
clearAll.addEventListener("click", clearAllTasks);

//On enter key activate addTask function
function submitButton(e){
  e.keyCode === 13 ? addTask() : null;
}

//Funnction for adding tasks
function addTask(){
  if(taskInput.value.length < 3){ //Checking if task is longer than 3 characters
    alert("Task need to be long at least 3 characters");
  }
  else{
    task = document.createElement("li"); //Making new task-new list element
    task.innerHTML = `
    <input id="checkbox-${counter}" type="checkbox" class="uk-checkbox">
    <p id="task-title-${counter}" class="d-inline task">${taskInput.value}</p>
    <button type="button" class="close" aria-label="Close">&times;</button>`;
    task.id = `task-${counter}`;
    task.className = "task";
    taskList.appendChild(task); //Add task in our list
    counter++;
  }
}

function taskInteraction(e){
  if(e.target.type === "checkbox"){ //If checkbox is checked change text decoration and color
    e.target.parentElement.style.textDecoration = e.target.checked
    ? "line-through" : "none";
    e.target.parentElement.style.color = e.target.checked 
    ? "grey" : "black";
  }
  else if(e.target.tagName === "BUTTON"){ //If X button is pressed delete task
    taskList.removeChild(e.target.parentElement);
  }
}

//Save tasks on myjson
function saveTasks(e){
  saveChanges.disabled = true; //Disable button to stop user from making more posts at same time
  e.preventDefault();
  let jsonData = []; //Make array which will contain all tasks, after that it will be saved on myjson 
  let taskCounter = taskList.children.length;
  for(counter = 0; counter <= taskCounter; counter++){
    if(document.getElementById(`task-${counter}`) !== null){
      taskName = document.getElementById(`task-title-${counter}`).innerText; //Take text from task
      checkboxValue = document.getElementById(`checkbox-${counter}`).checked; //take checked value from tasks checkbox
      jsonData.push({title: taskName, done: checkboxValue}); //Push object in array
    }
  }
  //Posting our json file on myjson
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
    localStorage.setItem("userTasks", data.uri); //Save file uri in local storage
    UIkit.notification({ //Send notification for succesfull post
      message: '<span uk-icon="cloud-upload"></span> Your tasks are successfully saved',
      status: 'primary'
    });
    saveChanges.disabled = false;
  })
}

//Check if there is saved tasks,if there is-show them on page
if(localStorage.getItem("userTasks") !== null){
  fetch(`${localStorage.getItem("userTasks")}`)
  .then(res => res.json())
  .then(data => {
    for(counter = 0; counter < data.length; counter++){
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

//Showing how much tasks we have
function taskListLength(){
  document.getElementById("task-counter").innerHTML = taskList.childElementCount;
  requestAnimationFrame(taskListLength);
}

//Delete all tasks with checked checkbox
function clearFinishedTasks(){
  let taskNumber = taskList.childElementCount;
  for(counter = 0; counter <= taskNumber; counter++){
    if(document.getElementById(`task-${counter}`) !== null){
      document.getElementById(`checkbox-${counter}`).checked === true 
      ? document.getElementById(`task-${counter}`).remove() : null;
    }
  }
  UIkit.notification({ //Send notification for succesfull clearing finished tasks
    message: '<span uk-icon="check"></span> You cleared all your finished tasks',
    status: 'success'
  });
}

//Delete all tasks
function clearAllTasks(){
  taskList.innerHTML = null;
  counter = 0;
  UIkit.notification( {//Send notification for deleting all tasks
    message: '<span uk-icon="close"></span> You cleared all your tasks',
    status: 'danger'
  });
}