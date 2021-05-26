const localStorageTodo = JSON.parse(localStorage.getItem("todos"));
const localStorageTheme = JSON.parse(localStorage.getItem("theme"));

let todos = localStorage.getItem("todos") !== null ? localStorageTodo : [];
let theme = localStorage.getItem("theme") !== null ? localStorageTheme : "";

// Theme controller
function chnageTheme() {
  $("body").toggleClass("dark");

  updateLocalStorage();
  themePhoto();
}

function themePhoto() {
  if ($("body").hasClass("dark")) {
    $("#theme").attr("src", "images/icon-sun.svg");
  } else {
    $("#theme").attr("src", "images/icon-moon.svg");
  }
}

$(document).ready(function () {
  themePhoto();
});

// Add todo
function addTodo(e) {
  e.preventDefault();

  if ($("#create-input").val().trim() === "") {
    alert("Please add a todo text!");
  } else {
    const todo = {
      id: generateID(),
      text: $("#create-input").val().trim(),
      status: $("#create-section #circle").hasClass("compeleted")
        ? "compeleted"
        : "active",
    };

    todos.push(todo);
    addTodoDom(todo);
    updateLocalStorage();

    $("#create-input").val("");
  }
}

//  Generat random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add todo to DOM
function addTodoDom(todo) {
  $("#todo-list").append(`
  <div class="todo ${todo.status == "compeleted" ? "done" : ""}" data-status="${
    todo.status
  }">
  <div class="circle ${todo.status == "compeleted" ? todo.status : ""}"></div>
  <div class="todo-text">${todo.text}</div>
  <img src="images/icon-cross.svg" alt="delete" class="delete" onclick="removeTodo(${
    todo.id
  })"/>
</div>
  `);
  countLeftItems();
}

function removeTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);

  updateLocalStorage();
  init();
  countLeftItems();
}

// Update localstorage
function updateLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("theme", JSON.stringify($("body").attr("class")));
}

// Add compeleted class
let circle = document.getElementById("todo-list");

function addCircle(e) {
  if ($(e.target).hasClass("circle")) {
    $(e.target).toggleClass("compeleted");
    $(e.target).parent().toggleClass("done");
    $(e.target)
      .parent()
      .attr("data-status", function (index, attr) {
        return attr == "compeleted" ? "active" : "compeleted";
      });
  }
  countLeftItems();
}

function inputCircle() {
  $(this).toggleClass("compeleted");
}

// Filter
function filter() {
  if ($(this).html() == "all") {
    $(".todo").fadeIn();
  } else {
    if ($(`.todo[data-status=${$(this).html()}]`).length > 0) {
      $(`.todo[data-status=${$(this).html()}]`)
        .siblings()
        .hide();
      $(`.todo[data-status=${$(this).html()}]`).fadeIn();
    } else {
      $(".todo").fadeOut();
    }
  }
  $(this).addClass("active").siblings().removeClass("active");
}

// Clear compeleted todos
function clear() {
  $(".todo[data-status='compeleted']").remove();
}

// Count left items
function countLeftItems() {
  let counter = $('.todo[data-status="active"]').length;
  $("#items-count").html(counter);

  let item = counter > 1 ? "items" : "item";
  $("#items").html(item);
}
countLeftItems();

// Init app
function init() {
  $("#todo-list").html("");

  todos.forEach(addTodoDom);
  $("body").addClass(JSON.parse(localStorage.getItem("theme")));
}
init();

// Drag and drop functions

new Sortable(document.getElementById("todo-list"), {});

$(function () {
  $("#todo-list").niceScroll({
    cursorcolor: "hsl(236, 9%, 61%)",
  });
});

// Add events
$("#theme").on("click", chnageTheme);
// $("#theme").on("click", cookies);
$("#form").submit(addTodo);
$("#circle").on("click", inputCircle);
circle.addEventListener("click", addCircle);
$(".delete").on("click", removeTodo);
$(".filter-container span").on("click", filter);
$("#clear").on("click", clear);
