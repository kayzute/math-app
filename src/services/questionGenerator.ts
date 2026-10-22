import type { MathOperation, DifficultyLevel, Question } from '../types';
import {
  getRandomInt,
  shuffleArray,
  generateId,
  validateQuestion,
} from '../utils';

interface RawProblem {
  operation: MathOperation;
  firstOperand: number;
  secondOperand: number;
  displayText: string;
  correctAnswer: number;
  symbol: string;
}

/**
 * Generates addition operands and answer based on difficulty level.
 */
export function generateAdditionProblem(
  difficulty: DifficultyLevel,
): RawProblem {
  let first: number;
  let second: number;

  switch (difficulty) {
    case 1: {
      // Numbers from 0 to 10, results no greater than 20
      first = getRandomInt(0, 10);
      second = getRandomInt(0, Math.min(10, 20 - first));
      break;
    }
    case 2: {
      // Numbers from 0 to 50, results no greater than 100
      first = getRandomInt(5, 50);
      second = getRandomInt(0, Math.min(50, 100 - first));
      break;
    }
    case 3: {
      // Numbers from 0 to 100, may include carrying
      first = getRandomInt(10, 99);
      second = getRandomInt(10, 99);
      break;
    }
    case 4:
    default: {
      // Numbers up to 1,000, multiple-digit addition
      first = getRandomInt(100, 999);
      second = getRandomInt(50, 999);
      break;
    }
  }

  const correctAnswer = first + second;
  return {
    operation: 'addition',
    firstOperand: first,
    secondOperand: second,
    displayText: `${first} + ${second} = ?`,
    correctAnswer,
    symbol: '+',
  };
}

/**
 * Generates subtraction operands and answer based on difficulty level.
 * Guarantees firstOperand >= secondOperand to prevent negative results.
 */
export function generateSubtractionProblem(
  difficulty: DifficultyLevel,
): RawProblem {
  let first: number;
  let second: number;

  switch (difficulty) {
    case 1: {
      // Numbers from 0 to 10, no negative answers
      first = getRandomInt(1, 10);
      second = getRandomInt(0, first);
      break;
    }
    case 2: {
      // Numbers from 0 to 50, no negative answers
      first = getRandomInt(10, 50);
      second = getRandomInt(0, first);
      break;
    }
    case 3: {
      // Numbers from 0 to 100, may include borrowing
      first = getRandomInt(20, 100);
      second = getRandomInt(10, first);
      break;
    }
    case 4:
    default: {
      // Numbers up to 1,000, multiple-digit subtraction
      first = getRandomInt(100, 999);
      second = getRandomInt(20, first);
      break;
    }
  }

  const correctAnswer = first - second;
  return {
    operation: 'subtraction',
    firstOperand: first,
    secondOperand: second,
    displayText: `${first} - ${second} = ?`,
    correctAnswer,
    symbol: '-',
  };
}

/**
 * Generates multiplication operands and product based on difficulty level.
 */
export function generateMultiplicationProblem(
  difficulty: DifficultyLevel,
): RawProblem {
  let first: number;
  let second: number;

  switch (difficulty) {
    case 1: {
      // Factors from 0 to 5
      first = getRandomInt(0, 5);
      second = getRandomInt(0, 5);
      break;
    }
    case 2: {
      // Factors from 0 to 10
      first = getRandomInt(1, 10);
      second = getRandomInt(1, 10);
      break;
    }
    case 3: {
      // 1-digit by 1-digit, or 1-digit by 2-digit
      if (Math.random() < 0.5) {
        first = getRandomInt(2, 9);
        second = getRandomInt(11, 20);
      } else {
        first = getRandomInt(6, 12);
        second = getRandomInt(6, 12);
      }
      break;
    }
    case 4:
    default: {
      // Two-digit by one-digit or two-digit by two-digit
      if (Math.random() < 0.6) {
        first = getRandomInt(12, 99);
        second = getRandomInt(3, 9);
      } else {
        first = getRandomInt(11, 40);
        second = getRandomInt(11, 25);
      }
      break;
    }
  }

  const correctAnswer = first * second;
  return {
    operation: 'multiplication',
    firstOperand: first,
    secondOperand: second,
    displayText: `${first} × ${second} = ?`,
    correctAnswer,
    symbol: '×',
  };
}

/**
 * Generates division problem with whole-number quotient and non-zero divisor.
 * Dividend is calculated as divisor * quotient.
 */
export function generateDivisionProblem(
  difficulty: DifficultyLevel,
): RawProblem {
  let divisor: number;
  let quotient: number;

  switch (difficulty) {
    case 1: {
      // Divisors from 1 to 5, whole-number answers only
      divisor = getRandomInt(1, 5);
      quotient = getRandomInt(1, 5);
      break;
    }
    case 2: {
      // Divisors from 1 to 10, whole-number answers only
      divisor = getRandomInt(2, 10);
      quotient = getRandomInt(1, 10);
      break;
    }
    case 3: {
      // Divisors from 1 to 12, dividends up to 144
      divisor = getRandomInt(2, 12);
      const maxQuotient = Math.floor(144 / divisor);
      quotient = getRandomInt(1, Math.min(12, maxQuotient));
      break;
    }
    case 4:
    default: {
      // Larger dividends, one-digit or two-digit divisors
      divisor = getRandomInt(3, 20);
      quotient = getRandomInt(5, 50);
      break;
    }
  }

  const dividend = divisor * quotient;
  return {
    operation: 'division',
    firstOperand: dividend,
    secondOperand: divisor,
    displayText: `${dividend} ÷ ${divisor} = ?`,
    correctAnswer: quotient,
    symbol: '÷',
  };
}

