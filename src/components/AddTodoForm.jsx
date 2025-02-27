import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './App.css';

function AddTodoForm({ onAddTodo }) {
    const [todoTitle, setTodoTitle] = useState("");

    function handleAddTodo(event) {
        event.preventDefault();
        if (todoTitle.trim() === "") return;
        onAddTodo(todoTitle);
        setTodoTitle("");
    }

    function handleTitleChange(event) {
        setTodoTitle(event.target.value);
    }

    return (
        <form className="todo-form" onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle" className="form-label">Add a new toDo:</label>
            <div className="input-container">
                <input
                    id="todoTitle"
                    type="text"
                    value={todoTitle}
                    onChange={handleTitleChange}
                    className="todo-input"
                />
                <button type="submit" className="add-button">+</button>
            </div>
        </form>
    );
}

AddTodoForm.propTypes = {
    onAddTodo: PropTypes.func.isRequired,
};

export default AddTodoForm;