<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import { createEventDispatcher, onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { compressImage } from "$lib/Functions/commonFunctions";
  import { LoaderCircle } from "lucide-svelte";
  import { Switch } from "$lib/components/ui/switch/index.js";

  const dispatch = createEventDispatcher();

  export let editData;
  export let editForm: boolean;
  let updateImage: boolean = false;
  let validation: any = {};
  let isLoading = false;
  let isUpLoadingImage = false;
  let heroDetails: any = {
    id: "",
    title: "",
    cta_text: "",
    image: "",
    short_description: "",
    link: "",
    is_in_shop_page: false,
  };

  if (editForm) {
    heroDetails = editData;
  }

  let imageUpload: HTMLInputElement;

  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    isUpLoadingImage = true;
    if (imageUpload.files && imageUpload.files.length > 0) {
      if (imageUpload.files[0].size / 1024 > 45) {
        heroDetails.image = await compressImage(imageUpload.files[0], true);
        heroDetails.image ? (updateImage = true) : "";
      } else {
        heroDetails.image = imageUpload.files[0];
        updateImage = true;
      }
    }
    isUpLoadingImage = false;
  }

  async function createHero() {
    if (isLoading) return;
    try {
      isLoading = true;
      validation = {};

      if (heroDetails.title == "") {
        validation.title = ["This field may not be blank."];
      }

      if (heroDetails.short_description == "") {
        validation.short_description = ["This field may not be blank."];
      }

      if (heroDetails.cta_text == "") {
        validation.cta_text = ["This field may not be blank."];
      }

      if (heroDetails.link == "") {
        validation.link = ["This field may not be blank."];
      }
      if (!heroDetails.image && !editForm) {
        validation.image = ["Image is required."];
      }
      if (
        validation.short_description ||
        validation.title ||
        validation.cta_text ||
        validation.link ||
        validation.image
      ) {
        console.log(validation);
        console.log(heroDetails);
        toast(`Please fill the required field`);
      } else {
        const form = new FormData();
        if (updateImage) {
          form.append("image", heroDetails.image);
        }
        form.append("short_description", heroDetails.short_description);
        form.append("title", heroDetails.title);
        form.append("cta_text", heroDetails.cta_text);
        form.append("link", heroDetails.link);
        form.append("is_in_shop_page", heroDetails.is_in_shop_page);
        // form.append("name", heroDetails.name);

        const url = editForm
          ? `/cms/hero-section/${heroDetails.id}/update_record/`
          : "/cms/hero-section/create_record/";

        if (editForm) {
          await API.put(url, form);
        } else {
          await API.post(url, form);
        }

        dispatch("newHero");
        const action = editForm ? "Hero Updated" : "Hero Created";
        toast(`${action} successfully!`);
      }
    } catch (error: any) {
      const action = editForm ? "Update Hero" : "Create Hero";
      console.log(`${action}:`, error);
      validation = error.response.data;
      toast(`Failed to ${action}`);
    } finally {
      isLoading = false;
    }
  }

  function cancelModel() {
    dispatch("cancel");
    updateImage = false;
  }
</script>

<Dialog.Root open={true} onOpenChange={cancelModel}>
  <Dialog.Content>
    <Dialog.Header class="font-bold mb-5">
      <Dialog.Description
        >{editForm ? "Update Hero" : "New Hero"}</Dialog.Description
      >
    </Dialog.Header>
    <div class="mb-3">
      <Label for="title">Title</Label>
      <Input
        id="title"
        bind:value={heroDetails.title}
        placeholder="Title"
        class="textarea {validation.title ? 'border-red-500' : ''}"
      />
      <p class="text-red-500">{validation.title ? validation.title : ""}</p>
    </div>

    <div class="mb-3">
      <Label for="short_description">Description</Label>
      <Textarea
        id="short_description"
        bind:value={heroDetails.short_description}
        placeholder="Description"
        class="textarea {validation.short_description ? 'border-red-500' : ''}"
      />
      <p class="text-red-500">
        {validation.short_description ? validation.short_description : ""}
      </p>
    </div>

    <div class="mb-3">
      <Label for="cta_text">CTA Button Name</Label>
      <Input
        id="cta_text"
        bind:value={heroDetails.cta_text}
        placeholder="CTA Button Name"
        class="textarea {validation.cta_text ? 'border-red-500' : ''}"
      />
      <p class="text-red-500">
        {validation.cta_text ? validation.cta_text : ""}
      </p>
    </div>

    <div class="mb-3">
      <Label for="link">CTA Link</Label>
      <Input
        id="link"
        bind:value={heroDetails.link}
        placeholder="CTA Link"
        class="textarea {validation.link ? 'border-red-500' : ''}"
      />
      <p class="text-red-500">{validation.link ? validation.link : ""}</p>
    </div>
    <div class="flex items-center gap-2">
      <Label for="Hero" class="ms-3">Is In Shop Page:</Label>

      <div class="grid ">
        <Switch id="Hero" bind:checked={heroDetails.is_in_shop_page} />
      </div>
    </div>
    <div class="flex justify-between mb-3">
      <Button type="button" variant="outline" on:click={pickAvatar}>
        <i class="fa-solid fa-image text-sm"></i>Upload image
      </Button>
      <label for="file-input">
        {#if isUpLoadingImage}
          <div class="flex gap-2">
            loading...
            <div class=" flex items-center justify-center bg-opacity-50">
              <div
                class="animate-spin rounded-full size-5 border-t-2 border-b-2 border-blue-500"
              ></div>
            </div>
          </div>
        {:else}
          <img
            class:showImg={heroDetails.image}
            class:hideImg={!heroDetails.image}
            src={updateImage
              ? window.URL.createObjectURL(heroDetails.image)
              : editForm
                ? `${heroDetails.image}`
                : ""}
            alt="Avatar"
            class="showImg"
          />
        {/if}
      </label>
      <input
        type="file"
        id="file-input"
        bind:this={imageUpload}
        hidden
        required={!editForm}
        accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
        on:change={uploadAvatar}
      />
    </div>
    <p class="text-red-500">{validation.image ? validation.image : ""}</p>
    <Dialog.Footer class="justify-between space-x-2">
      <Button type="button" variant="ghost" on:click={cancelModel}
        >Cancel</Button
      >
      <Button
        type="submit"
        disabled={isLoading || isUpLoadingImage}
        on:click={createHero}
        >{editForm ? "Update" : "Save"}
        {#if isLoading || isUpLoadingImage}
          <LoaderCircle class="animate-spin mr-2 h-4 w-4" />
        {/if}</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<style>
  .hideImg {
    display: none;
  }

  .showImg {
    display: block;
    height: 6rem;
    width: 6rem;
    border-radius: 20px;
    object-fit: cover;
  }
</style>
