import { describe, it, expect } from 'vitest';
import { generateSimilarQuestion } from './similarQuestionGenerator';
import { validateQuestion } from '../utils';
import type { MistakePattern } from '../types';

describe('similarQuestionGenerator', () => {
  const pattern: MistakePattern = {
    id: 'm_mult_1',
    operation: 'multiplication',
    firstOperand: 6,
    secondOperand: 7,
    correctAnswer: 42,
    difficulty: 2,
    incorrectCount: 2,
    similarCorrectCount: 0,
    lastIncorrectAt: new Date().toISOString(),
    mastered: false,
  };

  it('generates a valid question from a multiplication mistake pattern', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateSimilarQuestion(pattern);
      expect(validateQuestion(q)).toBe(true);
      expect(q.source).toBe('mistake-review');
      expect(q.mistakePatternId).toBe(pattern.id);
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices).size).toBe(4);
      expect(q.choices).toContain(q.correctAnswer);
    }
  });

  it('generates a valid question from an addition mistake pattern', () => {
    const addPattern: MistakePattern = {
      id: 'm_add_1',
      operation: 'addition',
      firstOperand: 8,
      secondOperand: 9,
      correctAnswer: 17,
      difficulty: 1,
      incorrectCount: 1,
      similarCorrectCount: 0,
      lastIncorrectAt: new Date().toISOString(),
      mastered: false,
    };

    for (let i = 0; i < 20; i++) {
      const q = generateSimilarQuestion(addPattern);
      expect(validateQuestion(q)).toBe(true);
      expect(q.source).toBe('mistake-review');
    }
  });

  it('generates a valid question from a division mistake pattern', () => {
    const divPattern: MistakePattern = {
      id: 'm_div_1',
      operation: 'division',
      firstOperand: 36,
      secondOperand: 6,
      correctAnswer: 6,
      difficulty: 2,
      incorrectCount: 3,
      similarCorrectCount: 1,
      lastIncorrectAt: new Date().toISOString(),
      mastered: false,
    };

    for (let i = 0; i < 20; i++) {
      const q = generateSimilarQuestion(divPattern);
      expect(validateQuestion(q)).toBe(true);
      expect(q.source).toBe('mistake-review');
    }
  });
});
