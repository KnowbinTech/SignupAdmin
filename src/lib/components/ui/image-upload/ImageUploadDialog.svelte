<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import ImageUploadModal from "./ImageUploadModal.svelte";
  import Button from "../button/button.svelte";
  import { createEventDispatcher } from "svelte";
  import API from "$lib/services/api";
  import { LoaderCircle } from "lucide-svelte";

  const dispatch = createEventDispatcher();

  export let open = false;
  export let productId: string;
  export let currentImages: { id: string; image: string }[] = [];
  export let baseUrl: string;

  let newImages: File[] = [];
  let imagesToDelete: string[] = [];
  let deselectedNewImages: File[] = [];
  let isLoading = false;

  function closeDialog() {
    dispatch("close");
    newImages = [];
  }

  function handleImagesUpdated(
    event: CustomEvent<{ id: string; image: string }[]>
  ) {
    const updatedImages = event.detail;
  }

  async function deleteImages() {
    try {
      for (const imageId of imagesToDelete) {
        await API.delete(`/products/product-image/${imageId}/delete_record/`);
      }
      imagesToDelete = [];
    } catch (error) {
      console.error("Error deleting images:", error);
    }
  }

  async function saveImages() {
    if (isLoading) return;
    try {
      isLoading = true;
      await deleteImages();

      if (!newImages || newImages.length === 0) {
        dispatch("updateTableData");
        closeDialog();
        return;
      }

      const selectedNewImages = newImages.filter(
        (file) => !deselectedNewImages.includes(file)
      );

      for (const file of selectedNewImages) {
        const formData = new FormData();
        formData.append(`image`, file);
        formData.append("alt_text", "Product Image");
        formData.append("product", productId);
        await API.post("/products/product-image/create_record/", formData);
      }

      // Fetch updated images from the server
      const res = await API.get(`/products/product/${productId}`);
      const updatedImages = res.data.images.map(
        (image: { id: string; image: string }) => ({
          id: image.id,
          image: `${baseUrl}${image.image}`,
        })
      );

      dispatch("imagesUpdated", updatedImages);
      dispatch("updateTableData");
      newImages = [];
      deselectedNewImages = [];
      closeDialog();
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      isLoading = false;
    }
  }
</script>

<Dialog.Root {open} onOpenChange={closeDialog}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Upload Images</Dialog.Title>
    </Dialog.Header>
    <ImageUploadModal
      {currentImages}
      {baseUrl}
      on:imagesUpdated={handleImagesUpdated}
      bind:newImages
      bind:imagesToDelete
      bind:deselectedNewImages
    />
    <Dialog.Footer>
      <Button 
        variant="ghost" 
        on:click={closeDialog}
        disabled={isLoading}>Cancel</Button>
      <Button 
      on:click={saveImages}
      disabled={isLoading}
      class="relative">
      {#if isLoading}
        <LoaderCircle class="animate-spin mr-2 h-4 w-4" />
      {/if}
      save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>