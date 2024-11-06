import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

let todoList = [{'id': 1, 'title': "Complete the coding assignment"}, 
                {'id': 2, 'title': "Complete the mindset assignment"},
                {'id': 3, 'title': "Submit the assignment"}];

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1>Todo List</h1>
    <ul style={{ listStyle: 'none'}}>
        {todoList.map((item) =>
          <li key={item.id}>{item.id}. {item.title}</li>
        )}
    </ul>
    </>
  )
}

export default App
