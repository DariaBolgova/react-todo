import React from 'react';
import PropTypes from 'prop-types';
import TodoListItem from './TodoListItem';

function TodoList({ todoList, onRemoveTodo, onEditTodo, onToggleComplete }) {
    return (
        <ul className="todo-list" style={{ listStyle: 'none' }}>
            {todoList.map((item, index) => (
                <TodoListItem
                    key={item.id}
                    index={index}
                    todo={item}
                    onRemoveTodo={onRemoveTodo}
                    onEditTodo={onEditTodo}
                    onToggleComplete={onToggleComplete}
                />
            ))}
        </ul>
    );
}

TodoList.propTypes = {
    todoList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            completed: PropTypes.bool.isRequired,
        })
    ).isRequired,
    onRemoveTodo: PropTypes.func.isRequired,
    onEditTodo: PropTypes.func.isRequired,
    onToggleComplete: PropTypes.func.isRequired,
};

export default TodoList;