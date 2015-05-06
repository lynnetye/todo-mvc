$(document).ready(function(){
  var $newTodoInput = $('.new-todo-input'),
      $body = $('body'),
      clearAllCounter = 0;

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

  $body.on('click', function() {
    if (event.target.nodeName === 'I') {
      var $faIcon = $(event.target),
          $task = $faIcon.closest('div'),
          status = $task.attr('completed'),
          taskID = $task.id;

      if ($faIcon.hasClass('complete-icon')) {
        completeTask($faIcon, status, $task);
      } else if ($faIcon.hasClass('delete-icon')) {
        deleteTask($task);
      } else if ($faIcon.hasClass('clear-all-icon')){
        clearAllTasks(clearAllCounter);
        clearAllCounter += 1;
      }
    } else if (event.target.nodeName === 'P') {
      var $filterTab = $(event.target);

      $filterTab.addClass('selected');
      $filterTab.siblings().removeClass('selected');

      applyCorrectFilter($filterTab);
    }
  });
});

function completeTask($faIcon, status, $task) {
  if (status === 'false') {
    $faIcon.removeClass('fa-circle-o')
      .addClass('fa-check-circle-o');
    $task.attr('completed', 'true');
  } else if (status === 'true') {
    $faIcon.removeClass('fa-check-circle-o')
      .addClass('fa-circle-o');
    $task.attr('completed', 'false');
  }
};

function deleteTask($task) {
  $task.fadeOut();
};

function clearAllTasks(clearAllCounter) {
  var $allTasks = $('section').children().not('.todo-form, .todo-template');

  for (var i = 0; i < $allTasks.length; i++) {
    var $task = $($allTasks[i]),
        $faIcon = $task.find('i').first();

    if (clearAllCounter % 2 === 0) {
      completeTask($faIcon, 'false', $task);
    } else {
      completeTask($faIcon, 'true', $task);
    }
  }
};

function applyCorrectFilter($filterTab) {
  var $allTasks = $('section.todo-list').children().not('.todo-form, .todo-template');

  for (var i = 0; i < $allTasks.length; i++) {
    var $task = $($allTasks[i]);

    if ($filterTab.hasClass('filter-all')) {
      $task.removeClass('hide');

    } else if ($filterTab.hasClass('filter-active')) {
      if ($task.attr('completed') === 'true') {
        $task.addClass('hide');
      } else {
        $task.removeClass('hide');
      }

    } else if ($filterTab.hasClass('filter-completed')) {
      if ($task.attr('completed') === 'false') {
        $task.addClass('hide');
      } else {
        $task.removeClass('hide');
      }
    };
  }
};

function addNewTodoToList(newTodoText) {
  var $todoList = $('section.todo-list');
      $todoClone = $('.todo-template').first().clone(),
      $todoCloneInput = $todoClone.find('input'),
      $todoCloneFaIcon = $todoClone.find('i').first();

  $todoCloneInput.val(newTodoText);
  $todoClone.removeClass('todo-template')
    .removeClass('hide')
    .attr('id', currentLengthOfTodoList() + 1)
    .attr('completed', 'false');
  $todoCloneFaIcon.addClass('fa-circle-o');
  $todoList.append($todoClone);
  adjustSettings(currentLengthOfTodoList());
};

function currentLengthOfTodoList(){
  var numberOfTasks = $('.todo-list').children().length - 2;
  return numberOfTasks;
};

function adjustSettings(numberOfTasks){
  var $filtersTab = $('.filters-tab'),
      $itemCounter = $('.item-counter'),
      $completeAllIcon = $('.todo-form > i');

  if (numberOfTasks > 0) {
    $filtersTab.removeClass('hide');
    $completeAllIcon.attr('id', '');
    if (numberOfTasks === 1 ) {
      $itemCounter.text(numberOfTasks + ' item left');
    } else {
      $itemCounter.text(numberOfTasks + ' items left');
    }
  } else {
    $filtersTab.addClass('hide');
    $completeAllIcon.attr('id', 'hide');
  }
};