<script lang="ts">
    import { CircleSlash2 } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button";
    import { page } from '$app/stores';
    import {goto} from "$app/navigation";
    const error = $page.error;
    const status = $page.status;
</script>

<svelte:head>
    <title>{status} - Page Not Found</title>
</svelte:head>

<main>
    {#if status === 404}
        <CircleSlash2 class="size-1/4" />
        <h1 class="page-404">404</h1>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
    {:else}
        <h1>Error {status}</h1>
        <p>{error.message}</p>
    {/if}

    <Button variant="default" on:click={() => goto('/')}>Go back to home</Button>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
    }

    h1 {
        font-size: 2em;
        margin-bottom: 0.5em;
    }

    p {
        margin-bottom: 1em;
    }

    a {
        color: #0070f3;
        text-decoration: none;
        font-weight: bold;
    }

    a:hover {
        text-decoration: underline;
    }

    .page-404 {
        font-size: 50px;
        margin-bottom: 0;
    }
</style>
