import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddTodoForm from './AddTodoForm';

describe('AddTodoForm', () => {
  test('renders the form correctly', () => {
    render(<AddTodoForm onAddTodo={jest.fn()} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  test('calls onAddTodo when form is submitted', () => {
    const mockOnAddTodo = jest.fn();
    render(<AddTodoForm onAddTodo={mockOnAddTodo} />);

    const input = screen.getByLabelText(/title/i);
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(button);

    expect(mockOnAddTodo).toHaveBeenCalledTimes(1);
    expect(mockOnAddTodo).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Task' }));
  });
});