class Model {
    constructor() {
        this.todos = [];
    }
    bindTodoListChanged(callback) {
        this.onTodoListChanged = callback;
    }
    addTodo(todoText) {
        const todo = {
            id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
            text: todoText,
            complete: false,
        }

        this.todos.push(todo)
        this.onTodoListChanged(this.todos);
    }

    deleteTodo(id) {
        this.todos = this.todos.filter((todo) => todo.id != id)
        console.log('shwet', this.todos, id);
        this.onTodoListChanged(this.todos);
    }

    // Flip the complete boolean on the specified todo
    toggleTodo(id) {
        this.todos = this.todos.map((todo) =>
            todo.id == id ? { id: todo.id, text: todo.text, complete: !todo.complete } : todo,
        )
        this.onTodoListChanged(this.todos);
    }
    filterTodo(value) {
        switch (value) {
            case 'All':
                this.onTodoListChanged(this.todos);
                break;
            case "Completed":
                this.onTodoListChanged(this.todos.filter((todo) => todo.complete));
                break;
            case "Pending":
                this.onTodoListChanged(this.todos.filter((todo) => !todo.complete));
                break;
            default:
                break;
        }
    }

}

class View {
    constructor() {
        this.root = this.getElement('#root');
        this.form = this.createElement('form');

        this.input = this.createElement('input', 'todo-input');
        this.input.type = 'text';
        this.input.placeholder = 'Add todo';
        this.input.name = 'todo';

        this.submitButton = this.createElement('button', 'todo-button');
        this.submitButton.innerHTML = `<i class="fas fa-plus-square"></i>`;

        this.todoContainer = this.createElement('div', 'todo-container');
        this.todoList = this.createElement('ul', 'todo-list');
        this.todoContainer.append(this.todoList);

        this.filterConatiner = this.createElement('div', 'select');
        this.selectFilter = this.createElement('select', 'filter-todo');
        ['All', 'Completed', 'Pending'].forEach((value) => {
            var option = this.createElement('option');
            option.value = value;
            option.text = value;
            this.selectFilter.appendChild(option);
        })
        this.filterConatiner.append(this.selectFilter);

        // Append the input and submit button to the form
        this.form.append(this.input, this.submitButton, this.filterConatiner)

        // Append the title, form, and todo list to the app
        this.root.append(this.form, this.todoContainer)
    }
    // Create an element with an optional CSS class
    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)

        return element
    }

    // Retrieve an element from the DOM
    getElement(selector) {
        const element = document.querySelector(selector)

        return element
    }

    displayTodos(todos) {
        console.log(todos);
        this.todoList.innerHTML = '';
        todos.forEach(todo => {
            //Create todo div
            const todoDiv = document.createElement("div");
            todoDiv.classList.add("todo");
            //Create list
            const newTodo = document.createElement("li");
            newTodo.innerText = todo.text;

            newTodo.classList.add("todo-item");
            if (todo.complete) {
                newTodo.classList.add('completed');
            }
            todoDiv.appendChild(newTodo);
            todoDiv.id = todo.id;
            //Create Completed Button
            const completedButton = document.createElement("button");
            completedButton.innerHTML = `<i class="fas fa-check"></i>`;
            completedButton.classList.add("complete-btn");
            todoDiv.appendChild(completedButton);
            //Create trash button
            const trashButton = document.createElement("button");
            trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
            trashButton.classList.add("trash-btn");
            todoDiv.appendChild(trashButton);
            //attach final Todo
            this.todoList.appendChild(todoDiv);
        })
    }
    bindAddTodo(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault()

            if (this.input.value) {
                handler(this.input.value)
                this.input.value = '';
            }
        })
    }

    bindDeleteOrToggleTodo(deleteHandler, toggleHandler) {
        this.todoList.addEventListener('click', event => {
            event.preventDefault()

            if (event.target.classList[0] === "trash-btn") {
                deleteHandler(event.target.parentElement.id)
            }
            if (event.target.classList[0] === "complete-btn") {
                toggleHandler(event.target.parentElement.id)
            }

        })
    }
    bindFilterChange(handler) {
        this.selectFilter.addEventListener('change', event => {
            event.preventDefault()

            handler(event.target.value);
        })
    }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view
        this.model.bindTodoListChanged(this.onTodoListChanged)
        this.view.bindAddTodo(this.handleAddTodo)
        this.view.bindFilterChange(this.handleFliterChange)
        this.view.bindDeleteOrToggleTodo(this.handleDeleteTodo, this.handleToggleTodo);
    }
    onTodoListChanged = (todos) => {
        this.view.displayTodos(todos)
    }

    handleAddTodo = (todoText) => {
        this.model.addTodo(todoText);
    }
    handleDeleteTodo = (id) => {
        this.model.deleteTodo(id);
    }
    handleToggleTodo = (id) => {
        this.model.toggleTodo(id);
    }
    handleFliterChange = (value) => {
        this.model.filterTodo(value);
    }

}

const app = new Controller(new Model(), new View())