
let counter = 0;
let task = ``;
let taskInput = document.getElementById("task-input");
let addTaskBtn = document.getElementById("add-task-btn");
let taskList = document.getElementById("task-list");

taskInput.addEventListener("keypress",submitButton)
addTaskBtn.addEventListener("click",addTask);

function submitButton(e){
    e.keyCode === 13 ? addTask() : null;
}

function addTask(){
    if(taskInput.value === ""){
        alert("Enter task first")
    }
    else{
        task = `
        <li class="list-group-item">
          ${taskInput.value}
          <input type="checkbox">
          <button type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </li>`
        task.id = counter;
        taskList.innerHTML += task;
        task = ``;
        counter++;
    }
}

function finishedTasks(e){
  if(e.target.type === "checkbox"){
    
  }
}