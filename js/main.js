//Load this script at the bottom of your body tag to make sure
//the DOM is completed loaded

//Telling webpack about this script dependencies
import { todoStates } from './todo-states.js';
import {deleteButtonSVG, completeButtonSVG} from './svgs.js';
var moment = require('moment');

//Make links added to the text clikable
import { linkify } from './linkify.js';

//DB
// var config = {
//   apiKey: "AIzaSyDnmLxJUyNB0khhKD75yjs9aW0v0_zWWJA",
//   authDomain: "fir-todo-95078.firebaseapp.com",
//   databaseURL: "https://fir-todo-95078.firebaseio.com",
//   projectId: "fir-todo-95078",
//   storageBucket: "fir-todo-95078.appspot.com",
//   messagingSenderId: "375692946175"
// };
// firebase.initializeApp(config);

 // Get a reference to the database service
 //var database = db;

//Auth0
var token = localStorage.getItem('accessToken');
var userProfile = '';

if (token) {
  showMembersArea();
  //setFooterVisibility(true);
} else {
  requestAuthentication();
  //setFooterVisibility(false);
}

function requestAuthentication() {

  var cid = 'iRuBGKVm5s0f3GosgyW32Tf8160KRjxW';
  var domain = 'jcfausto.eu.auth0.com';

  var lock = new Auth0Lock(cid, domain);

  var container = document.getElementById('container');
  container.innerHTML = '<div class="auth-container" id="auth-container"><h1><center>Authenticate, please.</center></h1><button type="submit" class="btn-auth-login" id="btn-login">Log In | Sign Up</button></div>';

  var btn_login = document.getElementById('btn-login');

  btn_login.addEventListener('click', function() {
    lock.show();
  });

  lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function(error, profile) {
      if (error) {
        console.log(error);
        return;
      }
      localStorage.setItem('accessToken', authResult.accessToken);
      localStorage.setItem('user_profile', JSON.stringify(profile));

      // Display user data
      showMembersArea();
    });
  });

}

var logout = function() {
  localStorage.removeItem('accessToken');
  window.location.href = "/";
};

//End of auth functions

function setFooterVisibility(visible) {
  if (visible) {
    console.log('changing to visible');
    var footer = document.getElementById('footer');
    footer.style.display = 'show';
    var userProfile = JSON.parse(localStorage.getItem('user_profile'));
    document.getElementById('nick').textContent = userProfile.nickname;
  } else {
    console.log('changing to invisible');
    footer.style.display = 'none';
  }
  console.log(footer.style.display);
}

