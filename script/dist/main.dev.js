"use strict";

var localStorageTodo = JSON.parse(localStorage.getItem("todos"));
var localStorageTheme = JSON.parse(localStorage.getItem("theme"));
var todos = localStorage.getItem("todos") !== null ? localStorageTodo : [];
var theme = localStorage.getItem("theme") !== null ? localStorageTheme : ""; // Theme controller

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
}); // Add todo

function addTodo(e) {
  e.preventDefault();

  if ($("#create-input").val().trim() === "") {
    alert("Please add a todo text!");
  } else {
    var todo = {
      id: generateID(),
      text: $("#create-input").val().trim(),
      status: $("#create-section #circle").hasClass("compeleted") ? "compeleted" : "active"
    };
    todos.push(todo);
    addTodoDom(todo);
    updateLocalStorage();
    $("#create-input").val("");
  }
} //  Generat random ID


function generateID() {
  return Math.floor(Math.random() * 100000000);
} // Add todo to DOM


function addTodoDom(todo) {
  $("#todo-list").append("\n  <div class=\"todo ".concat(todo.status == "compeleted" ? "done" : "", "\" data-status=\"").concat(todo.status, "\">\n  <div class=\"circle ").concat(todo.status == "compeleted" ? todo.status : "", "\"></div>\n  <div class=\"todo-text\">").concat(todo.text, "</div>\n  <img src=\"images/icon-cross.svg\" alt=\"delete\" class=\"delete\" onclick=\"removeTodo(").concat(todo.id, ")\"/>\n</div>\n  "));
  countLeftItems();
}

function removeTodo(id) {
  todos = todos.filter(function (todo) {
    return todo.id !== id;
  });
  updateLocalStorage();
  init();
  countLeftItems();
} // Update localstorage


function updateLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("theme", JSON.stringify($("body").attr("class")));
} // Add compeleted class


var circle = document.getElementById("todo-list");

function addCircle(e) {
  if ($(e.target).hasClass("circle")) {
    $(e.target).toggleClass("compeleted");
    $(e.target).parent().toggleClass("done");
    $(e.target).parent().attr("data-status", function (index, attr) {
      return attr == "compeleted" ? "active" : "compeleted";
    });
  }

  countLeftItems();
}

function inputCircle() {
  $(this).toggleClass("compeleted");
} // Filter


function filter() {
  if ($(this).html() == "all") {
    $(".todo").fadeIn();
  } else {
    if ($(".todo[data-status=".concat($(this).html(), "]")).length > 0) {
      $(".todo[data-status=".concat($(this).html(), "]")).siblings().hide();
      $(".todo[data-status=".concat($(this).html(), "]")).fadeIn();
    } else {
      $(".todo").fadeOut();
    }
  }

  $(this).addClass("active").siblings().removeClass("active");
} // Clear compeleted todos


function clear() {
  $(".todo[data-status='compeleted']").remove();
} // Count left items


function countLeftItems() {
  var counter = $('.todo[data-status="active"]').length;
  $("#items-count").html(counter);
  var item = counter > 1 ? "items" : "item";
  $("#items").html(item);
}

countLeftItems(); // Init app

function init() {
  $("#todo-list").html("");
  todos.forEach(addTodoDom);
  $("body").addClass(JSON.parse(localStorage.getItem("theme")));
}

init(); // Drag and drop functions

new Sortable(document.getElementById("todo-list"), {});
$(function () {
  $("#todo-list").niceScroll({
    cursorcolor: "hsl(236, 9%, 61%)"
  });
}); // Add events

$("#theme").on("click", chnageTheme); // $("#theme").on("click", cookies);

$("#form").submit(addTodo);
$("#circle").on("click", inputCircle);
circle.addEventListener("click", addCircle);
$(".delete").on("click", removeTodo);
$(".filter-container span").on("click", filter);
$("#clear").on("click", clear);