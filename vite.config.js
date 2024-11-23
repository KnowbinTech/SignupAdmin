import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server:{
		headers:{
			"X-Frame-Option": "SAMEORIGIN",
			"SameSite": "Strict"
		},
		proxy:{
			'/api':{
				target:"https://manage.signupcasuals.com/api/",
				// target:"http://localhost:8000/api",
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, ''),
			}
		},
	}
});
