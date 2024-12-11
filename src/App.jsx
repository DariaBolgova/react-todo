import { useState, useEffect } from 'react';
import './App.css';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';

function useSemiPersistentState() {
    const [todoList, setTodoList] = useState(() => {
        const savedTodoList = localStorage.getItem("savedTodoList");
        return savedTodoList ? JSON.parse(savedTodoList) : [];
    });

    useEffect(() => {
        localStorage.setItem("savedTodoList", JSON.stringify(todoList));
    }, [todoList]);

    return [todoList, setTodoList];
}

function App() {
    const [todoList, setTodoList] = useSemiPersistentState();

    function addTodo(newTodo) {
        setTodoList([...todoList, newTodo]);
    }

    return (
        <>
            <h1>Todo List</h1>
            <AddTodoForm onAddTodo={addTodo} />
            <TodoList todoList={todoList} />
        </>
    );
}

export default App;