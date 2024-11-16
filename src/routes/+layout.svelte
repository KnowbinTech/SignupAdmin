<script lang="ts">
    import {ModeWatcher} from "mode-watcher";
    import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
    import {Toaster} from "$lib/components/ui/sonner";
    import {isLoggedIn, UserStore} from "$lib/stores/data";
    import type {LayoutData} from './$types';
    import {setContext, onMount} from 'svelte';
    import {writable} from 'svelte/store';

    export let data: LayoutData;

    const user = writable();
    setContext('localUser', user);

    user.set(data.user);
    UserStore.set(data.loggedUser.user ?? null);
    isLoggedIn.set(data.isLoggedIn);

    onMount(() => {
        if (data.token) {
            // Store the token securely, e.g., in session storage
            sessionStorage.setItem("authToken", data.token);
        } else {
            // Remove the token from the storage when it's expired or invalid
            sessionStorage.removeItem("authToken");
        }
    });
    
</script>
<div>
    <ModeWatcher/>
    <Toaster/>
    <LoadingIndicator/>
    <slot/>
</div>