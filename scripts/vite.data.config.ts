import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  publicDir: false,
  build: {
    ssr: fileURLToPath(new URL('./registry-entry.ts', import.meta.url)),
    outDir: 'dist-pdf',
    emptyOutDir: true,
    minify: false,
    rollupOptions: { output: { entryFileNames: 'registry.mjs', format: 'esm' } },
  },
});
