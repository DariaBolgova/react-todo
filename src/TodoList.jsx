import React from 'react';
import TodoListItem from './TodoListItem';

function TodoList({ todoList }) {
    return (
        <ul style={{ listStyle: 'none' }}>
            {todoList.map((item) => (
                <TodoListItem key={item.id} todo={item} />
            ))}
        </ul>
    );
}

export default TodoList;