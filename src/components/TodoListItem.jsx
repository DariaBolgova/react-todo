import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTrash, FaEdit, FaSave, FaCheckSquare, FaRegSquare } from 'react-icons/fa';
import './App.css';

function TodoListItem({ todo, index, onRemoveTodo, onEditTodo, onToggleComplete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(todo.title);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        if (editedTitle.trim() !== "" && editedTitle !== todo.title) {
            onEditTodo(todo.id, editedTitle);
        }
        setIsEditing(false);
    };

    return (
        <li className="todo-item">
            <div className="checkbox-container" onClick={() => onToggleComplete(todo.id, !todo.completed)}>
                {todo.completed ? <FaCheckSquare className="checkbox checked" /> : <FaRegSquare className="checkbox" />}
            </div>
            <span className="todo-content">
                {index + 1}. {isEditing ? (
                    <input 
                        type="text" 
                        value={editedTitle} 
                        onChange={(e) => setEditedTitle(e.target.value)}
                    />
                ) : (
                    todo.title
                )}
            </span>
            <div className="button-group">
                {isEditing ? (
                    <button type="button" className="save-button" onClick={handleSave}>
                        <FaSave />
                    </button>
                ) : (
                    <>
                        <button type="button" className="edit-button" onClick={handleEdit}>
                            <FaEdit />
                        </button>
                        <button type="button" className="delete-button" onClick={() => onRemoveTodo(todo.id)}>
                            <FaTrash />
                        </button>
                    </>
                )}
            </div>
        </li>
    );
}

TodoListItem.propTypes = {
    todo: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    onRemoveTodo: PropTypes.func.isRequired,
    onEditTodo: PropTypes.func.isRequired,
    onToggleComplete: PropTypes.func.isRequired,
};

export default TodoListItem;