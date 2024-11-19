<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import { toast } from "svelte-sonner";
  import * as Card from "$lib/components/ui/card";
  import { productDetailsStore } from "$lib/stores/data";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { LoaderCircle } from "lucide-svelte";
  import { writable } from "svelte/store";
  import { any } from "zod";
  import { compressImage } from "$lib/Functions/commonFunctions";

  const dispatch = createEventDispatcher();
  const reactiveImages = writable([]);

  interface AttributeDetail {
    id: number;
    name: string;
    values: string[];
  }

  export let editData: any;
  export let editForm: boolean;
  export let productData2: any;
  let attributegroup: any;
  let attributeDetails: AttributeDetail[] = [];
  let selectedAttributeValues = new Map();
  let imageUpload: any;
  let updateImage: boolean = false;
  let productData: any;
  let categoriesArray: any;
  let attribute_group: any;
  let isSubscribed = false;
  let unsubscribe: () => void;
  let validation: any = {};
  let isLoading = false;
  let editImage: boolean = false;

  let variantDetails: any = {
    product: "",
    attributes: [],
    stock: "",
    selling_price: "",
    images: [],
  };

  // if (editForm) {
  //   variantDetails = editData;
  // }

  if (editForm) {
    variantDetails = { 
      ...editData,
      images: Array.isArray(editData.images) ? editData.images : [] };
  } else {
    variantDetails = {
      product: { id: productData2.id },
      attributes: [],
      stock: "",
      selling_price: "",
      images: [],
    };
  }

  if (productData2) {
    // variantDetails.product = productData2.id;
    attribute_group = productData2.categories[0].attribute_group?.id;
  } else {
    attribute_group = editData.product.categories[0].attribute_group?.id;
  }

  // if (productID) {
  //   variantDetails.product = productID;
  // }

  onMount(() => {
    //   const persistedAttributeGroup = localStorage.getItem("attribute_group");
    //   if (persistedAttributeGroup) {
    //       attribute_group = parseInt(persistedAttributeGroup);
    //   }

    //   if(!isSubscribed) {
    //     unsubscribe = productDetailsStore.subscribe((value) => {
    //       productData = value;
    //       categoriesArray = productData.categories;
    //       // attribute_group = categoriesArray[0].attribute_group.id;
    //       if (categoriesArray && categoriesArray.length > 0) {
    //               attribute_group = categoriesArray[0].attribute_group.id;
    //               localStorage.setItem("attribute_group", attribute_group);
    //           }
    //     });
    //   isSubscribed = true;
    //   }

    if (editData && editData.attributes) {
      variantDetails.attributes = editData.attributes.map(
        (attr: { attributes: { id: number }; value: string; id: number }) => ({
          attribute: attr.attributes.id,
          value: attr.value,
          id: attr.id,
        })
      );
    }
  });

  async function handleAttributeGroupData() {
    try {
      if (attribute_group) {
        await fetchAttributegroup();
        if (attributegroup) {
          const matchedGroup = attributegroup.find(
            (group: any) => group.id === attribute_group
          );
          if (matchedGroup) {
            const { name, attributes } = matchedGroup;
            attributeDetails = [];
            attributes.forEach((attr: any) => {
              if (
                attr.value &&
                Array.isArray(attr.value) &&
                attr.value.length > 0
              ) {
                const values = attr.value[0].split(",");
                attributeDetails.push({
                  id: attr.id,
                  name: attr.name,
                  values: values,
                });
              } else {
                console.log(
                  "Attribute Values:",
                  "No values found or not an array"
                );
              }
            });
          }
        }
      }
    } catch (error) {
      console.log("handleAttributeGroupData:", error);
    }
  }

  function handleAttributeValueChange(
    attributeId: number,
    attributeName: string,
    value: string
  ) {
    selectedAttributeValues.set(attributeName, value);
    selectedAttributeValues = new Map(selectedAttributeValues);
    const existingIndex = variantDetails.attributes.findIndex(
      (attr: { attribute: number; value: string; id?: number }) =>
        attr.attribute === attributeId
    );
    if (existingIndex !== -1) {
      if (editForm) {
        variantDetails.attributes[existingIndex] = {
          attribute: attributeId,
          value: value,
          name: attributeName,
          id: variantDetails.attributes[existingIndex].id,
        };
      } else {
        variantDetails.attributes[existingIndex].value = value;
      }
    } else {
      variantDetails.attributes.push({
        attribute: attributeId,
        value: value,
        name: attributeName,
      });
    }
  }

  async function fetchAttributegroup() {
    try {
      const res = await API.get("/masterdata/attributegroup/");
      attributegroup = res.data.results;
    } catch (error) {
      console.log("category:fetch-attribute-group:", error);
    }
  }

  async function createVariant() {
    if (isLoading) return;

    try {
      isLoading = true;
      validation = {};

      if (variantDetails.attributes == "") {
        validation.attributes = ["This field may not be blank."];
      }

      if (variantDetails.stock == "") {
        validation.stock = ["This field may not be blank."];
      }

      if (variantDetails.selling_price == "") {
        validation.selling_price = ["This field may not be blank."];
      }

      if (
        validation.attributes ||
        validation.stock ||
        validation.selling_price
      ) {
        toast(`Please fill the required field`);
      } else {
        const form = new FormData();
        const pro = variantDetails.product.id;
        form.append("product", variantDetails.product.id);
        form.append("stock", variantDetails.stock);
        form.append("selling_price", variantDetails.selling_price);
        form.append("attributes", JSON.stringify(variantDetails.attributes));

        if (editImage) {
          for (let i = 0; i < variantDetails.images.length; i++) {
            form.append("images", variantDetails.images[i]);
          }
        }

        const url = editForm
          ? `/products/variant/${variantDetails.id}/update_record/`
          : "/products/variant/create_record/";

        if (editForm) {
          await API.put(url, form);
        } else {
          await API.post(url, form);
        }

        dispatch("newVariant");
        const action = editForm ? "Variant Updated" : "Variant Created";
        toast(`${action} successfully!`);
      }
    } catch (error: any) {
      const action = editForm ? "Update Variant" : "Create Variant";
      console.log(`${action}:`, error);
      validation = error.response.data;
      toast(`Failed to ${action}`);
    } finally {
      isLoading = false;
    }
  }

  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    editImage = true;
    if(imageUpload.files && imageUpload.files.length > 0) {
      for(let i = 0; i < imageUpload.files.length; i++) {
        if (imageUpload.files[0].size / 1024 > 45) {
          let image = 
          await compressImage(
            imageUpload.files[i], 
            true
          );
          variantDetails.images.push(image)
        } else {
          variantDetails.images.push(imageUpload.files[i]);
        }
      }
      reactiveImages.set(variantDetails.images);

      const img: HTMLImageElement | null = document.getElementById(
        "selected-logo"
      ) as HTMLImageElement;
      if(img) {
        img.src = window.URL.createObjectURL(
          variantDetails.images[variantDetails.images.length - 1]
        );
      }
    }
  }

  function removeImage(index: any) {
    const newImages = [...$reactiveImages];
    newImages.splice(index, 1);
    reactiveImages.set(newImages);
    variantDetails.images = newImages;
  }

  function isColorCode(value: string): boolean {
    return value.startsWith("#") && /^#[0-9A-Fa-f]{6}$/.test(value);
  }

  function cancelModel() {
    dispatch("cancel");
  }

  onMount(async () => {
    await fetchAttributegroup();
    await handleAttributeGroupData();
  });
