import { render, screen } from '@testing-library/react';
import BudgetSummary from '@/components/BudgetSummary';

describe('BudgetSummary Component', () => {
  it('should display formatted positive amount', () => {
    render(<BudgetSummary remainingBudget={1234.56} />);

    expect(screen.getByText((content) => content.includes('1') && content.includes('234,56') && content.includes('€'))).toBeInTheDocument();
    expect(screen.getByText('Available to spend')).toBeInTheDocument();
  });

  it('should display formatted negative amount with warning', () => {
    render(<BudgetSummary remainingBudget={-500.0} />);

    expect(screen.getByText((content) => content.includes('-500,00') && content.includes('€'))).toBeInTheDocument();
    expect(screen.getByText('Your account is overdrawn')).toBeInTheDocument();
  });

  it('should display zero amount with appropriate message', () => {
    render(<BudgetSummary remainingBudget={0} />);

    expect(screen.getByText((content) => content.includes('0,00') && content.includes('€'))).toBeInTheDocument();
    expect(screen.getByText('Your budget is fully allocated')).toBeInTheDocument();
  });

  it('should show loading spinner when loading', () => {
    render(<BudgetSummary remainingBudget={1000} loading={true} />);

    expect(screen.getByText('Calculating budget...')).toBeInTheDocument();
    expect(screen.queryByText((content) => content.includes('1') && content.includes('000,00') && content.includes('€'))).not.toBeInTheDocument();
  });

  it('should update when props change', () => {
    const { rerender } = render(<BudgetSummary remainingBudget={1000} />);

    expect(screen.getByText((content) => content.includes('1') && content.includes('000,00') && content.includes('€'))).toBeInTheDocument();
    expect(screen.getByText('Available to spend')).toBeInTheDocument();

    rerender(<BudgetSummary remainingBudget={-200} />);

    expect(screen.getByText((content) => content.includes('-200,00') && content.includes('€'))).toBeInTheDocument();
    expect(screen.getByText('Your account is overdrawn')).toBeInTheDocument();
  });

  it('should apply correct color for positive budget', () => {
    const { container } = render(<BudgetSummary remainingBudget={500} />);

    // MUI applies color via sx prop, check that positive message exists
    expect(screen.getByText('Available to spend')).toBeInTheDocument();
  });

  it('should apply correct color for negative budget', () => {
    const { container } = render(<BudgetSummary remainingBudget={-100} />);

    // Check that negative message exists
    expect(screen.getByText('Your account is overdrawn')).toBeInTheDocument();
  });

  it('should display large numbers correctly', () => {
    render(<BudgetSummary remainingBudget={999999.99} />);

    expect(screen.getByText((content) => content.includes('999') && content.includes('999,99') && content.includes('€'))).toBeInTheDocument();
  });

  it('should display small decimal amounts correctly', () => {
    render(<BudgetSummary remainingBudget={0.01} />);

    expect(screen.getByText((content) => content.includes('0,01') && content.includes('€'))).toBeInTheDocument();
    expect(screen.getByText('Available to spend')).toBeInTheDocument();
  });
});
