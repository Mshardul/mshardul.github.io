import { strictEqual } from 'node:assert/strict';
import { test } from 'node:test';
import { resolveTheme } from '../src/lib/theme.ts';

test('resolveTheme honours a stored dark value', () => {
  strictEqual(resolveTheme('dark', false), 'dark');
});

test('resolveTheme honours a stored light value', () => {
  strictEqual(resolveTheme('light', true), 'light');
});

test('resolveTheme falls back to system when nothing is stored', () => {
  strictEqual(resolveTheme(null, true), 'dark');
});

test('resolveTheme falls back to system for an invalid stored value', () => {
  strictEqual(resolveTheme('banana', false), 'light');
});
