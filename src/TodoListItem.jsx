import React from 'react';

function TodoListItem(props) {
    return (
        <li>
            {props.todo.id}. {props.todo.title}
        </li>
    );
}

export default TodoListItem;