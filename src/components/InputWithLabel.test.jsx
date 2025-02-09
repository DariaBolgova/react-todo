import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InputWithLabel from './InputWithLabel';

describe('InputWithLabel', () => {
  test('renders input with label', () => {
    render(
      <InputWithLabel id="test-input" value="" onInputChange={jest.fn()}>
        Test Label
      </InputWithLabel>
    );

    expect(screen.getByLabelText(/test label/i)).toBeInTheDocument();
  });

  test('calls onInputChange when input changes', () => {
    const mockOnInputChange = jest.fn();
    render(
      <InputWithLabel id="test-input" value="" onInputChange={mockOnInputChange}>
        Test Label
      </InputWithLabel>
    );

    const input = screen.getByLabelText(/test label/i);
    fireEvent.change(input, { target: { value: 'Updated Text' } });

    expect(mockOnInputChange).toHaveBeenCalledTimes(1);
  });
});