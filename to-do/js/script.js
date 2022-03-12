//Fetch DOM elements
const todoInput = document.querySelector(".todo-input");
const todoDate = document.querySelector(".todo-input-date");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-container");

//Event Listeners
window.addEventListener("load", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteTodo);

//Functions

function addTodo(e) {
  //Prevent natural behaviour
  e.preventDefault();

    if(todoInput.value == "" || todoDate.value == "") {
        alert("Please fill all the fields");
    } 
    else {    
        // Generate unique ID    
        let unique = new Date().getTime();      
        // Create todo Obj 
        let newTodoObj = {
            userId: 1,
            uid: unique,
            text: todoInput.value,
            date: todoDate.value,
            completion: false
        }
        //Save to local
        saveLocalTodos(newTodoObj);
        //Create todo div
        let todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        todoDiv.setAttribute("id", newTodoObj.uid);
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
        //Create Date Text 
        let newTodoDate = document.createElement("div");
        newTodoDate.classList.add("todo-date");
        newTodoDate.innerText = todoDate.value;
        todoDate.value = "";
        todoDiv.appendChild(newTodoDate);
        //attach final Todo at the top of the list
        todoList.insertBefore(todoDiv, todoList.firstChild);
    }
}

function sortByDate (a,b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}

function updateTextTodo(target, value) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach((ele) => {
        if(ele["uid"] == target) {
            ele["text"] = value;
        }
    })
    todos.sort(sortByDate);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function deleteTodo(e) {
    let item = e.target;
    let todo = item.parentElement;
    let todoList = todo.parentElement;
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
    todos.sort(sortByDate);
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
        if(ele["uid"] == toDeleteIndex) {
            toDeleteIndex = index;
        }
    })
    todos.splice(toDeleteIndex, 1);
    todos.sort(sortByDate);
    localStorage.setItem("todos", JSON.stringify(todos));
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
                localStorage.setItem("todos", JSON.stringify(todos));
            }
            todos.forEach(function(todo, index) {
                // let todoDiv = "";
                //Different approach for creating a todo using template literals
                    //Create todo div
                    let todoDiv = document.createElement("div");
                    // todoDiv.classList.add("todo")
                    todo.completed?todoDiv.classList.add("todo", "completed"):todoDiv.classList.add("todo");
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
                    //Create Date Text 
                    let newTodoDate = document.createElement("div");
                    newTodoDate.classList.add("todo-date");
                    newTodoDate.innerText = todo.date;
                    todoDate.value = "";
                    todoDiv.appendChild(newTodoDate);
                    //attach final Todo at the top of the list
                    todoList.appendChild(todoDiv);
                //attach final Todo        
                // todoList.insertAdjacentHTML("beforeEnd", todoDiv);
            });
        }
    );
    
}
