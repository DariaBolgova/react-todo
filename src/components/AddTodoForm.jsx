import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InputWithLabel from './InputWithLabel';
import './App.css';

function AddTodoForm({ onAddTodo }) {
    const [todoTitle, setTodoTitle] = useState("");

    function handleAddTodo(event) {
        event.preventDefault();
        const newTodo = {
            title: todoTitle,
            id: Date.now(),
        };
        onAddTodo(newTodo);
        setTodoTitle("");
    }

    function handleTitleChange(event) {
        setTodoTitle(event.target.value);
    }

    return (
        <form className="todo-form" onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle" className="form-label">Title</label>
            <InputWithLabel
                id="todoTitle"
                value={todoTitle}
                onInputChange={handleTitleChange}
            />
            <button type="submit" className="form-button">Add</button>
        </form>
    );
}

AddTodoForm.propTypes = {
    onAddTodo: PropTypes.func.isRequired,
};

export default AddTodoForm;