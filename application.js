$(document).ready(function(){
  var $newTodoInput = $('.new-todo-input');

  $newTodoInput.on('keydown', function(event){
    if (event.keyCode !== 13) {
      return;
    }
    else {
      var enteredInput = $(this).val();

      addNewTodoToList(enteredInput);
      $(this).val('');
    }
  });
});

function addNewTodoToList(newTodoText) {
  var $todoList = $('section.todo-list');
      $todoClone = $('.todo-template').first().clone(),
      $todoCloneInput = $todoClone.find('input'),
      $todoCloneFaIcon = $todoClone.find('i').first();

  $todoCloneInput.val(newTodoText);
  $todoClone.removeClass('new-todo-template')
    .removeClass('hide');
  $todoCloneFaIcon.addClass('fa-circle-o');
  $todoList.append($todoClone);
};