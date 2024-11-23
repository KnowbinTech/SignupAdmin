<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { XCircle } from "lucide-svelte";
  import Button from "../button/button.svelte";
  import { compressImage } from "$lib/Functions/commonFunctions";

  export let currentImages: { id: string; image: string }[] = [];
  export let imagesToDelete: string[] = [];
  export let newImages: File[] = [];
  export let deselectedNewImages: File[] = [];

  let fileInput: HTMLInputElement;
  let dispatch = createEventDispatcher();

  async function deleteImage(imageId: string) {
    imagesToDelete = [...imagesToDelete, imageId];
    // Remove the image from the currentImages array
    currentImages = currentImages.filter((img) => img.id !== imageId);
  }

  async function handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      let imageArray = Array.from(files);

      for (const file of imageArray) {
        const image = await compressImage(file, true);
        if (image) {
          newImages.push(image);
        }
      }

      // Update the currentImages array with the compressed images
      newImages.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = () => {
          currentImages = [
            ...currentImages,
            { id: `temp_${index}`, image: reader.result as string },
          ];
        };
        reader.readAsDataURL(file);
      });
    }
  }

  function deselectNewImage(index: number) {
    let temporaryFile = currentImages[index].id;
    let extractedIndex = parseInt(temporaryFile.split("_")[1], 10);

    let file = newImages[extractedIndex];
    if (!file) return; // Exit the function if file is undefined

    deselectedNewImages = [...deselectedNewImages, file];
    newImages = newImages.filter((img, i) => i !== index);

    // Remove the image preview from the currentImages array
    currentImages = currentImages.filter((img, i) => {
      const imgId = typeof img.id === "string" ? img.id : "";
      const isNewImage = imgId.startsWith("temp_");
      const isImageToDeselect = isNewImage && i === index;
      return !isImageToDeselect;
    });
  }
</script>

<div class="p-4">
  <div
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
  >
    {#each currentImages as image, index}
      <div class="relative">
        <Button
          variant="link"
          on:click={() =>
            typeof image.id === "string" && image.id.startsWith("temp_")
              ? deselectNewImage(index)
              : deleteImage(image.id)}
          class="absolute top-1 right-1 text-red-500 hover:text-red-700"
        >
          <XCircle size="20" />
        </Button>
        <div class="w-full h-full overflow-hidden rounded-lg">
          {#if image.image.startsWith("data:")}
            <img
              src={image.image}
              alt="product_image"
              class="w-full h-full object-cover"
            />
          {:else}
            <img
              src={`${image.image}`}
              alt="product_image"
              class="w-full h-full object-cover"
            />
          {/if}
        </div>
      </div>
    {/each}
  </div>
  <div class="grid gap-2 p-5">
    <input
      type="file"
      multiple
      hidden
      on:change={handleFileInput}
      bind:this={fileInput}
    />
    <Button variant="outline" on:click={() => fileInput.click()}
      >Upload Image</Button
    >
  </div>
</div>
