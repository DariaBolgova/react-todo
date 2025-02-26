import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './components/App.css';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';

function App() {
    const [todoList, setTodoList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('title');

    // Sorting function
    const sortTodos = useCallback((todos) => {
        return [...todos].sort((a, b) =>
            sortField === 'title'
                ? sortOrder === 'asc'
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title)
                : sortOrder === 'asc'
                ? new Date(a.addedAt) - new Date(b.addedAt)
                : new Date(b.addedAt) - new Date(a.addedAt)
        );
    }, [sortField, sortOrder]);

    // Fetch data from Airtable
    const fetchData = useCallback(async () => {
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_TOKEN}`,
            },
        };

        const url = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}?view=Grid%20view&sort[0][field]=${sortField}&sort[0][direction]=${sortOrder}`;

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();

            let todos = data.records.map((todo) => ({
                title: todo.fields.title,
                id: todo.id,
                addedAt: todo.fields.addedAt,
            }));

            setTodoList(sortTodos(todos));
            setIsLoading(false);
        } catch (error) {
            console.error(error.message);
        }
    }, [sortField, sortOrder, sortTodos]);

    // Post new todo to Airtable and update list
    const postTodo = async (title) => {

        console.log("Adding Todo:", title);

        const airtableData = {
            fields: {
                title: title.trim(),
                addedAt: new Date().toISOString().split('T')[0],
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
            const data = await response.json();

            if (!response.ok) {
                console.error("Error Response:", data);
                throw new Error(`Error ${response.status}: ${data.error?.message || 'Unknown error'}`);
            }

            const newTodo = {
                title: data.fields.title,
                id: data.id,
                addedAt: data.fields.addedAt,
            };

            // Sort locally instead of fetching from API again
            setTodoList((prevTodoList) => sortTodos([...prevTodoList, newTodo]));

        } catch (error) {
            console.error("Fetch Error:", error.message);
        }
    };

    // Fetch data when component mounts or when sorting changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Save todos in localStorage
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('savedTodoList', JSON.stringify(todoList));
        }
    }, [todoList, isLoading]);

    function addTodo(newTodoTitle) {
        if (typeof newTodoTitle === "object" && newTodoTitle.title) {
            newTodoTitle = newTodoTitle.title;
        }
        postTodo(newTodoTitle);
    }

    function removeTodo(id) {
        setTodoList((prevTodoList) => prevTodoList.filter((todo) => todo.id !== id));
    }

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    const toggleSortField = () => {
        setSortField((prevField) => (prevField === 'title' ? 'addedAt' : 'title'));
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <h1>Todo List</h1>
                            <div className="button-container">
                                <button className="sort-button" onClick={toggleSortOrder}>
                                    Sort Order ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
                                </button>
                                <button className="sort-button" onClick={toggleSortField}>
                                    Sort By ({sortField === 'title' ? 'Title' : 'Date Added'})
                                </button>
                            </div>
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
                <Route path="/new" element={<h1>New Todo List</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;