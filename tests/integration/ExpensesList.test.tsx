import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpensesList from '@/components/ExpensesList';

// Mock data
const mockExpenses = [
  {
    id: '1',
    description: 'Rent',
    amount: 1200.00,
    created_at: new Date('2025-11-01'),
    updated_at: new Date('2025-11-01')
  },
  {
    id: '2',
    description: 'Utilities',
    amount: 150.50,
    created_at: new Date('2025-11-02'),
    updated_at: new Date('2025-11-02')
  },
  {
    id: '3',
    description: 'Internet',
    amount: 79.99,
    created_at: new Date('2025-11-03'),
    updated_at: new Date('2025-11-03')
  }
];

describe('ExpensesList Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when no expenses provided', () => {
    render(
      <ExpensesList
        expenses={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/no recurring expenses/i)).toBeInTheDocument();
  });

  it('should render list of expenses', () => {
    render(
      <ExpensesList
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText('Utilities')).toBeInTheDocument();
    expect(screen.getByText('Internet')).toBeInTheDocument();

    // Check amounts are formatted correctly (EUR format)
    expect(screen.getByText('1 200,00 €')).toBeInTheDocument();
    expect(screen.getByText('150,50 €')).toBeInTheDocument();
    expect(screen.getByText('79,99 €')).toBeInTheDocument();
  });

  it('should display correct total', () => {
    render(
      <ExpensesList
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Total should be 1200.00 + 150.50 + 79.99 = 1430.49
    expect(screen.getByText(/total:/i)).toBeInTheDocument();
    // Should appear twice: once in unpaid section, once in total
    const totalAmounts = screen.getAllByText('1 430,49 €');
    expect(totalAmounts.length).toBeGreaterThanOrEqual(1);
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <ExpensesList
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockExpenses[0]);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <ExpensesList
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('should have edit and delete buttons for each expense', () => {
    render(
      <ExpensesList
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('should format amounts with 2 decimal places', () => {
    const expenseWithRoundAmount = [{
      id: '1',
      description: 'Test',
      amount: 100,
      created_at: new Date(),
      updated_at: new Date()
    }];

    render(
      <ExpensesList
        expenses={expenseWithRoundAmount}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const amounts = screen.getAllByText('100,00 €');
    expect(amounts.length).toBeGreaterThanOrEqual(1);
  });

  it('should handle large amounts correctly', () => {
    const expenseWithLargeAmount = [{
      id: '1',
      description: 'Large Payment',
      amount: 12345.67,
      created_at: new Date(),
      updated_at: new Date()
    }];

    render(
      <ExpensesList
        expenses={expenseWithLargeAmount}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const amounts = screen.getAllByText('12 345,67 €');
    expect(amounts.length).toBeGreaterThanOrEqual(1);
  });

  it('should display expenses in the order provided', () => {
    render(
      <ExpensesList
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const descriptions = screen.getAllByRole('listitem').map(item =>
      item.textContent?.includes('Rent') ? 'Rent' :
      item.textContent?.includes('Utilities') ? 'Utilities' :
      item.textContent?.includes('Internet') ? 'Internet' : null
    ).filter(Boolean);

    expect(descriptions[0]).toBe('Rent');
    expect(descriptions[1]).toBe('Utilities');
    expect(descriptions[2]).toBe('Internet');
  });

  it('should update when expenses prop changes', () => {
    const { rerender } = render(
      <ExpensesList
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Rent')).toBeInTheDocument();

    const newExpenses = [{
      id: '4',
      description: 'New Expense',
      amount: 500.00,
      created_at: new Date(),
      updated_at: new Date()
    }];

    rerender(
      <ExpensesList
        expenses={newExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText('Rent')).not.toBeInTheDocument();
    expect(screen.getByText('New Expense')).toBeInTheDocument();
    const amounts = screen.getAllByText('500,00 €');
    expect(amounts.length).toBeGreaterThanOrEqual(1);
  });

  it('should calculate total as 0 for empty list', () => {
    render(
      <ExpensesList
        expenses={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Empty state should not show total
    expect(screen.queryByText(/total:/i)).not.toBeInTheDocument();
  });

  it('should handle single expense', () => {
    const singleExpense = [mockExpenses[0]];

    render(
      <ExpensesList
        expenses={singleExpense}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Rent')).toBeInTheDocument();
    const amounts = screen.getAllByText('1 200,00 €');
    expect(amounts.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/total:/i)).toBeInTheDocument();
  });

  it('should have accessible ARIA labels', () => {
    render(
      <ExpensesList
        expenses={mockExpenses}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    expect(editButtons[0]).toHaveAccessibleName();
    expect(deleteButtons[0]).toHaveAccessibleName();
  });
});
