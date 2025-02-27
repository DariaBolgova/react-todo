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
    const [hideCompleted, setHideCompleted] = useState(false);

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
                completed: !!todo.fields.completed,
                completedAt: todo.fields.completedAt || ""
            }));

            setTodoList(sortTodos(todos));
            setIsLoading(false);
        } catch (error) {
            console.error(error.message);
        }
    }, [sortField, sortOrder, sortTodos]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('savedTodoList', JSON.stringify(todoList));
        }
    }, [todoList, isLoading]);

    // Post new todo to Airtable and update list
    const postTodo = async (title) => {
        const airtableData = {
            fields: {
                title: title.trim(),
                addedAt: new Date().toISOString().split('T')[0],
                completed: false,
                completedAt: null
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
                throw new Error(`Error ${response.status}: ${data.error?.message || 'Unknown error'}`);
            }

            const newTodo = {
                title: data.fields.title,
                id: data.id,
                addedAt: data.fields.addedAt,
                completed: !!data.fields.completed,
                completedAt: data.fields.completedAt
            };

            setTodoList((prevTodoList) => sortTodos([...prevTodoList, newTodo]));
        } catch (error) {
            console.error(error.message);
        }
    };

    async function editTodo(id, newTitle) {
        const url = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
        
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_TOKEN}`,
            },
            body: JSON.stringify({
                records: [{
                    id: id,
                    fields: { title: newTitle }
                }]
            })
        };
        
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            setTodoList((prevTodoList) => sortTodos(prevTodoList.map((todo) => (todo.id === id ? { ...todo, title: newTitle } : todo))));
        } catch (error) {
            console.error('Error updating todo:', error.message);
        }
    }

    async function removeTodo(id) {
        const url = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}/${id}`;
        
        const options = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_TOKEN}`,
            },
        };
        
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            setTodoList((prevTodoList) => sortTodos(prevTodoList.filter((todo) => todo.id !== id)));
        } catch (error) {
            console.error('Error deleting todo:', error.message);
        }
    }    

    async function toggleComplete(id, isCompleted) {
        const url = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
        const completedAt = isCompleted ? new Date().toISOString().split('T')[0] : null;
        
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_TOKEN}`,
            },
            body: JSON.stringify({
                records: [{
                    id: id,
                    fields: { 
                        completed: isCompleted,
                        completedAt: completedAt
                    }
                }]
            })
        };
        
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            setTodoList((prevTodoList) =>
                prevTodoList.map((todo) => 
                    todo.id === id ? { ...todo, completed: isCompleted, completedAt: completedAt } : todo
                )
            );
        } catch (error) {
            console.error('Error updating completion status:', error.message);
        }
    }

    const handleSortChange = (event) => {
        const value = event.target.value;
        if (value.includes('Name')) {
            setSortField('title');
            setSortOrder(value.includes('A -> Z') ? 'asc' : 'desc');
        } else {
            setSortField('addedAt');
            setSortOrder(value.includes('1 -> ∞') ? 'asc' : 'desc');
        }
    };

    const toggleHideCompleted = () => {
        setHideCompleted(prevState => !prevState);
    };    

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <h1>Todo List</h1>
                            {isLoading ? (
                                <p className="loading-message">Loading...</p>
                            ) : (
                                <>
                                    <AddTodoForm onAddTodo={postTodo} />
                                    <div className="sort-hide-container">
                                        <div className="sort-container">
                                            <label htmlFor="sort-select" className="sort-label">Sort by:</label>
                                            <select id="sort-select" className="sort-dropdown" onChange={handleSortChange}>
                                            <option value="Name (A -> Z)">Name (A → Z)</option>
                                            <option value="Name (Z -> A)">Name (Z → A)</option>
                                            <option value="Date (1 -> ∞)">Date (1 → ∞)</option>
                                            <option value="Date (∞ -> 1)">Date (∞ → 1)</option>
                                            </select>
                                        </div>
                                        <button className="toggle-hide-btn" onClick={toggleHideCompleted}>
                                            {hideCompleted ? "Show 🗹️" : "Hide 🗹️"}
                                        </button>
                                    </div>
                                    {(hideCompleted && todoList.every(todo => todo.completed)) ? (
                                        <p className="empty-message">Nothing toDo!</p>
                                    ) : (
                                        <TodoList 
                                            todoList={hideCompleted ? todoList.filter(todo => !todo.completed) : todoList} 
                                            onRemoveTodo={removeTodo} 
                                            onEditTodo={editTodo} 
                                            onToggleComplete={toggleComplete} 
                                        />
                                    )}

                                </>
                            )}
                        </>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;