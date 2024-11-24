import React from 'react';

function AddTodoForm(props) {
    
    // Function to handle form submission
    function handleAddTodo(event) {
        event.preventDefault();
        const todoTitle = event.target.title.value;
        props.onAddTodo(todoTitle);
        event.target.reset();
    }

    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Title</label>
            <input type="text" id="todoTitle" name="title" />
            <button type="submit">Add</button>
        </form>
    );
}

export default AddTodoForm;