import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default defineConfig(async () => {
    // Shadmin source path
    const shadminSrc = path.resolve(__dirname, '../../src');

    return {
        plugins: [react()],
        resolve: {
            // Dedupe react-router packages to avoid context mismatch
            dedupe: [
                'react',
                'react-dom',
                'react-router',
                'react-router-dom',
                '@tanstack/react-query',
            ],
            alias: [
                {
                    find: /^@mui\/icons-material\/(.*)/,
                    replacement: '@mui/icons-material/esm/$1',
                },
                // Alias shadmin to local source
                {
                    find: 'shadmin',
                    replacement: shadminSrc,
                },
                // Resolve @/ path aliases within shadmin source
                {
                    find: '@/utils',
                    replacement: path.join(shadminSrc, 'lib/utils'),
                },
                {
                    find: /^@\/contexts\/(.*)/,
                    replacement: path.join(shadminSrc, 'contexts/$1'),
                },
                {
                    find: /^@\/(.*)/,
                    replacement: path.join(shadminSrc, '$1'),
                },
            ],
        },
        server: {
            port: 8080,
        },
        define: { 'process.env': {} },
    };
});
