import { describe, it, expect } from 'vitest';
import { getRandomInt, clamp } from './math';
import { shuffleArray } from './shuffle';
import { generateId } from './ids';
import { validateQuestion } from './validation';
import type { Question } from '../types';

describe('math utilities', () => {
  it('getRandomInt generates numbers within range', () => {
    for (let i = 0; i < 50; i++) {
      const val = getRandomInt(5, 10);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThanOrEqual(10);
    }
  });

  it('getRandomInt works when min equals max', () => {
    expect(getRandomInt(7, 7)).toBe(7);
  });

  it('getRandomInt throws when min > max', () => {
    expect(() => getRandomInt(10, 5)).toThrow();
  });

  it('clamp restricts values to min and max', () => {
    expect(clamp(2, 5, 10)).toBe(5);
    expect(clamp(7, 5, 10)).toBe(7);
    expect(clamp(15, 5, 10)).toBe(10);
  });
});

describe('shuffle utilities', () => {
  it('shuffleArray keeps all items and preserves length without mutating source', () => {
    const original = [1, 2, 3, 4, 5];
    const originalCopy = [...original];
    const shuffled = shuffleArray(original);

    expect(original).toEqual(originalCopy);
    expect(shuffled).toHaveLength(original.length);
    expect(new Set(shuffled)).toEqual(new Set(original));
  });
});

describe('ids utilities', () => {
  it('generates unique IDs with optional prefix', () => {
    const id1 = generateId('q');
    const id2 = generateId('q');
    expect(id1.startsWith('q_')).toBe(true);
    expect(id2.startsWith('q_')).toBe(true);
    expect(id1).not.toBe(id2);
  });
});

describe('validation utilities', () => {
  const validQuestion: Question = {
    id: 'test_1',
    operation: 'multiplication',
    firstOperand: 7,
    secondOperand: 8,
    displayText: '7 × 8 = ?',
    correctAnswer: 56,
    choices: [48, 54, 56, 64],
    difficulty: 2,
    source: 'regular',
  };

  it('validates a compliant question', () => {
    expect(validateQuestion(validQuestion)).toBe(true);
  });

  it('rejects question when correctAnswer does not match operation', () => {
    const invalid = { ...validQuestion, correctAnswer: 99 };
    expect(validateQuestion(invalid)).toBe(false);
  });

  it('rejects question with fewer or more than 4 choices', () => {
    const invalid = { ...validQuestion, choices: [48, 54, 56] };
    expect(validateQuestion(invalid)).toBe(false);
  });

  it('rejects question with duplicate choices', () => {
    const invalid = { ...validQuestion, choices: [56, 56, 48, 54] };
    expect(validateQuestion(invalid)).toBe(false);
  });

  it('rejects question where correct answer is missing from choices', () => {
    const invalid = { ...validQuestion, choices: [10, 20, 30, 40] };
    expect(validateQuestion(invalid)).toBe(false);
  });

  it('rejects division by zero', () => {
    const invalid: Question = {
      id: 'div_0',
      operation: 'division',
      firstOperand: 0,
      secondOperand: 0,
      displayText: '0 ÷ 0 = ?',
      correctAnswer: 0,
      choices: [0, 1, 2, 3],
      difficulty: 1,
      source: 'regular',
    };
    expect(validateQuestion(invalid)).toBe(false);
  });
});