</script>

<Dialog.Root open={true} onOpenChange={cancelModel} preventScroll={true}>
  <Dialog.Content class="max-w-md">
    <Dialog.Header>
      <Dialog.Title>
        {editForm ? "Update Variant" : "New Variant"}</Dialog.Title
      >
    </Dialog.Header>
    {#each attributeDetails as detail}
      <div class="flex justify-center">
        <div class="mb-3" style="min-width: 100px; max-width: 200px;">
          <Label>{detail.name}</Label>
        </div>
        <div class="mb-3 pl-4" style="min-width: 150px; max-width: 250px;">
          <Select.Root>
            <Select.Trigger
              class="input capitalize {validation.attributes
                ? 'border-red-500'
                : ''}"
            >
              {#if selectedAttributeValues.has(detail.name)}
                <div class="flex items-center gap-2">
                  {#if isColorCode(selectedAttributeValues.get(detail.name))}
                    <div
                      class="w-4 h-4 rounded-full border border-gray-300"
                      style="background-color: {selectedAttributeValues.get(
                        detail.name
                      )}"
                    ></div>
                  {/if}
                  {selectedAttributeValues.get(detail.name)}
                </div>
              {:else if variantDetails.attributes.find((attr) => attr.attribute === detail.id)?.value}
                <div class="flex items-center gap-2">
                  {#if isColorCode(variantDetails.attributes.find((attr) => attr.attribute === detail.id)?.value)}
                    <div
                      class="w-4 h-4 rounded-full border border-gray-300"
                      style="background-color: {variantDetails.attributes.find(
                        (attr) => attr.attribute === detail.id
                      )?.value}"
                    ></div>
                  {/if}
                  {variantDetails.attributes.find(
                    (attr) => attr.attribute === detail.id
                  )?.value}
                </div>
              {:else}
                Select an Attribute
              {/if}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                {#each detail.values as value, index}
                  <Select.Item
                    value={index}
                    label={value}
                    class="capitalize card"
                    on:click={() =>
                      handleAttributeValueChange(detail.id, detail.name, value)}
                  >
                    <div class="flex items-center gap-2">
                      {#if isColorCode(value)}
                        <div
                          class="w-4 h-4 rounded-full border border-gray-300"
                          style="background-color: {value}"
                        ></div>
                      {/if}
                      {value}
                    </div>
                  </Select.Item>
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
          <p class="text-red-500">
            {validation.attributes ? validation.attributes : ""}
          </p>
        </div>
      </div>
    {/each}
    <div class="mb-3">
      <Label for="stock">Stock</Label>
      <Input
        id="stock"
        type="number"
        bind:value={variantDetails.stock}
        placeholder="Stock"
        class={validation.stock ? "border-red-500" : ""}
      />
      <p class="text-red-500">{validation.stock ? validation.stock : ""}</p>
    </div>
    <div class="mb-3">
      <Label for="selling_price">Selling Price</Label>
      <Input
        id="selling_price"
        type="number"
        bind:value={variantDetails.selling_price}
        placeholder="Selling Price"
        class={validation.selling_price ? "border-red-500" : ""}
      />
      <p class="text-red-500">
        {validation.selling_price ? validation.selling_price : ""}
      </p>
    </div>
    {#if !editForm}
        <Button
          type="button"
          variant="outline"
          id="area"
          on:click={pickAvatar}
        >
          <i class="fa-solid fa-image text-sm"></i>
          Upload Variant image
        </Button>
        <input
          type="file"
          id="file-input"
          bind:this={imageUpload}
          hidden
          multiple
          accept="image/png, image/jpeg, image/webp"
          on:input={uploadAvatar}
        />
      <div class="flex flex-col gap-2">
        <div style="display:flex; justify-content: center;
             align-items:center; margin-top:10px;">
          {#if variantDetails.images.length > 0}
          <div class="image-preview-container">
            {#each $reactiveImages as image, index}
            <div class="image-container">
              <img 
                id="selected-logo-{index}"
                class="selected-logo w-32 h-32 object-cover rounded-md"
                alt="varient{index}"
                src={window.URL.createObjectURL(image)}
              />
              <button class="remove-btn"
                on:click={() => removeImage(index)}>
                &times;
              </button>
            </div>
            {/each}
          </div>
          {/if}
        </div>
      </div>
    {/if}
    <Dialog.Footer class="justify-between space-x-2">
      <Button
        type="button"
        variant="ghost"
        on:click={cancelModel}
        disabled={isLoading}>Cancel</Button
      >
      {#if editForm === false}
        <Button
          type="submit"
          on:click={createVariant}
          disabled={isLoading}
          class="relative"
        >
          {#if isLoading}
            <LoaderCircle class="animate-spin mr-2 h-4 w-4" />
          {/if}
          Save</Button
        >
      {:else}
        <Button
          type="submit"
          on:click={createVariant}
          disabled={isLoading}
          class="relative"
        >
          {#if isLoading}
            <LoaderCircle class="animate-spin mr-2 h-4 w-4" />
          {/if}
          Update</Button
        >
      {/if}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<style>
  .hideImg {
    visibility: hidden;
  }
  .showImg {
    display: block;
    height: 6rem;
    width: 6rem;
    flex: none;
    border-radius: 20px;
    object-fit: cover;
  }

  .image-preview-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .selected-logo {
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
  }

  .image-container {
    position: relative;
    display: inline-block;
  }

  .remove-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
  }
</style>
