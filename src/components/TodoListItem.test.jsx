import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoListItem from './TodoListItem';

describe('TodoListItem', () => {
  const sampleTodo = { id: 1, title: 'Sample Task' };

  test('renders a todo item', () => {
    render(<TodoListItem todo={sampleTodo} onRemoveTodo={jest.fn()} />);
    expect(screen.getByText(/sample task/i)).toBeInTheDocument();
  });

  test('calls onRemoveTodo when remove button is clicked', () => {
    const mockOnRemoveTodo = jest.fn();
    render(<TodoListItem todo={sampleTodo} onRemoveTodo={mockOnRemoveTodo} />);

    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    expect(mockOnRemoveTodo).toHaveBeenCalledTimes(1);
    expect(mockOnRemoveTodo).toHaveBeenCalledWith(sampleTodo.id);
  });
});