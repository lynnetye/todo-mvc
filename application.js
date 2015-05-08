// CONTROLLER
if (localStorage.length === 0) {
  localStorage.setItem('localStorageKeys', []);
  var localStorageKeys = [];
} else {
  var localStorageKeys = localStorage.getItem('localStorageKeys').split(',');

  for (var i = 0; i < localStorageKeys.length; i++) {
    var taskDescription = localStorageKeys[i],
        taskStatus = localStorage.getItem(taskDescription);

    constructTaskDOMElement(taskDescription, taskStatus);
  }
  if (location.hash === '#all' || '') {
    showAllTasks('filter-all');
  } else if (location.hash === '#active') {
    showActiveTasks('filter-active');
  } else if (location.hash ==='#completed') {
    showCompletedTasks('filter-completed');
  }
}

// recreate DOM element via local storage
function constructTaskDOMElement(todoDescription, todoStatus) {
  var $todoClone = $('.todo-template').first().clone(),
      $todoCloneInput = $todoClone.find('input'),
      $todoCloneFaIcon = $todoClone.find('i').first();

  $todoCloneInput.val(todoDescription);
  $todoClone
    .removeClass('todo-template');

  if (todoStatus === 'false') {
    $todoCloneFaIcon.addClass('fa-circle-o');
    $todoClone.attr('completed', 'false');
  } else {
    $todoCloneFaIcon.addClass('fa-check-circle-o');
    $todoClone.attr('completed', 'true');
  }
  $('.todo-list').append($todoClone);
  updateDisplayOfFeatures();
};

function updateLocalStorageKeys(){
  if (localStorageKeys.indexOf("") > -1) {
    var index = localStorageKeys.indexOf("") > -1;
    localStorageKeys.splice(emptyIndex, 1);
  }

  localStorage.setItem('localStorageKeys', localStorageKeys);
};

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
      showAllTasks('filter-all');
    } else if ($filterTab.hasClass('filter-active')) {
      showActiveTasks('filter-active');
    } else if ($filterTab.hasClass('filter-completed')) {
      showCompletedTasks('filter-completed');
    }
  });
});

function clearCompletedTasks() {
  var $allCompletedTasks = $allTasks().filter("[completed='true']");

  for (var i = 0; i < $allCompletedTasks.length; i++) {
    deleteTask($($allCompletedTasks[i]));
  }
};

function showAllTasks(selectedFilter) {
  for (var i = 0; i < $allTasks().length; i++) {
    $($allTasks()[i]).removeClass('hide');
    showSelectedFilterTab(selectedFilter);

    // update URL
    history.pushState(null, null, '#all');
  }
};

function showActiveTasks(selectedFilter) {
  showSelectedFilterTab(selectedFilter);
  history.pushState(null, null, '#active');

  for (var i = 0; i < $allTasks().length; i++) {
    var $task = $($allTasks()[i]);

    if ($task.attr('completed') === 'true') {
      $task.addClass('hide');
    } else {
      $task.removeClass('hide');
    }
  }
};

function showCompletedTasks(selectedFilter) {
  showSelectedFilterTab(selectedFilter);
  history.pushState(null, null, '#completed');

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
    localStorage.setItem($task.find('input').val(), true);
  } else if (status === 'true') {
    $faIcon
      .removeClass('fa-check-circle-o')
      .addClass('fa-circle-o');
    $task
      .attr('completed', 'false')
      $task.find('input').removeClass('line-through');
    localStorage.setItem($task.find('input').val(), false);
  }
  updateDisplayOfFeatures();
};

function deleteTask($task) {
  // remove from local storage
  var todoText = $task.find('input').val(),
      index = localStorageKeys.indexOf(todoText);

  localStorageKeys.splice(index, 1);
  localStorage.removeItem(todoText);
  updateLocalStorageKeys();

  $task.remove();
  updateDisplayOfFeatures();
  updateLocalStorageKeys();
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

  // add to localstorage
  localStorage.setItem(newTodoText, false);
  localStorageKeys.push(newTodoText);

  $todoCloneInput.val(newTodoText);
  $todoClone
    .removeClass('todo-template')
    .removeClass('hide')
    .attr('completed', 'false');
  $todoCloneFaIcon.addClass('fa-circle-o');
  $('.todo-list').append($todoClone);
  updateDisplayOfFeatures();
  updateLocalStorageKeys();
};

function updateDisplayOfFeatures() {
  var $filtersTab = $('.filters-tab'),
      $itemCounter = $('.item-counter'),
      $completeAllIcon = $('.todo-form > i');

  if (currentLengthOfTodoList() > 0) {
    $filtersTab.removeClass('hide');
    $completeAllIcon.removeClass('hide');
    if (currentNumberOfActiveTasks() === 1 ) {
      $itemCounter.text(currentNumberOfActiveTasks() + ' item left');
    } else {
      $itemCounter.text(currentNumberOfActiveTasks() + ' items left');
    }
  } else {
    $filtersTab.addClass('hide');
    $completeAllIcon.addClass('hide');
  }

  if (currentNumberOfCompletedTasks() > 0) {
    $('p.clear-completed').removeClass('hide');
  } else {
    $('p.clear-completed').addClass('hide');
  }
};

function showSelectedFilterTab(selectedFilter) {
  $('.filters-tab').find('p.filter-action.' + selectedFilter)
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



