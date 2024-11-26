<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import VariantTable from "./variantTable.svelte";
  import CreateVariant from "./createVariant/+page.svelte";
  import { variantFormStore } from '$lib/stores/variantStore';
  import type { PageData } from './$types';

  export let data;
  let productID: string = data.productId;

  onMount(() => {
    if (productID) {
      sessionStorage.setItem("productId", productID);
    } else {
      const storedId = sessionStorage.getItem("productId");
      if (storedId) {
        productID = storedId;
      }
    }
  });

  function goBack() {
    history.back()
  }

  function handleVariantSuccess() {
    variantFormStore.close();
    variantFormStore.triggerRefresh();
  }
</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center">
    <h4
      class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1"
    >
      Variant
    </h4>
    <div class="glow-border mr-4">
      <Button
        variant="outline"
        class="text-xs flex items-center gap-2  px-4 py-1.5"
        on:click={() => variantFormStore.openNew(productID)}
      >
        <i class="fa-solid fa-cloud-arrow-up text-sm"></i>
        Add Variant</Button
      >
    </div>
  </div>
  <VariantTable productId = {productID} />
  <div class="flex justify-end">
    <Button class="text-end" on:click={goBack}>Go Back</Button>
  </div>
</div>

{#if $variantFormStore.isOpen}
  <div class="abc">
    {#if $variantFormStore.isLoading}
      <div>Loading...</div>
    {:else}
      <CreateVariant
        productData2={$variantFormStore.productData}
        editData={$variantFormStore.editData}
        editForm={$variantFormStore.isEditMode}
        imageEditMode={$variantFormStore.imageEditMode}
        on:cancel={() => variantFormStore.close()}
        on:newVariant={handleVariantSuccess}
      />
    {/if}
  </div>
{/if}