import type { Question } from '../types';

/**
 * Validates that a generated Question object conforms to specification requirements.
 */
export function validateQuestion(question: Question): boolean {
  if (!question || typeof question !== 'object') {
    return false;
  }

  // Operation check
  const validOps = ['addition', 'subtraction', 'multiplication', 'division'];
  if (!validOps.includes(question.operation)) {
    return false;
  }

  // Difficulty check
  if (![1, 2, 3, 4].includes(question.difficulty)) {
    return false;
  }

  // Division by zero check & integer division check
  if (question.operation === 'division') {
    if (question.secondOperand === 0) {
      return false;
    }
    if (!Number.isInteger(question.correctAnswer)) {
      return false;
    }
    if (
      question.firstOperand !==
      question.secondOperand * question.correctAnswer
    ) {
      return false;
    }
  }

  // Subtraction non-negative check for levels 1-3
  if (question.operation === 'subtraction' && question.difficulty < 4) {
    if (question.correctAnswer < 0) {
      return false;
    }
  }

  // Answer correctness check
  let calculatedAnswer: number;
  switch (question.operation) {
    case 'addition':
      calculatedAnswer = question.firstOperand + question.secondOperand;
      break;
    case 'subtraction':
      calculatedAnswer = question.firstOperand - question.secondOperand;
      break;
    case 'multiplication':
      calculatedAnswer = question.firstOperand * question.secondOperand;
      break;
    case 'division':
      calculatedAnswer = question.firstOperand / question.secondOperand;
      break;
  }

  if (calculatedAnswer !== question.correctAnswer) {
    return false;
  }

  // Choices check: exactly 4 choices
  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
    return false;
  }

  // Unique choices check
  const uniqueChoices = new Set(question.choices);
  if (uniqueChoices.size !== 4) {
    return false;
  }

  // Correct answer must be among choices
  if (!uniqueChoices.has(question.correctAnswer)) {
    return false;
  }

  // Avoid negative choices if difficulty does not permit negative answers
  if (question.difficulty < 4 && question.choices.some((c) => c < 0)) {
    return false;
  }

  return true;
}
