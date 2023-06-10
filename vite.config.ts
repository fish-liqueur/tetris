import {fileURLToPath, URL} from "node:url";
import { defineConfig } from 'vite'

export default defineConfig({
    base: '/tetris/',
    resolve: {

        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@game': fileURLToPath(new URL('./src/game', import.meta.url)),
        }
    },
});