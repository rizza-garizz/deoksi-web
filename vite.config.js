import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        layanan: resolve(__dirname, 'layanan.html'),
        produk: resolve(__dirname, 'produk.html'),
        tentang: resolve(__dirname, 'tentang.html'),
        lokasi: resolve(__dirname, 'lokasi.html'),
        konsultasi: resolve(__dirname, 'konsultasi.html'),
      },
    },
  },
});
