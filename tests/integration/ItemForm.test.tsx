import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ItemForm from '@/components/ItemForm';

describe('ItemForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty form for new item', () => {
    render(
      <ItemForm
        nameLabel="Category Name"
        amountLabel="Amount"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes).toHaveLength(2);
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should render form with initial values for editing', () => {
    render(
      <ItemForm
        nameLabel="Category Name"
        amountLabel="Amount"
        initialName="Emergency Fund"
        initialAmount={1000}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes[0]).toHaveValue('Emergency Fund');
    expect(textboxes[1]).toHaveValue('1000.00');
  });

  it('should validate name is required', async () => {
    render(
      <ItemForm
        nameLabel="Category Name"
        amountLabel="Amount"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /save/i });
    const textboxes = screen.getAllByRole('textbox');

    // Submit without filling name, only amount
    await userEvent.type(textboxes[1], '1000');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should validate amount is required', async () => {
    render(
      <ItemForm
        nameLabel="Category Name"
        amountLabel="Amount"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /save/i });
    const textboxes = screen.getAllByRole('textbox');

    // Submit without filling amount, only name
    await userEvent.type(textboxes[0], 'Emergency Fund');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should accept negative amounts (for withdrawals)', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ItemForm
        nameLabel="Category Name"
        amountLabel="Amount"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const textboxes = screen.getAllByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /save/i });

    await userEvent.type(textboxes[0], 'Withdrawal');
    await userEvent.type(textboxes[1], '-100');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Withdrawal',
        amount: -100,
      });
    });
  });

  it('should submit valid form data', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ItemForm
        nameLabel="Category Name"
        amountLabel="Amount"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const textboxes = screen.getAllByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /save/i });

    await userEvent.type(textboxes[0], 'Emergency Fund');
    await userEvent.type(textboxes[1], '1000');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Emergency Fund',
        amount: 1000,
      });
    });
  });

  it('should handle cancel button', async () => {
    render(
      <ItemForm
        nameLabel="Category Name"
        amountLabel="Amount"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should disable form while submitting', async () => {
    let resolveSubmit: () => void;
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
    mockOnSubmit.mockReturnValue(submitPromise);

    render(
      <ItemForm
        nameLabel="Category Name"
        amountLabel="Amount"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const textboxes = screen.getAllByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /save/i });

    await userEvent.type(textboxes[0], 'Test');
    await userEvent.type(textboxes[1], '1000');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /saving.../i })).toBeDisabled();
    });

    expect(textboxes[0]).toBeDisabled();
    expect(textboxes[1]).toBeDisabled();

    resolveSubmit!();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).not.toBeDisabled();
    });
  });

  it('should display error message on submit failure', async () => {
    mockOnSubmit.mockRejectedValue(new Error('Server error'));

    render(
      <ItemForm
        nameLabel="Category Name"
        amountLabel="Amount"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const textboxes = screen.getAllByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /save/i });

    await userEvent.type(textboxes[0], 'Test');
    await userEvent.type(textboxes[1], '1000');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText(/Server error/i).length).toBeGreaterThan(0);
    });
  });

  it('should accept zero amount', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ItemForm
        nameLabel="Category Name"
        amountLabel="Amount"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const textboxes = screen.getAllByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /save/i });

    await userEvent.type(textboxes[0], 'Test');
    await userEvent.type(textboxes[1], '0');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test',
        amount: 0,
      });
    });
  });

  it('should trim whitespace from name', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ItemForm
        nameLabel="Category Name"
        amountLabel="Amount"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const textboxes = screen.getAllByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /save/i });

    await userEvent.type(textboxes[0], '  Emergency Fund  ');
    await userEvent.type(textboxes[1], '1000');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Emergency Fund',
        amount: 1000,
      });
    });
  });
});
