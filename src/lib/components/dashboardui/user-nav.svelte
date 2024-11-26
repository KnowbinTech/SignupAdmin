<script lang="ts">
	import * as DropdownMenu from "../ui/dropdown-menu";
	import * as Avatar from "../ui/avatar";
	import { Button } from "../ui/button";
	import { goto } from '$app/navigation';
	import { UserStore } from "$lib/stores/data";
	import { onMount } from "svelte";


	let user: any;
	function getUser()  {
		UserStore.subscribe(userData => {
			if (userData) {
				user = userData;
			} else {
				return null;
			}
		});
	}
	onMount(getUser);

</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar.Root class="h-8 w-8">
				{#if user?.profile_picture}
					<Avatar.Image src={`${user.profile_picture}`} alt="user" />
				{:else}
					<Avatar.Fallback>A</Avatar.Fallback>
				{/if}
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>	
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{user.first_name} {user.last_name}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item on:click={() => goto('/apps/settings-general')}>
				Profile
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<form class="space-y-6" method="POST" action="/apps/dashboard?/signOut">
                <div>
                    <button
                            type="submit"
                            class="flex text-sm font-semibold leading-6 shadow-sm"
                    >Logout
                    </button>
                </div>
            </form>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>