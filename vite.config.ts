import {fileURLToPath, URL} from "node:url";

export default {
    build: {
        rollupOptions: {
            input: {
                app: 'src/app.ts',
            },
            output: {
                dir: 'dist',
                assetFileNames: 'style[extname]',
            }
        },
        
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@game': fileURLToPath(new URL('./src/game', import.meta.url)),
        }
    },
};