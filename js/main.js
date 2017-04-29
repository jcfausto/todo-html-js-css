//Load this script at the bottom of your body tag to make sure
//the DOM is completed loaded

var addButtom = document.getElementById('add');
var newTodo = document.getElementById('newTodo');
var todoList = document.getElementById('todoList');

addButtom.addEventListener('click', function(){
  addTodoItem(newTodo.value);
});

function addTodoItem(text) {
  //Text should not be empty.
  if (text) {
    var todo = document.createElement('li');
    todo.innerText = text;

    //New items should got to the top of the list.
    todoList.insertBefore(todo, todoList.childNodes[0]);
  }
}
