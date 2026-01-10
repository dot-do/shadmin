import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

/**
 * Vite config that aliases react-admin to shadmin
 * This allows running the original react-admin examples with shadmin components
 *
 * NOTE: We only alias 'react-admin', NOT 'ra-core' or 'ra-ui-materialui'
 * because shadmin internally imports from ra-core for headless functionality
 */
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            // Only alias the main react-admin package to shadmin
            // Shadmin re-exports ra-core, so the example code gets ra-core through shadmin
            {
                find: 'react-admin',
                replacement: path.resolve(__dirname, '../../packages/shadmin/src'),
            },
            // MUI icons optimization
            {
                find: /^@mui\/icons-material\/(.*)/,
                replacement: '@mui/icons-material/esm/$1',
            },
        ],
    },
    root: path.resolve(__dirname, '../../vendor/react-admin/examples/simple'),
    server: {
        port: 8080,
    },
    define: { 'process.env': {} },
});
