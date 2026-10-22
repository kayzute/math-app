import React from 'react';
import { Button } from '../common';

export interface AnswerChoiceProps {
  choice: number;
  index: number;
  isSelected: boolean;
  disabled?: boolean;
  onSelect: (choice: number) => void;
}

export const AnswerChoice: React.FC<AnswerChoiceProps> = ({
  choice,
  index,
  isSelected,
  disabled = false,
  onSelect,
}) => {
  const keyboardKey = index + 1; // 1 to 4

  return (
    <Button
      type="button"
      variant="choice"
      isSelected={isSelected}
      disabled={disabled}
      onClick={() => onSelect(choice)}
      className="choice-btn"
      aria-label={`Choice ${keyboardKey}: ${choice}${isSelected ? ', selected' : ''}`}
    >
      <span className="choice-badge" aria-hidden="true">
        {keyboardKey}
      </span>
      <span className="choice-val">{choice}</span>
    </Button>
  );
};

export default AnswerChoice;
