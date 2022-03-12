//Fetch DOM elements
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-container");
const filterOption = document.querySelector(".filter-todo");

//Event Listeners
window.addEventListener("load", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteTodo);
filterOption.addEventListener("click", filterTodo);

//Functions

function addTodo(e) {
  //Prevent natural behaviour
  e.preventDefault();

    if(todoInput.value == "") {
        alert("Please fill all the fields");
    } 
    else {    
        // Create todo Obj 
        let newTodoObj = {
            userId: 1,
            id: new Date().getTime(),
            text: todoInput.value,
            completed: false
        }
        //Save to local
        saveLocalTodos(newTodoObj);
        //Create todo div
        let todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        todoDiv.setAttribute("id", newTodoObj.id);
        //Create list
        let newTodo = document.createElement("div");
        newTodo.innerText = todoInput.value;
        newTodo.classList.add("todo-text");
        todoDiv.appendChild(newTodo);
        todoInput.value = "";
        //Create Completed Button
        let completedButton = document.createElement("button");
        completedButton.innerHTML = `<i class="fas fa-check"></i>`;
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);
        //Create trash button
        let trashButton = document.createElement("button");
        trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);
        //attach final Todo at the top of the list
        todoList.insertBefore(todoDiv, todoList.firstChild);
    }
}
function updateTextTodo(target, value) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach((ele) => {
        if(ele["id"] == target) {
            ele["title"] = value;
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos));
}

function deleteTodo(e) {
    let item = e.target;
    let todo = item.parentElement;
    if (item.classList[0] === "trash-btn") {
        removeLocalTodos(todo.id);
        todo.remove();
    }
    else if (item.classList[0] === "complete-btn") {
        todo.classList.toggle("completed");
    } 
    else if (item.classList[0] === "todo-text") {
        item.innerHTML = `<textarea class="editable-div">${item.innerText}</textarea>`;
        // listen for blur on textarea
        let textarea = document.querySelector(".editable-div");
        textarea.focus(); //custom focus method run to avoid glitches, however this leads to the cursor at the begining
        textarea.addEventListener('blur', () => {
            if(textarea.value == "") {
                alert("Cant leave blank, please add some text");
            } else {
                item.innerHTML = textarea.value;
                updateTextTodo(todo.id, textarea.value);
            }
        });
    }   
}

function saveLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}


function removeLocalTodos(toDeleteIndex) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach((ele,index) => {
        if(ele["id"] == toDeleteIndex) {
            toDeleteIndex = index;
        }
    })
    todos.splice(toDeleteIndex, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    console.log(todos)
    todos.forEach(function(todo) {
        console.log(todo)
      switch (e.target.value) {
        case "all":
          todo.style.display = "flex";
          break;
        case "completed":
          if (todo.classList.contains("completed")) {
            todo.style.display = "flex";
          } else {
            todo.style.display = "none";
          }
          break;
        case "uncompleted":
          if (!todo.classList.contains("completed")) {
            todo.style.display = "flex";
          } else {
            todo.style.display = "none";
          }
      }
    });
}



function getTodos() {
    let todos;
    fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then((data) => 
            {
                if (data === null) {
                todos = [];
            } else {
                todos = data;
                todos = todos.slice(0,10) // limiting to 10 entries
                localStorage.setItem("todos", JSON.stringify(todos)); // adding this to local storage for CRUD operations, not modifying the API
            }
            todos.forEach(function(todo, index) {
                // let todoDiv = "";
                //Different approach for creating a todo using template literals
                    //Create todo div
                    let todoDiv = document.createElement("div");
                    // todoDiv.classList.add("todo")
                    todo.completed ? todoDiv.classList.add("todo", "completed") : todoDiv.classList.add("todo"); // check if todo is completed
                    todoDiv.setAttribute("id", todo.id);
                    //Create list
                    let newTodo = document.createElement("div");
                    newTodo.innerText = todo.title;
                    newTodo.classList.add("todo-text");
                    todoDiv.appendChild(newTodo);
                    todoInput.value = "";
                    //Create Completed Button
                    let completedButton = document.createElement("button");
                    completedButton.innerHTML = `<i class="fas fa-check"></i>`;
                    completedButton.classList.add("complete-btn");
                    todoDiv.appendChild(completedButton);
                    //Create trash button
                    let trashButton = document.createElement("button");
                    trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
                    trashButton.classList.add("trash-btn");
                    todoDiv.appendChild(trashButton);
                    //attach final Todo at the top of the list
                    todoList.appendChild(todoDiv);
            });
        }
    );
    
}


