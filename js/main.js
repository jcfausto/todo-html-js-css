//Load this script at the bottom of your body tag to make sure
//the DOM is completed loaded

var addButtom = document.getElementById('add');
var item = document.getElementById('item');

addButtom.addEventListener('click', function(){
  var value = item.value;

  if (value) {
      //add to the todo list
  }

});
