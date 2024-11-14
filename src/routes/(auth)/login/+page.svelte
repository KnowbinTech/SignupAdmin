<script lang="ts">
    import "../../../app.css";
    import logo from "$lib/images/SIGNUP_LOGO.png";
    import {Button} from "$lib/components/ui/button";
    import Sun from "svelte-radix/Sun.svelte";
    import Moon from "svelte-radix/Moon.svelte";
    import {toggleMode} from "mode-watcher";

    let Logo = logo;

</script>

<Button on:click={toggleMode} variant="outline" size="icon">
    <Sun
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Moon
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
</Button>
<div
        class="flex min-h-full flex-col bg-background text-foreground justify-center px-6 py-12 lg:px-8"
>
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
                class="mx-auto h-22 w-auto dark:invert"
                src={Logo}
                alt="Signup Casuals"
        />
        <!-- <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2> -->
    </div>

    <div
            class="mt-10 sm:mx-auto bg-background text-foreground sm:w-full sm:max-w-sm"
    >
        <form class="space-y-6" method="POST" action="?/signIn">
            <div>
                <Button
                        type="submit"
                        class="flex w-full justify-center  px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm  "
                >Sign in
                </Button>
            </div>
        </form>
    </div>

    <div
            class="mt-10 sm:mx-auto bg-background text-foreground sm:w-full sm:max-w-sm"
    >
        <form class="space-y-6" method="POST" action="?/signOut">
            <div>
                <Button
                        type="submit"
                        class="flex w-full justify-center  px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm  "
                >Sign Out
                </Button>
            </div>
        </form>
    </div>
</div>
