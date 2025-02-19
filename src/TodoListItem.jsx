import React from 'react';

function TodoListItem({ todo, onRemoveTodo }) {
    return (
        <li className="todo-item">
            {todo.id}. {todo.title}
            <button
                type="button"
                onClick={() => onRemoveTodo(todo.id)}
            >
                Remove
            </button>
        </li>
    );
}

export default TodoListItem;