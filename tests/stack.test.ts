import { strictEqual } from 'node:assert/strict';
import { test } from 'node:test';
import { stackTop } from '../src/lib/stack.ts';

test('stackTop returns 0 when the section is shorter than the viewport', () => {
  strictEqual(stackTop(800, 500), 0);
});

test('stackTop pins the bottom of a taller section', () => {
  strictEqual(stackTop(800, 940), -140);
});

test('stackTop returns 0 when the section exactly fills the viewport', () => {
  strictEqual(stackTop(800, 800), 0);
});
