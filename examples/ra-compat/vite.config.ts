import react from '@vitejs/plugin-react';
import { createRequire } from 'module';
import path from 'path';
import { defineConfig, searchForWorkspaceRoot, type Plugin } from 'vite';

// The ra-compat example directory (where dependencies are installed)
const raCompatDir = __dirname;
// The vendor simple example directory (where source code lives)
const vendorSimpleDir = path.resolve(__dirname, '../../vendor/react-admin/examples/simple');
// The shadmin monorepo root (where hoisted node_modules lives)
const shadminRoot = path.resolve(__dirname, '../..');
// The shadmin package source directory
const shadminSrc = path.resolve(__dirname, '../../packages/shadmin/src');

/**
 * Vite plugin that resolves dependencies from ra-compat's node_modules
 * This is needed because root is vendor/simple but deps are installed in ra-compat
 */
function resolveFromRaCompat(): Plugin {
    // Create a require function that looks in ra-compat's node_modules
    const require = createRequire(path.resolve(raCompatDir, 'package.json'));

    return {
        name: 'resolve-from-ra-compat',
        enforce: 'pre', // Run before other plugins
        resolveId(source, _importer) {
            // Skip if already resolved or is relative/absolute path
            if (!source || source.startsWith('.') || source.startsWith('/') || source.startsWith('\0')) {
                return null;
            }
            // Skip react-admin which is aliased separately
            if (source === 'react-admin' || source.startsWith('react-admin/')) {
                return null;
            }
            // Try to resolve from ra-compat's node_modules
            try {
                const resolved = require.resolve(source);
                return resolved;
            } catch {
                return null;
            }
        },
    };
}

/**
 * Vite config that aliases react-admin to shadmin
 * This allows running the original react-admin examples with shadmin components
 *
 * NOTE: We only alias 'react-admin', NOT 'ra-core' or 'ra-ui-materialui'
 * because shadmin internally imports from ra-core for headless functionality
 *
 * The root is set to the vendor/simple directory for source code,
 * but we resolve dependencies from this ra-compat directory where they're installed.
 */
export default defineConfig({
    plugins: [
        resolveFromRaCompat(),
        react(),
    ],
    resolve: {
        alias: [
            // Only alias the main react-admin package to shadmin
            // Shadmin re-exports ra-core, so the example code gets ra-core through shadmin
            {
                find: 'react-admin',
                replacement: shadminSrc,
            },
            // Resolve @/ imports from shadmin source (used internally by shadmin)
            {
                find: /^@\/(.*)/,
                replacement: `${shadminSrc}/$1`,
            },
            // MUI icons optimization
            {
                find: /^@mui\/icons-material\/(.*)/,
                replacement: '@mui/icons-material/esm/$1',
            },
        ],
    },
    root: vendorSimpleDir,
    // Configure Vite to look for dependencies in both the vendor directory and ra-compat
    // Since root is vendor/simple but deps are installed in ra-compat
    optimizeDeps: {
        // Tell Vite where to look for dependencies during dev
        entries: [path.resolve(vendorSimpleDir, 'src/index.tsx')],
    },
    server: {
        port: 8080,
        fs: {
            allow: [
                // Allow access to the vendor directory
                vendorSimpleDir,
                // Allow access to ra-compat for node_modules
                raCompatDir,
                // Allow access to shadmin root for hoisted dependencies
                shadminRoot,
                // Allow default workspace root
                searchForWorkspaceRoot(process.cwd()),
            ],
        },
    },
    define: { 'process.env': {} },
});
