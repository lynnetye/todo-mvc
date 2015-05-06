$(document).ready(function() {
  var $newTodoInput = $('.new-todo-input'),
      clearAllCounter = 0;

  $newTodoInput.on('keydown', function(event) {
    if (event.keyCode !== 13) {
      return;
    }
    var enteredInput = $(this).val();

    addNewTodoToList(enteredInput);
    $(this).val('');
  });

  $('body').on('click', 'i', function() {
    var $faIcon = $(event.target),
        $task = $faIcon.closest('div'),
        status = $task.attr('completed');

    if ($faIcon.hasClass('complete-icon')) {
      completeTask($faIcon, status, $task);
      updateDisplayOfFeatures();

    } else if ($faIcon.hasClass('delete-icon')) {
      deleteTask($task);

    } else if ($faIcon.hasClass('clear-all-icon')) {
      clearAllTasks(clearAllCounter);
      clearAllCounter += 1;
    }
  });

  $('body').on('click', 'p.filter-action', function() {
    var $filterTab = $(event.target);

    if ($filterTab.hasClass('clear-completed')) {
      clearCompletedTasks();
    } else if ($filterTab.hasClass('filter-all')) {
      showAllTasks($filterTab);
    } else if ($filterTab.hasClass('filter-active')) {
      showActiveTasks($filterTab);
    } else if ($filterTab.hasClass('filter-completed')) {
      showCompletedTasks($filterTab);
    }
  });
});

function clearCompletedTasks() {
  var $allCompletedTasks = $allTasks().filter("[completed='true']");

  for (var i = 0; i < $allCompletedTasks.length; i++) {
    deleteTask($($allCompletedTasks[i]));
  }
};

function showAllTasks($filterTab) {
  for (var i = 0; i < $allTasks().length; i++) {
    $($allTasks()[i]).removeClass('hide');
    showSelectedFilterTab($filterTab);
  }
};

function showActiveTasks($filterTab) {
  showSelectedFilterTab($filterTab);
  for (var i = 0; i < $allTasks().length; i++) {
    var $task = $($allTasks()[i]);

    if ($task.attr('completed') === 'true') {
      $task.addClass('hide');
    } else {
      $task.removeClass('hide');
    }
  }
};

function showCompletedTasks($filterTab) {
  showSelectedFilterTab($filterTab);
  for (var i = 0; i < $allTasks().length; i++) {
    var $task = $($allTasks()[i]);

    if ($task.attr('completed') === 'false') {
      $task.addClass('hide');
    } else {
      $task.removeClass('hide');
    }
  };
};

function completeTask($faIcon, status, $task) {
  if (status === 'false') {
    $faIcon
      .removeClass('fa-circle-o')
      .addClass('fa-check-circle-o');
    $task
      .attr('completed', 'true')
      .find('input').addClass('line-through');
  } else if (status === 'true') {
    $faIcon
      .removeClass('fa-check-circle-o')
      .addClass('fa-circle-o');
    $task
      .attr('completed', 'false')
      $task.find('input').removeClass('line-through');
  }
  updateDisplayOfFeatures();
};

function deleteTask($task) {
  $task.remove();
  updateDisplayOfFeatures();
};

function clearAllTasks(clearAllCounter) {
  for (var i = 0; i < $allTasks().length; i++) {
    var $task = $($allTasks()[i]),
        $faIcon = $task.find('i').first();

    if (clearAllCounter % 2 === 0) {
      completeTask($faIcon, 'false', $task);
    } else {
      completeTask($faIcon, 'true', $task);
    }
  }
};

function addNewTodoToList(newTodoText) {
  var $todoClone = $('.todo-template').first().clone(),
      $todoCloneInput = $todoClone.find('input'),
      $todoCloneFaIcon = $todoClone.find('i').first();

  $todoCloneInput.val(newTodoText);
  $todoClone
    .removeClass('todo-template')
    .removeClass('hide')
    .attr('completed', 'false');
  $todoCloneFaIcon.addClass('fa-circle-o');
  $('.todo-list').append($todoClone);
  updateDisplayOfFeatures();
};

function updateDisplayOfFeatures() {
  var $filtersTab = $('.filters-tab'),
      $itemCounter = $('.item-counter'),
      $completeAllIcon = $('.todo-form > i');

  if (currentLengthOfTodoList() > 0) {
    $filtersTab.removeClass('hide');
    $completeAllIcon.attr('id', '');
    if (currentNumberOfActiveTasks() === 1 ) {
      $itemCounter.text(currentNumberOfActiveTasks() + ' item left');
    } else {
      $itemCounter.text(currentNumberOfActiveTasks() + ' items left');
    }
  } else {
    $filtersTab.addClass('hide');
    $completeAllIcon.attr('id', 'hide');
  }

  if (currentNumberOfCompletedTasks() > 0) {
    $('p.clear-completed').removeClass('hide');
  } else {
    $('p.clear-completed').addClass('hide');
  }
};

function showSelectedFilterTab($filterTab) {
  $filterTab
    .addClass('selected')
    .siblings().removeClass('selected');
};



// "HELPER" FUNCTIONS
function $allTasks() {
  return $('.todo-list').children().not('.todo-template, .todo-form');
};

function currentLengthOfTodoList() {
  return $allTasks().length;
};

function currentNumberOfActiveTasks() {
  return $allTasks().filter("[completed='false']").length;
};

function currentNumberOfCompletedTasks() {
  return $allTasks().filter("[completed='true']").length;
};