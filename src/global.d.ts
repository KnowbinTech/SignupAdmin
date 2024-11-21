import '@sveltejs/kit';
declare module '@lottiefiles/svelte-lottie-player';
declare module '@sveltejs/kit' {
	interface Locals {
		user?: any; // You can replace `any` with a more specific type if known
	}
}