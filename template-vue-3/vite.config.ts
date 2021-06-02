import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const pathResolve = (pathStr: string) => {
    return path.resolve(__dirname, pathStr);
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        sourcemap: true,
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
    resolve: {
        alias: [
            { find: '@', replacement: pathResolve('/src') },
            { find: '~', replacement: pathResolve('/node_modules') },
        ],
    },
});
