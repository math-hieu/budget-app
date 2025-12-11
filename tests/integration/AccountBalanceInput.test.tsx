import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountBalanceInput from '@/components/AccountBalanceInput';

describe('AccountBalanceInput Component', () => {
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with initial balance', () => {
    render(<AccountBalanceInput initialBalance={1000.5} onSave={mockOnSave} />);

    const input = screen.getByLabelText('Balance');
    expect(input).toHaveValue('1000.50');
  });

  it('should submit valid input', async () => {
    mockOnSave.mockResolvedValue(undefined);

    render(<AccountBalanceInput initialBalance={0} onSave={mockOnSave} />);

    const input = screen.getByLabelText('Balance');
    const submitButton = screen.getByRole('button', { name: /save/i });

    // Type new balance
    await userEvent.clear(input);
    await userEvent.type(input, '2500.75');

    // Submit form
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(2500.75);
    });
  });

  it('should handle currency formatted input', async () => {
    mockOnSave.mockResolvedValue(undefined);

    render(<AccountBalanceInput initialBalance={0} onSave={mockOnSave} />);

    const input = screen.getByLabelText('Balance');
    const submitButton = screen.getByRole('button', { name: /save/i });

    // Type formatted currency
    await userEvent.clear(input);
    await userEvent.type(input, '$1,234.56');

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(1234.56);
    });
  });

  it('should accept negative balance (overdraft)', async () => {
    mockOnSave.mockResolvedValue(undefined);

    render(<AccountBalanceInput initialBalance={0} onSave={mockOnSave} />);

    const input = screen.getByLabelText('Balance');
    const submitButton = screen.getByRole('button', { name: /save/i });

    await userEvent.clear(input);
    await userEvent.type(input, '-500');

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(-500);
    });
  });

  it('should show validation error for invalid input', async () => {
    render(<AccountBalanceInput initialBalance={0} onSave={mockOnSave} />);

    const input = screen.getByLabelText('Balance');
    const submitButton = screen.getByRole('button', { name: /save/i });

    await userEvent.clear(input);
    await userEvent.type(input, 'invalid');

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('Please enter a valid amount').length).toBeGreaterThan(0);
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should clear error message when input changes', async () => {
    render(<AccountBalanceInput initialBalance={0} onSave={mockOnSave} />);

    const input = screen.getByLabelText('Balance');
    const submitButton = screen.getByRole('button', { name: /save/i });

    // Submit invalid input
    await userEvent.clear(input);
    await userEvent.type(input, 'invalid');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('Please enter a valid amount').length).toBeGreaterThan(0);
    });

    // Type new input - this should clear the error
    await userEvent.clear(input);
    await userEvent.type(input, '1');

    await waitFor(() => {
      expect(screen.queryAllByText('Please enter a valid amount').length).toBe(0);
    });
  });

  it('should handle API errors', async () => {
    mockOnSave.mockRejectedValue(new Error('Network error'));

    render(<AccountBalanceInput initialBalance={0} onSave={mockOnSave} />);

    const input = screen.getByLabelText('Balance');
    const submitButton = screen.getByRole('button', { name: /save/i });

    await userEvent.clear(input);
    await userEvent.type(input, '1000');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('Network error').length).toBeGreaterThan(0);
    });
  });

  it('should disable input and button while loading', () => {
    render(<AccountBalanceInput initialBalance={1000} onSave={mockOnSave} loading={true} />);

    const input = screen.getByLabelText('Balance');
    const submitButton = screen.getByRole('button', { name: /save/i });

    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('should disable input and button while saving', async () => {
    let resolveSave: () => void;
    const savePromise = new Promise<void>((resolve) => {
      resolveSave = resolve;
    });
    mockOnSave.mockReturnValue(savePromise);

    render(<AccountBalanceInput initialBalance={0} onSave={mockOnSave} />);

    const input = screen.getByLabelText('Balance');
    const submitButton = screen.getByRole('button', { name: /save/i });

    await userEvent.clear(input);
    await userEvent.type(input, '1000');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /saving.../i })).toBeInTheDocument();
    });

    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();

    // Resolve save
    resolveSave!();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });
  });

  it('should accept zero balance', async () => {
    mockOnSave.mockResolvedValue(undefined);

    render(<AccountBalanceInput initialBalance={100} onSave={mockOnSave} />);

    const input = screen.getByLabelText('Balance');
    const submitButton = screen.getByRole('button', { name: /save/i });

    await userEvent.clear(input);
    await userEvent.type(input, '0');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(0);
    });
  });

  it('should handle decimal amounts correctly', async () => {
    mockOnSave.mockResolvedValue(undefined);

    render(<AccountBalanceInput initialBalance={0} onSave={mockOnSave} />);

    const input = screen.getByLabelText('Balance');
    const submitButton = screen.getByRole('button', { name: /save/i });

    await userEvent.clear(input);
    await userEvent.type(input, '1234.56');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(1234.56);
    });
  });
});
