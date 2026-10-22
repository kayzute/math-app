import { describe, it, expect } from 'vitest';
import {
  generateQuestion,
  generateQuestionForOperations,
  generateAdditionProblem,
  generateSubtractionProblem,
  generateMultiplicationProblem,
  generateDivisionProblem,
  generateDistractors,
} from './questionGenerator';
import { validateQuestion } from '../utils';
import type { MathOperation, DifficultyLevel } from '../types';

describe('questionGenerator service', () => {
  const operations: MathOperation[] = [
    'addition',
    'subtraction',
    'multiplication',
    'division',
  ];
  const difficulties: DifficultyLevel[] = [1, 2, 3, 4];

  describe('operation-specific raw problem generators', () => {
    it('generates valid addition problems for all difficulties', () => {
      difficulties.forEach((diff) => {
        for (let i = 0; i < 20; i++) {
          const problem = generateAdditionProblem(diff);
          expect(problem.operation).toBe('addition');
          expect(problem.correctAnswer).toBe(
            problem.firstOperand + problem.secondOperand,
          );
          if (diff === 1) {
            expect(problem.firstOperand).toBeLessThanOrEqual(10);
            expect(problem.secondOperand).toBeLessThanOrEqual(10);
            expect(problem.correctAnswer).toBeLessThanOrEqual(20);
          } else if (diff === 2) {
            expect(problem.correctAnswer).toBeLessThanOrEqual(100);
          }
        }
      });
    });

    it('generates non-negative subtraction problems', () => {
      difficulties.forEach((diff) => {
        for (let i = 0; i < 20; i++) {
          const problem = generateSubtractionProblem(diff);
          expect(problem.operation).toBe('subtraction');
          expect(problem.firstOperand).toBeGreaterThanOrEqual(
            problem.secondOperand,
          );
          expect(problem.correctAnswer).toBeGreaterThanOrEqual(0);
          expect(problem.correctAnswer).toBe(
            problem.firstOperand - problem.secondOperand,
          );
        }
      });
    });

    it('generates multiplication problems matching difficulty levels', () => {
      difficulties.forEach((diff) => {
        for (let i = 0; i < 20; i++) {
          const problem = generateMultiplicationProblem(diff);
          expect(problem.operation).toBe('multiplication');
          expect(problem.correctAnswer).toBe(
            problem.firstOperand * problem.secondOperand,
          );
          if (diff === 1) {
            expect(problem.firstOperand).toBeLessThanOrEqual(5);
            expect(problem.secondOperand).toBeLessThanOrEqual(5);
          } else if (diff === 2) {
            expect(problem.firstOperand).toBeLessThanOrEqual(10);
            expect(problem.secondOperand).toBeLessThanOrEqual(10);
          }
        }
      });
    });

    it('generates division problems with whole-number answers and non-zero divisors', () => {
      difficulties.forEach((diff) => {
        for (let i = 0; i < 20; i++) {
          const problem = generateDivisionProblem(diff);
          expect(problem.operation).toBe('division');
          expect(problem.secondOperand).toBeGreaterThan(0);
          expect(Number.isInteger(problem.correctAnswer)).toBe(true);
          expect(problem.firstOperand).toBe(
            problem.secondOperand * problem.correctAnswer,
          );
        }
      });
    });
  });

  describe('distractors generator', () => {
    it('generates exactly 3 unique distractors not equal to the correct answer', () => {
      operations.forEach((op) => {
        difficulties.forEach((diff) => {
          const q = generateQuestion(op, diff);
          const raw = {
            operation: q.operation,
            firstOperand: q.firstOperand,
            secondOperand: q.secondOperand,
            displayText: q.displayText,
            correctAnswer: q.correctAnswer,
            symbol: '+',
          };
          const distractors = generateDistractors(raw, diff);
          expect(distractors).toHaveLength(3);
          expect(distractors).not.toContain(q.correctAnswer);
          expect(new Set(distractors).size).toBe(3);
          if (diff < 4) {
            expect(distractors.every((d) => d >= 0)).toBe(true);
          }
        });
      });
    });
  });

  describe('generateQuestion', () => {
    it('generates fully validated questions for all operation/difficulty combinations', () => {
      operations.forEach((op) => {
        difficulties.forEach((diff) => {
          for (let i = 0; i < 10; i++) {
            const question = generateQuestion(op, diff);
            expect(validateQuestion(question)).toBe(true);
            expect(question.choices).toHaveLength(4);
            expect(new Set(question.choices).size).toBe(4);
            expect(question.choices).toContain(question.correctAnswer);
          }
        });
      });
    });

    it('randomizes choice positions so correct answer is not always first', () => {
      const positions = new Set<number>();
      for (let i = 0; i < 40; i++) {
        const q = generateQuestion('addition', 1);
        const idx = q.choices.indexOf(q.correctAnswer);
        positions.add(idx);
      }
      // Over 40 trials, the correct answer should appear in more than 1 position
      expect(positions.size).toBeGreaterThan(1);
    });
  });

  describe('generateQuestionForOperations', () => {
    it('picks from enabled operations', () => {
      const ops: MathOperation[] = ['multiplication', 'division'];
      for (let i = 0; i < 20; i++) {
        const q = generateQuestionForOperations(ops, 2);
        expect(ops).toContain(q.operation);
        expect(validateQuestion(q)).toBe(true);
      }
    });

    it('defaults to addition when empty operations array provided', () => {
      const q = generateQuestionForOperations([], 1);
      expect(q.operation).toBe('addition');
      expect(validateQuestion(q)).toBe(true);
    });
  });
});
