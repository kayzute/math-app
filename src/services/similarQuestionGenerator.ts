import type { MistakePattern, Question, MathOperation } from '../types';
import { generateDistractors } from './questionGenerator';
import { generateId, shuffleArray, validateQuestion } from '../utils';

export function generateSimilarQuestion(pattern: MistakePattern): Question {
  const {
    operation,
    firstOperand: a,
    secondOperand: b,
    correctAnswer,
    difficulty,
  } = pattern;

  // Decide strategy
  const strategies: Array<'nearby' | 'reversed' | 'fact-family'> = ['nearby'];
  if (operation === 'addition' || operation === 'multiplication') {
    strategies.push('reversed');
  }
  strategies.push('fact-family');

  const strategy = strategies[Math.floor(Math.random() * strategies.length)];

  let newOp: MathOperation = operation;
  let newA = a;
  let newB = b;
  let newAns = correctAnswer;
  let symbol = '+';

  if (
    strategy === 'reversed' &&
    (operation === 'addition' || operation === 'multiplication')
  ) {
    newA = b;
    newB = a;
    newAns = correctAnswer;
    symbol = operation === 'addition' ? '+' : '×';
  } else if (strategy === 'fact-family') {
    if (operation === 'multiplication' && a > 0 && b > 0) {
      newOp = 'division';
      newA = correctAnswer;
      newB = Math.random() < 0.5 ? a : b;
      newAns = newA / newB;
      symbol = '÷';
    } else if (operation === 'division') {
      newOp = 'multiplication';
      newA = correctAnswer;
      newB = b;
      newAns = newA * newB;
      symbol = '×';
    } else if (operation === 'addition') {
      newOp = 'subtraction';
      newA = correctAnswer;
      newB = Math.random() < 0.5 ? a : b;
      newAns = newA - newB;
      symbol = '−';
    } else if (operation === 'subtraction') {
      newOp = 'addition';
      newA = correctAnswer;
      newB = b;
      newAns = newA + newB;
      symbol = '+';
    }
  } else {
    // 'nearby' numbers
    const offset = Math.random() < 0.5 ? 1 : -1;
    if (Math.random() < 0.5) {
      newA = Math.max(0, a + offset);
    } else {
      newB = Math.max(0, b + offset);
    }

    if (operation === 'addition') {
      newAns = newA + newB;
      symbol = '+';
    } else if (operation === 'subtraction') {
      if (newA < newB) {
        const temp = newA;
        newA = newB;
        newB = temp;
      }
      newAns = newA - newB;
      symbol = '−';
    } else if (operation === 'multiplication') {
      newAns = newA * newB;
      symbol = '×';
    } else if (operation === 'division') {
      newB = Math.max(1, newB);
      const quotient = Math.max(1, correctAnswer + offset);
      newA = newB * quotient;
      newAns = quotient;
      symbol = '÷';
    }
  }

  // Symbol cleanup for display
  const displaySymbol =
    newOp === 'addition'
      ? '+'
      : newOp === 'subtraction'
        ? '-'
        : newOp === 'multiplication'
          ? '×'
          : '÷';

  const rawProblem = {
    operation: newOp,
    firstOperand: newA,
    secondOperand: newB,
    displayText: `${newA} ${displaySymbol} ${newB} = ?`,
    correctAnswer: newAns,
    symbol,
  };

  const distractors = generateDistractors(rawProblem, difficulty);
  const choices = shuffleArray([newAns, ...distractors]);

  const question: Question = {
    id: generateId(`q_rev_${newOp}`),
    operation: newOp,
    firstOperand: newA,
    secondOperand: newB,
    displayText: rawProblem.displayText,
    correctAnswer: newAns,
    choices,
    difficulty,
    source: 'mistake-review',
    mistakePatternId: pattern.id,
  };

  if (validateQuestion(question)) {
    return question;
  }

  // Fallback if random variation produced invalid edge case:
  // Use exact pattern numbers with reversed or direct calculation
  const fallbackChoices = shuffleArray([
    correctAnswer,
    correctAnswer + 1,
    Math.max(0, correctAnswer - 1),
    correctAnswer + 2,
  ]);
  return {
    id: generateId('q_rev_fallback'),
    operation,
    firstOperand: a,
    secondOperand: b,
    displayText: `${a} ${operation === 'addition' ? '+' : operation === 'subtraction' ? '-' : operation === 'multiplication' ? '×' : '÷'} ${b} = ?`,
    correctAnswer,
    choices: Array.from(new Set(fallbackChoices)).slice(0, 4),
    difficulty,
    source: 'mistake-review',
    mistakePatternId: pattern.id,
  };
}
