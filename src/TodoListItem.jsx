import React from 'react';

function TodoListItem({ todo }) {
    return (
        <li>
            {todo.id}. {todo.title}
        </li>
    );
}

export default TodoListItem;