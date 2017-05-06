//Load this script at the bottom of your body tag to make sure
//the DOM is completed loaded

//Telling webpack about this script dependencies
import {deleteButtonSVG, completeButtonSVG} from './svgs.js';
var moment = require('moment');

var addButton = document.getElementById('add');
var deleteButton = document.getElementById('delete');
var completeButton = document.getElementById('complete');
var todoList = document.getElementById('todoList');
var completedTodos = document.getElementById('completedTodos');
var newTodo = document.getElementById('newTodo');

//Try to get the object from local storage. If it's null, then initializa an empty object
var data = (localStorage.getItem('todolist')) ? JSON.parse(localStorage.getItem('todolist')) : {
  todo: [],
  completed: []
};

loadTodoList(data);

/* Event listeners (Responding to UI events) */
addButton.addEventListener('click', function() {
  var value = newTodo.value;
  resetInputText();

  var newItem = buildNewItem(value);

  if (newItem) {
    addTodoItem(newItem);

    //Store data
    data.todo.push(newItem);
    storeData(data);
  }

});

//To handle when the user pressed enter
newTodo.addEventListener('keypress', function(event) {
  if (event.which == 13 || event.keyCode == 13) {
    var value = newTodo.value;
    resetInputText();

    var newItem = buildNewItem(value);

    if (newItem) {
      addTodoItem(newItem);

      //Store data
      data.todo.push(newItem);
      storeData(data);
    }

    return false;
  }
  return true;
});

/* end of event listeners */

/* helper functions */
function resetInputText(){
  var value = newTodo.value;
  newTodo.value = '';
}

function storeData(data){
  localStorage.setItem('todolist', JSON.stringify(data));
  console.log(data);
}

function loadTodoList(data) {
  //Do nothing if both lists are empty
  if (!data.todo.length && !data.completed.length) return;

  for (var i = 0; i < data.todo.length; i++) {
    var item = data.todo[i];
    addTodoItem(item);
  }


  for (var i = 0; i < data.completed.length; i++) {
    var item = data.completed[i];
    addTodoItem(item, true);
  }

}

//Requires a value. Returns false if no value is provided.
function buildNewItem(value) {
  if (value) {
    var now = moment().format();

    return {
      value: value,
      created: now
    };

  }
  return false;
}

/* end of helper functions */

/* Core user tasks */

//Task: Adding a new todo item
function addTodoItem(item, isCompleted) {
  //Text should not be empty.
  if (item) {
    //Every todo item should have a delete and a complete button.
    var itemButtons = document.createElement('div');
    itemButtons.classList.add('buttons');

    var deleteItButton = document.createElement('button');
    deleteItButton.classList.add('delete');
    deleteItButton.innerHTML = deleteButtonSVG;
    deleteItButton.addEventListener('click', deleteTodo);

    var completeItButton = document.createElement('button');
    completeItButton.classList.add('complete');
    completeItButton.innerHTML = completeButtonSVG;
    completeItButton.addEventListener('click', toggleTodo);

    itemButtons.appendChild(deleteItButton);
    itemButtons.appendChild(completeItButton);

    //New items should got to the top of the list.
    var todo = document.createElement('li');
    todo.innerText = item.value;

    var created = document.createElement('span');
    created.classList.add('createdAt');
    created.title = item.created;
    created.innerText = moment(item.created).format('lll');

    todo.appendChild(created);
    todo.appendChild(itemButtons);

    var targetList = (isCompleted) ? completedTodos : todoList;

    targetList.insertBefore(todo, targetList.childNodes[0]);
  }
}

//Task: Deleting todo item
function deleteTodo(){
  var item = this.parentNode.parentNode;
  var value = item.firstChild.data;
  var parent = item.parentNode;
  var id = parent.id;

  parent.removeChild(item);

  //Store data
  var dataSource = (id === 'todoList') ? data.todo : data.completed;

  var objIndex = dataSource.findIndex(item => item.value === value);
  dataSource.splice(objIndex, 1);

  storeData(data);
}

//Task: Setting a non-completed todo item as completed
//Task: Re-adding a completed todo item to the todo list
function toggleTodo() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var value = item.firstChild.data;
  var id = parent.id;

  var dataSource = (id === 'todoList') ? data.todo : data.completed;
  var dataTarget = (id === 'todoList') ? data.completed : data.todo;
  var targetList = (id === "todoList") ? completedTodos : todoList;

  parent.removeChild(item);
  targetList.insertBefore(item, targetList.childNodes[0]);

  //Store data
  var objIndex = dataSource.findIndex(item => item.value === value);
  var obj = dataSource[objIndex];

  dataSource.splice(objIndex, 1);
  dataTarget.push(obj);

  storeData(data);
}
