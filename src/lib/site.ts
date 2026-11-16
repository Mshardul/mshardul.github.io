import { existsSync } from 'node:fs';

export const INDEXABLE = false;

export const hasResume = existsSync('public/resume.pdf');