import { strictEqual, throws } from 'node:assert/strict';
import { test } from 'node:test';
import { buildMailto } from '../src/lib/mailto.ts';

test('buildMailto produces a plain mailto link', () => {
  strictEqual(buildMailto({ user: 'hello', domain: 'example.com' }), 'mailto:hello@example.com');
});

test('buildMailto encodes the subject', () => {
  strictEqual(
    buildMailto({ user: 'hello', domain: 'example.com', subject: 'Hi there' }),
    'mailto:hello@example.com?subject=Hi%20there'
  );
});

test('buildMailto throws on empty user or domain', () => {
  throws(() => buildMailto({ user: '', domain: 'example.com' }), Error);
  throws(() => buildMailto({ user: 'hello', domain: '' }), Error);
});