function showMembersArea() {
  var footer = document.getElementById('footer');
  userProfile = JSON.parse(localStorage.getItem('user_profile'));

  var nickname = document.createElement('div');
  nickname.classList.add('nickname');
  nickname.innerText = 'Welcome ';

  var nick = document.createElement('span');
  nick.id = 'nick';
  nick.classList.add('nick');

  nickname.appendChild(nick);

  var logoutButton = document.createElement('button');
  logoutButton.id = 'btn_logout';
  var logoutButtonText = document.createTextNode("Log out");
  logoutButton.appendChild(logoutButtonText);

  footer.appendChild(nickname);
  footer.appendChild(logoutButton);

  //Clear local storage
  // var btnLsClear = document.createElement('button');
  // btnLsClear.id = 'btn_lsClear';
  // var btnLsClearText = document.createTextNode("Clear LS");
  // btnLsClear.appendChild(logoutButtonText);
  // btnLsClear.addEventListener('click', function() {
  //   localStorage.removeItem('todolist');
  // });
  // footer.appendChild(btnLsClear);

  //<div class="nickname">Welcome <span id="nick" class="nick"></span></div>
  //<button id="btn_logout">Log out</button>

  document.getElementById('nick').textContent = userProfile.nickname;
  footer.style.display = 'show';

  var btn_logout = document.getElementById('btn_logout');
  btn_logout.addEventListener('click', function() {
    logout();
  });

  var container = document.getElementById('container');
  container.innerHTML = '<!-- todo items list --><ul class="todo" id="todoList"></ul><!-- todo items list --><ul class="todo" id="completedTodos"></ul>';

  var newTodoContainer = document.getElementById('newTodoForm');
  newTodoContainer.innerHTML = '<input type="text" placeholder="Type a new task.." id="newTodo" name="newTodo"><button id="add"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve"><g><g><path class="fill" d="M16,8c0,0.5-0.5,1-1,1H9v6c0,0.5-0.5,1-1,1s-1-0.5-1-1V9H1C0.5,9,0,8.5,0,8s0.5-1,1-1h6V1c0-0.5,0.5-1,1-1s1,0.5,1,1v6h6C15.5,7,16,7.5,16,8z"/></g></g></svg></buttom>';

  //End of authentication code
  var addButton = document.getElementById('add');
  var deleteButton = document.getElementById('delete');
  var completeButton = document.getElementById('complete');
  var todoList = document.getElementById('todoList');
  var completedTodos = document.getElementById('completedTodos');
  var newTodo = document.getElementById('newTodo');

  //Try to get the object from local storage. If it's null, then initializa an empty object
  // var data = (localStorage.getItem('todolist')) ? JSON.parse(localStorage.getItem('todolist')) : {
  //   todos: []
  // };
  var data = {todos: []};

  // database.ref('/user-todos/' + userProfile.user_id).once('value').then(function(snapshot) {
  //   //var result = snapshot.val();
  //   //var count = snapshot.numChildren();
  //   //console.log(result);
  //
  //   //Do nothing if the list is empty
  //   //if (!count) return;
  //
  //   snapshot.forEach(function(item){
  //     data.todos.push(item.val());
  //     addTodoItem(item.val());
  //   });
  //
  //   console.log(data);
  // });

  /* Event listeners (Responding to UI events) */
  addButton.addEventListener('click', function() {
    var value = newTodo.value;
    resetInputText();

    var newItem = buildNewItem(value);

    if (newItem) {
      addTodoItem(newItem);

      //Store data
      data.todos.push(newItem);
      storeData(data);
    }

  });

  //To handle when the user pressed enter
  newTodo.addEventListener('keypress', function(event) {
    if (event.which == 13 || event.keyCode == 13) {
      document.getElementById("newTodoForm").submit();

      // var value = newTodo.value;
      // resetInputText();
      //
      // var newItem = buildNewItem(value);
      //
      // if (newItem) {
      //   addTodoItem(newItem);
      //
      //   //Store data
      //   data.todos.push(newItem);
      //   storeData(data);
      // }

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

  //Requires a value. Returns false if no value is provided.
  function buildNewItem(value) {
    if (value) {
      var now = moment().format();

      //var newTodoKey = database.ref().child('todos').push().key;
      var newTodoKey = 1;

      var newTodo = {
        key: newTodoKey,
        value: value,
        created_at: now,
        status: todoStates.TODO,
        user_id: userProfile.user_id
      };

      var updates = {};
      updates['/todos/' + newTodoKey] = newTodo;
      updates['/user-todos/' + userProfile.user_id + '/' + newTodoKey] = newTodo;

      //return database.ref().update(updates);
      return newTodo;

    }
    return false;
  }

  /* end of helper functions */

  /* Core user tasks */

  //Task: Adding a new todo item
  function addTodoItem(item) {
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
      todo.innerHTML = linkify(item.value);

      var created = document.createElement('span');
      created.classList.add('createdAt');
      created.title = item.created_at;
      created.innerText = moment(item.created_at).format('lll');

      todo.appendChild(created);
      todo.appendChild(itemButtons);

      var targetList = (item.status === todoStates.DONE) ? completedTodos : todoList;

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
    //var dataSource = (id === 'todoList') ? data.todo : data.completed;

    var objIndex = data.todos.findIndex(item => item.value === value);
    data.todos.splice(objIndex, 1);

    storeData(data);
  }

  //Task: Setting a non-completed todo item as completed
  //Task: Re-adding a completed todo item to the todo list
  function toggleTodo() {
    var item = this.parentNode.parentNode;
    var parent = item.parentNode;
    var value = item.firstChild.data;
    var id = parent.id;

    //var dataSource = (id === 'todoList') ? data.todo : data.completed;
    //var dataTarget = (id === 'todoList') ? data.completed : data.todo;

    var targetList = (id === "todoList") ? completedTodos : todoList;

    parent.removeChild(item);
    targetList.insertBefore(item, targetList.childNodes[0]);

    //Store data
    var objIndex = data.todos.findIndex(item => item.value === value);
    var obj = data.todos[objIndex];

    if (obj.status === todoStates.TODO) {
      obj.status = todoStates.DONE;
    } else {
      obj.status = todoStates.TODO;
    }

    data.todos.splice(objIndex, 1);
    data.todos.push(obj);

    storeData(data);
  }
}
