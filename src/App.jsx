import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './components/App.css';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';


function App() {
    const [todoList, setTodoList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_TOKEN}`,
            },
        };

        const url = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();

            const todos = data.records.map((todo) => ({
                title: todo.fields.title,
                id: todo.id,
            }));

            setTodoList(todos);
            setIsLoading(false);
        } catch (error) {
            console.error(error.message);
        }
    };

    const postTodo = async (title) => {
        const airtableData = {
            fields: {
                title: title,
            },
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_TOKEN}`,
            },
            body: JSON.stringify(airtableData),
        };

        const url = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            const newTodo = {
                title: data.fields.title,
                id: data.id,
            };

            setTodoList((prevTodoList) => [...prevTodoList, newTodo]);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('savedTodoList', JSON.stringify(todoList));
        }
    }, [todoList, isLoading]);

    function addTodo(newTodoTitle) {
        postTodo(newTodoTitle);
    }

    function removeTodo(id) {
        const updatedTodoList = todoList.filter((todo) => todo.id !== id);
        setTodoList(updatedTodoList);
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Default Route */}
                <Route
                    path="/"
                    element={
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
                    }
                />

                {/* New Todo List Route */}
                <Route
                    path="/new"
                    element={<h1>New Todo List</h1>}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;