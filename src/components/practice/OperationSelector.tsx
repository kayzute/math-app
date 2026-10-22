import React from 'react';
import type { MathOperation } from '../../types';
import './PracticeSetup.css';

interface OperationOption {
  id: MathOperation;
  label: string;
  symbol: string;
  color: string;
}

const OPERATIONS: OperationOption[] = [
  { id: 'addition', label: 'Addition', symbol: '+', color: '#3b82f6' },
  { id: 'subtraction', label: 'Subtraction', symbol: '−', color: '#10b981' },
  {
    id: 'multiplication',
    label: 'Multiplication',
    symbol: '×',
    color: '#f59e0b',
  },
  { id: 'division', label: 'Division', symbol: '÷', color: '#8b5cf6' },
];

export interface OperationSelectorProps {
  selectedOperations: MathOperation[];
  onChange: (operations: MathOperation[]) => void;
}

export const OperationSelector: React.FC<OperationSelectorProps> = ({
  selectedOperations,
  onChange,
}) => {
  const toggleOperation = (op: MathOperation) => {
    if (selectedOperations.includes(op)) {
      // Prevent deselecting the last one if user is toggling, or allow it and let validation show error
      onChange(selectedOperations.filter((o) => o !== op));
    } else {
      onChange([...selectedOperations, op]);
    }
  };

  const selectAll = () => {
    onChange(['addition', 'subtraction', 'multiplication', 'division']);
  };

  const isAllSelected = selectedOperations.length === OPERATIONS.length;

  return (
    <fieldset className="setup-section" aria-labelledby="op-legend">
      <div className="section-header">
        <legend id="op-legend" className="section-title">
          1. Choose Operations
        </legend>
        <button
          type="button"
          onClick={selectAll}
          className="select-all-btn"
          aria-label="Select all operations"
        >
          {isAllSelected ? '✓ All Selected' : 'Select All'}
        </button>
      </div>

      <div
        className="operations-grid"
        role="group"
        aria-label="Math operations"
      >
        {OPERATIONS.map((op) => {
          const isSelected = selectedOperations.includes(op.id);
          return (
            <button
              key={op.id}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              className={`op-card ${isSelected ? 'op-card--selected' : ''}`}
              onClick={() => toggleOperation(op.id)}
            >
              <span className="op-symbol" aria-hidden="true">
                {op.symbol}
              </span>
              <span className="op-label">{op.label}</span>
              <span className="op-checkbox" aria-hidden="true">
                {isSelected ? '✓' : ''}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};

export default OperationSelector;
