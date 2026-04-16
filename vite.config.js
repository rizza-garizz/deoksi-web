import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        layanan: resolve(__dirname, 'layanan.html'),
        galeri: resolve(__dirname, 'galeri.html'),
        tentang: resolve(__dirname, 'tentang.html'),
        lokasi: resolve(__dirname, 'lokasi.html')
      }
    }
  }
});
