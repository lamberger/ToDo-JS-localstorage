/**
 * App for making a simple todo list
 * Author: Patrik Lamberger
 *
 * @requires jQuery
 * @version 0.0.1
 */
var TodoApp = (function () {
    // Properties
    var todos = [],
        $submit = $('#submit'),
        $inputField = $('#todo'),
        $ul = $('#todo-app ul'),
        $saveList = $('#spara'),
        $removeAll = $('#rensa');

    // Methods
    function init() {
        // Application init code
        $submit.on('click', createTodo);
        $ul.on('click', 'a', deleteTodo);
        $ul.on('click', 'li', updateTodo);
        $inputField.val('');
        $removeAll.on('click', deleteList);
        $saveList.on('click', saveTodoList);
        loadList();
    }

    function createTodo() {
        // Skapar ett unikt id
        var id = 'pjl-' + Date.now();
        //Hämtar värdet från input field (#todo)
        var txt = $inputField.val();
        //Pushar objektet till todos
        todos.push({ id: id, todotxt: txt });
        //Visar listobjektet på sidan
        $ul.prepend('<li id="' + id + '">' + txt + '<span><a href="#">&times;</a></span></li>');
        $inputField.val('');
    }

    function updateTodo() {
        //Gör texten i li-elementet redigerbar 
        $(this).attr('contenteditable', 'true').focus();
        //Gör så att användaren inte kan redigera eller ta bort &time; i a
        $(this).children().attr('contenteditable', 'false');
        //När användaren klickar någonstans utanför li-elementet, tas redigeringsmöjligheten bort och objektet sparas.
        $(this).blur(function () {
            $(this).removeAttr('contenteditable');
            $(this).children().removeAttr('contenteditable');
            //Ta bort gammalt textvärde
            var removeIndex = todos.map(function (todo) {
                return todo.id;
            }).indexOf(this.id);
            todos.splice(removeIndex, 1);
            //Spara uppdaterad text i första noden och pusha till todos
            todos.push({ id: this.id, todotxt: $(this).contents().get(0).nodeValue });
        });
    }

    function deleteTodo() {
        //Ta bort det närmaste li-elementet 
        $(this).closest('li').remove();
        //Ta bort matchande objekt i todos
        var removeTodo = todos.map(function (todo) {
            return todo.id;
        }).indexOf($(this).closest('li').attr('id'));
        todos.splice(removeTodo, 1);
    }

    function deleteList() {
        $ul.children().remove();
        todos = [];
        localStorage.clear();
    }

    function saveTodoList() {
        localStorage.setItem('TodoList', JSON.stringify(todos));
    }

    function loadList() {
        //Om det finns en TodoList i localstorage? Populeras todos med TodoList innehåll.
        if (localStorage.getItem('TodoList')) {
            var ls = localStorage.getItem('TodoList') || [];
            ls = JSON.parse(ls);
            todos = ls;
            //Loopa todos och visa listan på sidan.
            for (var i = 0; i < todos.length; i++) {
                $ul.prepend('<li id="' + todos[i].id + '">' + todos[i].todotxt + '<span><a href="#">&times;</a></span></li>');
            }
        }
    }

    return {
        init: init
    };

})();

TodoApp.init(); // Run application