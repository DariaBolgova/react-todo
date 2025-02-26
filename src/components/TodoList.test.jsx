import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from './TodoList';

describe('TodoList', () => {
  const sampleTodos = [
    { id: 1, title: 'First Task' },
    { id: 2, title: 'Second Task' },
  ];

  test('renders todo list items', () => {
    render(<TodoList todoList={sampleTodos} onRemoveTodo={jest.fn()} />);

    expect(screen.getByText(/first task/i)).toBeInTheDocument();
    expect(screen.getByText(/second task/i)).toBeInTheDocument();
  });
});