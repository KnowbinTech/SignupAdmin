<svelte:head>
    <title>Unauthorized</title>
</svelte:head>

<main>
    <CircleSlash2 class="size-1/4"/>
    <h1>Unauthorized</h1>
    <p>You are not authorized to access this application.</p>
    <form method="post" action="/apps?/signOut">
        <Button type="submit" variant="default">
            Logout
        </Button>
    </form>
</main>

<script lang="ts">
    import { CircleSlash2 } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button";
</script>

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

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
