import { strictEqual, deepStrictEqual, ok } from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { findTerms, parseAddedLines, readStagedContent } from '../scripts/guards/lib.ts';
import { run as styleRun } from '../scripts/guards/style.ts';
import { run as placeholdersRun } from '../scripts/guards/placeholders.ts';
import { run as privateTermsRun } from '../scripts/guards/private-terms.ts';
import { run as noindexRun } from '../scripts/guards/noindex.ts';

/** A default terms file that does not exist, so tests never read the real local list. */
const NO_DEFAULT = join(tmpdir(), 'guard-no-such-dir', '.private-terms');

function termsFile(contents: string): string {
  const file = join(mkdtempSync(join(tmpdir(), 'guard-')), 'terms.txt');
  writeFileSync(file, contents);
  return file;
}

function withEnv(vars: Record<string, string | null>, fn: () => void): void {
  const prev: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(vars)) {
    prev[key] = process.env[key];
    if (value === null) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  try {
    fn();
  } finally {
    for (const [key, value] of Object.entries(prev)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

test('findTerms returns line numbers of word-bounded matches', () => {
  const text = [
    'alpha zzfixtureterm beta',
    'gamma',
    'delta zzfixturetermX end',
    'epsilon zzfixtureterm',
  ].join('\n');
  deepStrictEqual(findTerms(text, ['zzfixtureterm']), [1, 4]);
});

test('findTerms is case-insensitive', () => {
  deepStrictEqual(findTerms('ZZFIXTURETERM here', ['zzfixtureterm']), [1]);
});

test('findTerms ignores empty term list', () => {
  deepStrictEqual(findTerms('zzfixtureterm here', []), []);
});

test('findTerms matches a symbol term inside a word', () => {
  deepStrictEqual(findTerms('me@zzmail.test', ['@zzmail.test']), [1]);
  deepStrictEqual(findTerms('email: me@zzmail.test', ['@zzmail.test']), [1]);
});

test('findTerms matches C sharp', () => {
  deepStrictEqual(findTerms('written in C#', ['C#']), [1]);
});


test('style guard flags an em dash', () => {
  const failures = styleRun({ file: 'src/pages/index.astro', content: 'Hello—world' });
  strictEqual(failures.length, 1);
  strictEqual(failures[0].guard, 'style');
  strictEqual(failures[0].line, 1);
});

test('style guard ignores em dash out of scope', () => {
  const failures = styleRun({ file: 'src/styles/tokens.css', content: 'Hello—world' });
  strictEqual(failures.length, 0);
});

test('placeholders flags Company A', () => {
  const failures = placeholdersRun({ file: 'src/pages/index.astro', content: 'Company A is great' });
  strictEqual(failures.length, 1);
  strictEqual(failures[0].guard, 'placeholders');
  strictEqual(failures[0].line, 1);
});

test('placeholders ignores out of scope files', () => {
  const failures = placeholdersRun({ file: 'scripts/guard.ts', content: 'Company A is great' });
  strictEqual(failures.length, 0);
});

test('private-terms fails closed when file unset and CI unset', () => {
  withEnv({ PRIVATE_TERMS_FILE: null, CI: null }, () => {
    const failures = privateTermsRun({ file: 'src/lib/site.ts', content: 'hello' }, { defaultFile: NO_DEFAULT });
    ok(failures.length > 0, 'expected at least one failure');
    strictEqual(failures[0].guard, 'private-terms');
  });
});

test('private-terms is skipped when CI=true', () => {
  withEnv({ PRIVATE_TERMS_FILE: null, CI: 'true' }, () => {
    const failures = privateTermsRun({ file: 'src/lib/site.ts', content: 'hello' }, { defaultFile: NO_DEFAULT });
    strictEqual(failures.length, 0);
  });
});

test('private-terms is NOT skipped when CI=false', () => {
  withEnv({ PRIVATE_TERMS_FILE: null, CI: 'false' }, () => {
    const failures = privateTermsRun({ file: 'src/lib/site.ts', content: 'hello' }, { defaultFile: NO_DEFAULT });
    ok(failures.length > 0, 'expected fail-closed when CI=false');
  });
});

test('private-terms uses the default file when the variable is unset', () => {
  const defaultFile = termsFile('zzfixtureterm\n');
  withEnv({ PRIVATE_TERMS_FILE: null, CI: null }, () => {
    strictEqual(privateTermsRun({ file: 'src/a.ts', content: 'zzfixtureterm' }, { defaultFile }).length, 1);
    strictEqual(privateTermsRun({ file: 'src/a.ts', content: 'clean' }, { defaultFile }).length, 0);
  });
});

test('private-terms: the variable wins over the default file', () => {
  const defaultFile = termsFile('zzdefaultterm\n');
  withEnv({ PRIVATE_TERMS_FILE: termsFile('zzenvterm\n'), CI: null }, () => {
    strictEqual(privateTermsRun({ file: 'src/a.ts', content: 'zzenvterm' }, { defaultFile }).length, 1);
    strictEqual(privateTermsRun({ file: 'src/a.ts', content: 'zzdefaultterm' }, { defaultFile }).length, 0);
  });
});

test('private-terms: a bad variable does not fall back to the default file', () => {
  const defaultFile = termsFile('zzfixtureterm\n');
  withEnv({ PRIVATE_TERMS_FILE: NO_DEFAULT, CI: null }, () => {
    const failures = privateTermsRun({ file: 'src/a.ts', content: 'clean' }, { defaultFile });
    strictEqual(failures.length, 1);
    strictEqual(failures[0].file, 'PRIVATE_TERMS_FILE');
  });
});

test('private-terms fails closed when the terms file is empty', () => {
  const dir = mkdtempSync(join(tmpdir(), 'guard-'));
  const file = join(dir, 'terms.txt');
  writeFileSync(file, '\n  \n');
  withEnv({ PRIVATE_TERMS_FILE: file, CI: null }, () => {
    const failures = privateTermsRun({ file: 'src/lib/site.ts', content: 'hello' });
    strictEqual(failures.length, 1);
    strictEqual(failures[0].file, 'PRIVATE_TERMS_FILE');
  });
});

test('private-terms reports the matching line, never the term', () => {
  const dir = mkdtempSync(join(tmpdir(), 'guard-'));
  const file = join(dir, 'terms.txt');
  writeFileSync(file, 'zzfixtureterm\n');
  withEnv({ PRIVATE_TERMS_FILE: file, CI: null }, () => {
    const failures = privateTermsRun({ file: 'src/a.ts', content: 'ok\nhas zzfixtureterm\n' });
    deepStrictEqual(failures, [{ guard: 'private-terms', file: 'src/a.ts', line: 2 }]);
    ok(!JSON.stringify(failures).includes('zzfixtureterm'));
  });
});

test('private-terms ignores comment lines in the terms file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'guard-'));
  const file = join(dir, 'terms.txt');
  writeFileSync(file, '# a comment mentioning zzcommentword\nzzfixtureterm\n');
  withEnv({ PRIVATE_TERMS_FILE: file, CI: null }, () => {
    deepStrictEqual(privateTermsRun({ file: 'src/a.ts', content: 'zzcommentword' }), []);
    strictEqual(privateTermsRun({ file: 'src/a.ts', content: 'zzfixtureterm' }).length, 1);
  });
});

test('the example terms file is valid and parses to mock terms', () => {
  withEnv({ PRIVATE_TERMS_FILE: '.private-terms.example', CI: null }, () => {
    strictEqual(privateTermsRun({ file: 'src/a.ts', content: 'nothing to see' }).length, 0);
    strictEqual(privateTermsRun({ file: 'src/a.ts', content: 'zzclientone' }).length, 1);
  });
});

test('parseAddedLines maps added lines to real file and line numbers', () => {
  const diff = [
    'diff --git a/src/a.ts b/src/a.ts',
    '--- a/src/a.ts',
    '+++ b/src/a.ts',
    '@@ -3,0 +4,2 @@',
    '+first added',
    '+second added',
    '@@ -10 +12 @@',
    '-old',
    '+changed',
    'diff --git a/gone.ts b/gone.ts',
    '--- a/gone.ts',
    '+++ /dev/null',
    '@@ -1 +0,0 @@',
    '-removed',
  ].join('\n');
  const parsed = parseAddedLines(diff);
  strictEqual(parsed.length, 1);
  strictEqual(parsed[0].file, 'src/a.ts');
  deepStrictEqual([...parsed[0].lines], [[4, 'first added'], [5, 'second added'], [12, 'changed']]);
});

test('Failure never contains the matched term', () => {
  const failures = placeholdersRun({ file: 'src/pages/index.astro', content: 'Company A is great' });
  const serialized = JSON.stringify(failures);
  ok(!serialized.includes('Company A'), 'matched term leaked into failure output');
});

test('readStagedContent returns index content for a tracked file', () => {
  const content = readStagedContent('package.json');
  ok(content.length > 0, 'expected package.json content from the index');
  ok(content.includes('"name"'), 'content looks like package.json');
});

test('noindex passes when INDEXABLE=false, robots disallows, meta present', () => {
  const failures = noindexRun({ file: '', content: '' }, {
    site: 'export const INDEXABLE = false;',
    robots: 'User-agent: *\nDisallow: /',
    base: '<meta name="robots" content="noindex, nofollow" />',
  });
  deepStrictEqual(failures, []);
});

test('noindex fails closed when INDEXABLE cannot be parsed', () => {
  const failures = noindexRun({ file: 'src/lib/site.ts', content: 'export const FOO = 1;' }, {
    site: 'export const FOO = 1;',
    robots: 'User-agent: *\nDisallow: /',
    base: '<meta name="robots" content="noindex, nofollow" />',
  });
  strictEqual(failures.length, 1);
  strictEqual(failures[0].guard, 'noindex');
  strictEqual(failures[0].file, 'src/lib/site.ts');
  strictEqual(failures[0].line, 1);
});

test('noindex fails when INDEXABLE=true but robots still disallows', () => {
  const failures = noindexRun({ file: '', content: '' }, {
    site: 'export const INDEXABLE = true;',
    robots: 'User-agent: *\nDisallow: /',
    base: '<meta name="robots" content="index, follow" />',
  });
  strictEqual(failures.length, 1);
  strictEqual(failures[0].guard, 'noindex');
  strictEqual(failures[0].file, 'public/robots.txt');
});
