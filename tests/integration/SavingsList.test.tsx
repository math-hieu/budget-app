import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SavingsList from '@/components/SavingsList';

describe('SavingsList Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const mockSavings = [
    { id: '1', name: 'Emergency Fund', amount: 1000 },
    { id: '2', name: 'Vacation', amount: 500 },
    { id: '3', name: 'New Car', amount: 2500 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render list of savings', () => {
    render(
      <SavingsList
        savings={mockSavings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('1') && content.includes('000,00') && content.includes('€') && !content.includes('4'))).toBeInTheDocument();
    expect(screen.getByText('Vacation')).toBeInTheDocument();
    expect(screen.getByText((content) => content === '500,00 €' || content.replace(/\s/g, ' ') === '500,00 €')).toBeInTheDocument();
    expect(screen.getByText('New Car')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('2') && content.includes('500,00') && content.includes('€'))).toBeInTheDocument();
  });

  it('should display total sum of all savings', () => {
    render(
      <SavingsList
        savings={mockSavings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Total: 1000 + 500 + 2500 = 4000
    expect(screen.getByText(/total:/i)).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('4') && content.includes('000,00') && content.includes('€'))).toBeInTheDocument();
  });

  it('should render empty state when no savings', () => {
    render(
      <SavingsList
        savings={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/no virtual savings/i)).toBeInTheDocument();
    // Empty state doesn't show total
    expect(screen.queryByText(/total:/i)).not.toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    render(
      <SavingsList
        savings={mockSavings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await userEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockSavings[0]);
  });

  it('should call onDelete when delete button is clicked', async () => {
    render(
      <SavingsList
        savings={mockSavings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await userEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockSavings[0].id);
  });

  it('should display loading state', () => {
    render(
      <SavingsList
        savings={mockSavings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        loading={true}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should disable edit and delete buttons during loading', () => {
    render(
      <SavingsList
        savings={mockSavings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        loading={true}
      />
    );

    const editButtons = screen.queryAllByRole('button', { name: /edit/i });
    const deleteButtons = screen.queryAllByRole('button', { name: /delete/i });

    editButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });

    deleteButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should render each saving with correct amount formatting', () => {
    const savings = [
      { id: '1', name: 'Test 1', amount: 0 },
      { id: '2', name: 'Test 2', amount: 0.99 },
      { id: '3', name: 'Test 3', amount: 999999.99 },
    ];

    render(
      <SavingsList
        savings={savings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText((content) => content.includes('0,00') && content.includes('€'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('0,99') && content.includes('€'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('999') && content.includes('999,99') && content.includes('€'))).toBeInTheDocument();
  });

  it('should show individual edit and delete buttons for each item', () => {
    render(
      <SavingsList
        savings={mockSavings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('should calculate total correctly with decimal amounts', () => {
    const savings = [
      { id: '1', name: 'Test 1', amount: 100.50 },
      { id: '2', name: 'Test 2', amount: 200.75 },
      { id: '3', name: 'Test 3', amount: 50.25 },
    ];

    render(
      <SavingsList
        savings={savings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Total: 100.50 + 200.75 + 50.25 = 351.50
    expect(screen.getByText((content) => content.includes('351,50') && content.includes('€'))).toBeInTheDocument();
  });
});
