import React from 'react';

let todoList = [{'id': 1, 'title': "Complete the coding assignment"}, 
                {'id': 2, 'title': "Complete the mindset assignment"},
                {'id': 3, 'title': "Submit the assignment"}];

function TodoList() {
    return (
        <ul style={{ listStyle: 'none' }}>
            {todoList.map((item) => (
                <li key={item.id}>{item.id}. {item.title}</li>
            ))}
        </ul>
    );
}

export default TodoList;