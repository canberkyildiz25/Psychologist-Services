import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // The site is a static export with images already cut to size, so next/image has nothing to add.
  { rules: { '@next/next/no-img-element': 'off' } },
  globalIgnores(['node_modules/**', '.next/**', 'out/**', 'next-env.d.ts']),
]);
