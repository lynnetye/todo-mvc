$(document).ready(function(){
  var $newTodoInput = $('.new-todo-input');

  $newTodoInput.on('click', function(){
    $(this).on('keydown', function(event) {
      if (event.keyCode !== 13) {
        return;
      }
      else {
        var enteredInput = $(this).val();

        console.log(enteredInput);
        addNewTodoToList(enteredInput);
      }
    });
  });
});

var addNewTodoToList = function(newTodoText) {
  var $todoList = $('section.todo-list');
      $todoClone = $('.new-todo-template').first().clone(),
      $todoCloneInput = $todoClone.find('input');

  console.log('here');
  $todoClone.removeClass('new-todo-template');
  $todoCloneInput.val(newTodoText);
  $todoClone.removeClass('hide');
  $todoList.append($todoClone);
};