/**
 * Generates 3 unique, plausible distractors for the given problem and difficulty.
 */
export function generateDistractors(
  problem: RawProblem,
  difficulty: DifficultyLevel,
): number[] {
  const {
    operation,
    firstOperand: a,
    secondOperand: b,
    correctAnswer,
  } = problem;
  const distractors = new Set<number>();

  // Helper candidate collectors
  const candidates: number[] = [];

  // 1. Operation-specific distractors
  if (operation === 'addition') {
    candidates.push(correctAnswer + 1, correctAnswer - 1);
    candidates.push(correctAnswer + 10, correctAnswer - 10);
    candidates.push(correctAnswer + 2, correctAnswer - 2);
    candidates.push(Math.abs(a - b)); // subtraction mistake
    if (a > 9 || b > 9) {
      // carrying mistake (e.g. forgot to carry 10)
      candidates.push(correctAnswer - 10);
    }
  } else if (operation === 'subtraction') {
    candidates.push(correctAnswer + 1, correctAnswer - 1);
    candidates.push(correctAnswer + 10, correctAnswer - 10);
    candidates.push(correctAnswer + 2, correctAnswer - 2);
    if (difficulty >= 2) {
      candidates.push(a + b); // added instead of subtracted
    }
  } else if (operation === 'multiplication') {
    candidates.push((a + 1) * b);
    if (a > 1) candidates.push((a - 1) * b);
    candidates.push(a * (b + 1));
    if (b > 1) candidates.push(a * (b - 1));
    candidates.push(correctAnswer + a);
    candidates.push(correctAnswer - a);
    candidates.push(correctAnswer + b);
    candidates.push(correctAnswer - b);
    candidates.push(correctAnswer + 2, correctAnswer - 2);
    candidates.push(correctAnswer + 10, correctAnswer - 10);
  } else if (operation === 'division') {
    candidates.push(correctAnswer + 1);
    if (correctAnswer > 1) candidates.push(correctAnswer - 1);
    candidates.push(correctAnswer + 2);
    if (correctAnswer > 2) candidates.push(correctAnswer - 2);
    candidates.push(b); // confused quotient with divisor
    candidates.push(correctAnswer + 10);
  }

  // Shuffle candidate pool
  const shuffledCandidates = shuffleArray(candidates);

  for (const cand of shuffledCandidates) {
    if (distractors.size >= 3) break;
    if (cand !== correctAnswer && !distractors.has(cand)) {
      if (difficulty < 4 && cand < 0) continue;
      distractors.add(cand);
    }
  }

  // If still need distractors, generate bounded nearby offsets
  let offset = 1;
  let attempts = 0;
  while (distractors.size < 3 && attempts < 40) {
    attempts += 1;
    const sign = attempts % 2 === 0 ? 1 : -1;
    const candidate = correctAnswer + sign * offset;
    offset += Math.floor(attempts / 4) + 1;

    if (candidate !== correctAnswer && !distractors.has(candidate)) {
      if (difficulty < 4 && candidate < 0) {
        continue;
      }
      distractors.add(candidate);
    }
  }

  // Absolute safety guarantee for 3 unique distractors
  let fallbackVal = Math.max(0, correctAnswer) + 1;
  while (distractors.size < 3) {
    if (fallbackVal !== correctAnswer && !distractors.has(fallbackVal)) {
      distractors.add(fallbackVal);
    }
    fallbackVal += 1;
  }

  return Array.from(distractors).slice(0, 3);
}

/**
 * Main Question Generator function.
 * Generates a valid question for the specified operation and difficulty level.
 */
export function generateQuestion(
  operation: MathOperation,
  difficulty: DifficultyLevel = 1,
): Question {
  const maxRetries = 10;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    let problem: RawProblem;
    switch (operation) {
      case 'addition':
        problem = generateAdditionProblem(difficulty);
        break;
      case 'subtraction':
        problem = generateSubtractionProblem(difficulty);
        break;
      case 'multiplication':
        problem = generateMultiplicationProblem(difficulty);
        break;
      case 'division':
        problem = generateDivisionProblem(difficulty);
        break;
      default:
        problem = generateAdditionProblem(difficulty);
        break;
    }

    const distractors = generateDistractors(problem, difficulty);
    const choices = shuffleArray([problem.correctAnswer, ...distractors]);

    const question: Question = {
      id: generateId(`q_${problem.operation}`),
      operation: problem.operation,
      firstOperand: problem.firstOperand,
      secondOperand: problem.secondOperand,
      displayText: problem.displayText,
      correctAnswer: problem.correctAnswer,
      choices,
      difficulty,
      source: 'regular',
    };

    if (validateQuestion(question)) {
      return question;
    }
  }

  // Fallback safe question if all retries failed (rare edge-case safeguard)
  const safeChoices = shuffleArray([2, 1, 3, 4]);
  return {
    id: generateId('q_fallback'),
    operation: 'addition',
    firstOperand: 1,
    secondOperand: 1,
    displayText: '1 + 1 = ?',
    correctAnswer: 2,
    choices: safeChoices,
    difficulty,
    source: 'regular',
  };
}

/**
 * Generates a question from a list of allowed operations.
 * Picks randomly among the enabled operations.
 */
export function generateQuestionForOperations(
  operations: MathOperation[],
  difficulty: DifficultyLevel = 1,
): Question {
  if (!operations || operations.length === 0) {
    return generateQuestion('addition', difficulty);
  }
  const chosenOp = operations[getRandomInt(0, operations.length - 1)];
  return generateQuestion(chosenOp, difficulty);
}
