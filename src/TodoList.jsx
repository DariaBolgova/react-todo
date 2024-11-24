import React from 'react';
import TodoListItem from './TodoListItem';

let todoList = [
    { id: 1, title: "Complete the coding assignment" },
    { id: 2, title: "Complete the mindset assignment" },
    { id: 3, title: "Submit the assignment" }
];

function TodoList() {
    return (
        <ul style={{ listStyle: 'none' }}>
            {todoList.map((item) => (
                <TodoListItem key={item.id} todo={item} />
            ))}
        </ul>
    );
}

export default TodoList;