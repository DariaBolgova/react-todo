import React from 'react';
import TodoListItem from './TodoListItem';

function TodoList({ todoList, onRemoveTodo }) {
    return (
        <ul className="todo-list" style={{ listStyle: 'none' }}>
            {todoList.map((item) => (
                <TodoListItem
                    key={item.id}
                    todo={item}
                    onRemoveTodo={onRemoveTodo}
                />
            ))}
        </ul>
    );
}
  
export default TodoList;