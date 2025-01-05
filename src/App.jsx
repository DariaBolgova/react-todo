import { useState, useEffect } from 'react';
import './App.css';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';

function App() {
    const [todoList, setTodoList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = new Promise((resolve) => {
            setTimeout(() => {
                const savedTodoList = localStorage.getItem("savedTodoList");
                resolve({ todoList: savedTodoList ? JSON.parse(savedTodoList) : [] });
            }, 2000);
        });

        fetchData.then((result) => {
            setTodoList(result.todoList);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem("savedTodoList", JSON.stringify(todoList));
        }
    }, [todoList, isLoading]);

    function addTodo(newTodo) {
        setTodoList([...todoList, newTodo]);
    }

    function removeTodo(id) {
        const updatedTodoList = todoList.filter((todo) => todo.id !== id);
        setTodoList(updatedTodoList);
    }

    return (
        <>
            <h1>Todo List</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <AddTodoForm onAddTodo={addTodo} />
                    <TodoList todoList={todoList} onRemoveTodo={removeTodo} />
                </>
            )}
        </>
    );
}

export default App;