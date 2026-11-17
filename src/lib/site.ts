import { existsSync } from 'node:fs';

export const INDEXABLE = false;

/** Stable public URL of the resume. The file lives at public/resume/. */
export const RESUME_URL = '/resume/Shardul_Lingwal_Resume.pdf';

export const hasResume = existsSync(`public${RESUME_URL}`);
