import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/main.js'),
            name: 'ScrfSlider',
            formats: ['es'],
        },
        rollupOptions: {
            external: ['vue', 'nouislider'],
            output: {
                globals: {
                    vue: 'Vue',
                    nouislider: 'noUiSlider',
                },
            },
        },
    },
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    optimizeDeps: {
        include: ['vue', 'nouislider'],
    },
})
