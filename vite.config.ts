import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 8081,
	},
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				background: resolve(__dirname, 'src/background.ts'),
				contentScript: resolve(__dirname, 'src/contentScript.ts'),
				contextMenu: resolve(__dirname, 'src/contextMenu.ts'),
			},
			output: {
				entryFileNames: '[name].js',
			},
		},
	},
});
