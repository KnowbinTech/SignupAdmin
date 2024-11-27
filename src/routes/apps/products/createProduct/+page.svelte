<script lang="ts">
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import { createEventDispatcher } from "svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import { Label } from "$lib/components/ui/label";
  import { writable } from "svelte/store";
  import { toast } from "svelte-sonner";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { LoaderCircle } from "lucide-svelte";
  import { compressImage } from "$lib/Functions/commonFunctions";

  const dispatch = createEventDispatcher();

  export let editForm: boolean;
  export let editData: any;
  let selectedBrand: string;
  let tags: any = [];
  let selectedCategory: string;
  let selectedGst: string;
  let selectedGender: string;
  let editBrand: boolean = false;
  let editCategory: boolean = false;
  let editImage: boolean = false;
  let editTax: boolean = false;
  let tagInput: string = ""; // Holds the raw tag input from the user
  let validation: any = {};
  let isLoading = false;
  let isUpLoadingImage = false;

  const genders: string[] = ["Men", "Women", "Unisex", "Boys", "Girls"];
  // This function processes the tag input when the user types or pastes the tags

  let productDetails: any = {
    id: "",
    name: "",
    short_description: "",
    description: "",
    sku: "",
    price: "",
    gst: "",
    selling_price: "",
    categories: [],
    brand: "",
    is_disabled: false,
    hsn_code: "",
    rating: 0,
    noOfReviews: 0,
    tags: [],
    dimension: "",
    images: [],
    preferred_gender: "",
  };

  const reactiveImages = writable([]);

  if (editForm) {
    productDetails = editData;

    selectedGst = productDetails.gst
      ? productDetails.gst.name
      : "";

    selectedCategory = productDetails.categories[0]
      ? productDetails.categories[0].name
      : "";
    selectedBrand = productDetails.brand ? productDetails.brand.name : "";
    tagInput = productDetails.tags.map((tag: any) => tag).join(",");
  }

  type Brand = {
    id: string;
    name: string;
    logo: string;
    description: string;
  };

  type Categories = {
    id: string;
    name: string;
    description: string;
    tags: string[]; // Corrected type
    Image: string;
    status: string[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
  };

  type Gst = {
    id: string;
    name: string;
    slab: string;
  };

  export const brands = writable<Brand[]>([], (set) => {
    getBrands().then((data) => {
      set(data);
    });
  });

  async function getBrands() {
    try {
      const response = await API.get("/masterdata/brand/");
      return response.data.results;
    } catch (error) {
      console.error("fetch:brands:", error);
      return [];
    }
  }

  async function getTax() {
    try {
      let response = await API.get("/inventory/tax/");
      return response.data.results;
    } catch (error) {
      console.error("fetch:gst:", error);
    }
  }

  let gst = writable<Gst[]>([], (set) => {
    getTax().then((data) => {
      set(data);
    });
  });

  function handleTaxChange(selectedTaxId: string) {
    editTax = true;
    productDetails.gst = selectedTaxId;
    const taxArray = $gst;
    const foundTax = taxArray.find(
      (category: any) => category.id === selectedTaxId
    );
    if (foundTax) {
      selectedGst = foundTax.name;
    }
  }

  async function getCategory() {
    try {
      const res = await API.get("/masterdata/category/");
      return res.data.results;
    } catch (error) {
      console.error("fetch:brands:", error);
      return [];
    }
  }

  let categories = writable<Categories[]>([], (set) => {
    getCategory().then((data) => {
      set(data);
    });
  });

  function handleCategoryChange(selectedCategoryId: string) {
    editCategory = true;
    productDetails.categories = selectedCategoryId;
    const categoriesArray = $categories;
    const foundCategory = categoriesArray.find(
      (category: any) => category.id === selectedCategoryId
    );
    if (foundCategory) {
      selectedCategory = foundCategory.name;
    }
  }

  function handleGenderChange(gender: string) {
    // Renamed parameter for clarity
    // editCategory = true;
    productDetails.preferred_gender = gender;
    // const categoriesArray = $categories;
    // const foundGender = categoriesArray.find(
    //   (gender: any) => gender.id === selectedGenderId // Use selectedGenderId to find the gender
    // );
    // if (foundGender) {
    //   selectedGender = foundGender.name; // Update the outer selectedGender variable
    // }
  }

  function handleBrandChange(selectedBrandId: string) {
    editBrand = true;
    const brandsArray = $brands;
    productDetails.brand = selectedBrandId;
    const foundBrand = brandsArray.find((g: any) => g.id == selectedBrandId);
    if (foundBrand) {
      selectedBrand = foundBrand.name;
    }
  }

  async function createProduct() {
    if (isLoading) return;

    try {
      isLoading = true;
      productDetails.tags = tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      validation = {};

      if (productDetails.name == "") {
        validation.name = ["This field may not be blank."];
      }

      if (productDetails.short_description == "") {
        validation.short_description = ["This field may not be blank."];
      }

      if (productDetails.preferred_gender == "") {
        validation.preferred_gender = ["This field may not be blank."];
      }

      if (productDetails.description == "") {
        validation.description = ["This field may not be blank."];
      }

      if (productDetails.sku == "") {
        validation.sku = ["This field may not be blank."];
      }

      if (productDetails.price == "") {
        validation.price = ["This field may not be blank."];
      }

      if (productDetails.gst == "") {
        validation.gst = ["This field may not be blank."]; // Added validation for GST
      }

      if (productDetails.selling_price == "") {
        validation.selling_price = ["This field may not be blank."];
      }

      // if (productDetails.dimension == "") {
      //   validation.dimension = ["This field may not be blank."];
      // }

      if (productDetails.categories == "") {
        validation.categories = ["This field may not be blank."];
      }

      if (productDetails.brand == "") {
        validation.brand = ["This field may not be blank."];
      }

      if (productDetails.hsn_code == "") {
        validation.hsn_code = ["This field may not be blank."];
      }

      if (productDetails.tags == "") {
        validation.tags = ["This field may not be blank."];
      }

      if (
        validation.name ||
        validation.short_description ||
        validation.description ||
        validation.preferred_gender ||
        validation.sku ||
        validation.price ||
        validation.gst ||
        validation.selling_price ||
        validation.categories ||
        validation.brand ||
        validation.hsn_code ||
        validation.dimension ||
        validation.tags
      ) {
        toast(`Please fill the required field`);
      } else {
        const form = new FormData();
        if (!editBrand) {
          productDetails.brand = productDetails.brand.id;
        }
        if (!editCategory) {
          productDetails.categories = productDetails.categories[0].id;
        }

        if(!editTax){
          console.log(productDetails.gst)
          productDetails.gst = productDetails.gst.id
        }
        form.append("name", productDetails.name);
        form.append("short_description", productDetails.short_description);
        form.append("description", productDetails.description);
        form.append("sku", productDetails.sku);
        form.append("price", productDetails.price);
        form.append("gst", productDetails.gst);
        form.append("selling_price", productDetails.selling_price);
        // form.append("dimension", productDetails.dimension);
        form.append("condition", productDetails.condition);
        form.append("categories", productDetails.categories);
        form.append("brand", productDetails.brand);
        form.append("is_disabled", productDetails.is_disabled);
        form.append("hsn_code", productDetails.hsn_code);
        form.append("rating", productDetails.rating);
        form.append("noOfReviews", productDetails.noOfReviews);
        form.append("tags", productDetails.tags);
        form.append("preferred_gender", productDetails.preferred_gender);

        if (editImage) {
          for (let i = 0; i < productDetails.images.length; i++) {
            form.append("images", productDetails.images[i]);
          }
        }

        const url = editForm
          ? `/products/product/${productDetails.id}/update_record/`
          : "/products/product/create_record/";

        if (editForm) {
          await API.put(url, form);
        } else {
          await API.post(url, form);
        }

        dispatch("newProduct");
        const action = editForm ? "Product Updated" : "Product Created";
        toast(`${action} successfully!`);
        dispatch("cancel");
      }
    } catch (error: any) {
      const action = editForm ? "Product Updated" : "Product Created";
      console.error("create:product:", error);
      validation = error.response.data;
      toast(`Failed to ${action}`);
    } finally {
      isLoading = false;
    }
  }

  function cancelModel() {
    editBrand = false;
    editCategory = false;
    dispatch("cancel");
  }

  let imageUpload: HTMLInputElement;

  function pickAvatar() {
    imageUpload.click();
  }

  async function uploadAvatar() {
    editImage = true;
    isUpLoadingImage = true;
    if (imageUpload.files && imageUpload.files.length > 0) {
      for (let i = 0; i < imageUpload.files.length; i++) {
        if (imageUpload.files[i].size / 1024 > 45) {
          let image = await compressImage(imageUpload.files[i], true);
          productDetails.images.push(image);
        } else {
          productDetails.images.push(imageUpload.files[i]);
        }
      }
      // Update the reactiveImages store
      reactiveImages.set(productDetails.images);
      // Update the preview image with the last selected image
      const img: HTMLImageElement | null = document.getElementById(
        "selected-logo"
      ) as HTMLImageElement;
      if (img) {
        img.src = window.URL.createObjectURL(
          productDetails.images[productDetails.images.length - 1]
        );
      }
    }
    isUpLoadingImage = false;
  }
  function removeImage(index: any) {
    const newImages = [...$reactiveImages];
    newImages.splice(index, 1);
    reactiveImages.set(newImages);
    productDetails.images = newImages; // Update productDetails.images
  }

  // validation for selling price and price
  function sellingPriceValidation(event: any) {
    const newValue = event.target.value;
    // Regular expression to match only numeric characters
    const numericRegex = /^[0-9]*$/;

    if (!numericRegex.test(newValue)) {
      validation.selling_price = ["Only numbers are allowed."];
    } else {
      productDetails.selling_price = newValue;
      validation.selling_price = ""; // Clear validation message if input is valid
    }
  }

  function priceValidation(event: any) {
    const newValue = event.target.value;
    // Regular expression to match only numeric characters
    const numericRegex = /^[0-9]*$/;

    if (!numericRegex.test(newValue)) {
      validation.price = ["Only numbers are allowed."];
    } else {
      productDetails.price = newValue;
      validation.price = ""; // Clear validation message if input is valid
    }
  }
  const charLimit = 200;
  // form validation for short descreption
  function handleInputChange(event: any) {
    const newValue = event.target.value;
    const remainingChars = charLimit - newValue.length;

    if (remainingChars < 0) {
      // If the word limit is exceeded, truncate the input value
      validation.short_description = ["Exceeds Word Limit (maximum 200 words)"];
    } else {
      // Update the productDetails and clear validation message
      productDetails.short_description = newValue;
      validation.short_description = "";
    }
  }

   // Function to allow only numbers
  function handleInput(event:any) {
    const value = event.target.value;
    productDetails.hsn_code = value.replace(/\D/g, ''); // Remove non-numeric characters
  }
</script>

<Dialog.Root
  open={true}
  onOpenChange={cancelModel}
  preventScroll={true}
  closeOnOutsideClick={false}
>
  <Dialog.Content class=" max-h-svh overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>{editForm ? "Edit Product" : "Add Product"}</Dialog.Title>
    </Dialog.Header>

    <div class="grid grid-cols-3 gap-4">
      <div class="grid gap-2">
        <Label for="area">Product Name</Label>
        <Input
          id="area"
          placeholder="name"
          bind:value={productDetails.name}
          class={validation.name ? "border-red-500" : ""}
        />
        <p class="text-red-500">{validation.name ? validation.name : ""}</p>
      </div>
      <div class="grid gap-2">
        <Label for="security-level">Category</Label>
        <Select.Root>
          <Select.Trigger
            class="input capitalize {validation.categories
              ? 'border-red-500'
              : ''}"
          >
            {selectedCategory ? selectedCategory : "Select a Category"}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each $categories as category}
                <Select.Item
                  value={category.id}
                  label={category.name}
                  class="capitalize card"
                  on:click={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <p class="text-red-500">
          {validation.categories ? validation.categories : ""}
        </p>
      </div>
      <div class="grid gap-2">
        <Label for="security-level">Brand</Label>
        <Select.Root>
          <Select.Trigger
            class="input capitalize {validation.brand ? 'border-red-500' : ''}"
          >
            {selectedBrand ? selectedBrand : "Select a Brand"}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each $brands as brand}
                <Select.Item
                  value={brand.id}
                  label={brand.name}
                  class="capitalize card"
                  on:click={() => handleBrandChange(brand.id)}
                >
                  {brand.name}
                </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <p class="text-red-500">{validation.brand ? validation.brand : ""}</p>
      </div>
    </div>

    <div class="grid grid-cols-3 items-end gap-4">
      <div class="grid gap-2">
        <Label for="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="Enter tags separated by commas"
          bind:value={tagInput}
          class={validation.tags ? "border-red-500" : ""}
        />
        <p class="text-red-500">{validation.tags ? validation.tags : ""}</p>
      </div>
      <div class="grid gap-2">
        <Label for="security-level">Preferred Gender</Label>
        <Select.Root>
          <Select.Trigger
            class="input capitalize {validation.preferred_gender
              ? 'border-red-500'
              : ''}"
          >
            {productDetails.preferred_gender
              ? productDetails.preferred_gender
              : "Select Gender"}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each genders as gender}
                <Select.Item
                  value={gender}
                  label={gender}
                  class="capitalize card"
                  on:click={() => handleGenderChange(gender)}
                >
                  {gender}
                </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <p class="text-red-500">
          {validation.preferred_gender ? validation.preferred_gender : ""}
        </p>
      </div>

      <div class="grid gap-2">
        <div class=" flex justify-start gap-10">
          <Label for="subject">Short description</Label>

          <p class=" text-blue-500 font-semibold">
            Remaining Letters: {Math.max(
              0,
              charLimit - productDetails.short_description.length
            )}
          </p>
        </div>

        <Input
          id="subject"
          placeholder="short description of the product"
          bind:value={productDetails.short_description}
          class={validation.short_description ? "border-red-500" : ""}
          on:input={handleInputChange}
        />
        <p class="text-red-500">
          {validation.short_description ? validation.short_description : ""}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="grid gap-2">
        <Label for="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Please include all information relevant to your product."
          bind:value={productDetails.description}
          class={validation.description ? "border-red-500" : ""}
        />
        <p class="text-red-500">
          {validation.description ? validation.description : ""}
        </p>
      </div>
      <div class="grid gap-2">
        <Label for="security-level">Dimension</Label>
        <Textarea
          id="dimension"
          placeholder="Dimension"
          bind:value={productDetails.dimension}
          class={validation.dimension ? "border-red-500" : ""}
        />
        <p class="text-red-500">
          {validation.dimension ? validation.dimension : ""}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div class="grid grid-cols-3 gap-2">
        <div class="grid gap-2">
          <Label for="area">Selling Price</Label>
          <div class="relative">
            <Input
              id="area"
              class="pl-8 {validation.selling_price ? 'border-red-500' : ''}"
              placeholder="Selling Price"
              type="number"
              bind:value={productDetails.selling_price}
              on:input={sellingPriceValidation}
            />
            <p class="text-red-500">
              {validation.selling_price ? validation.selling_price : ""}
            </p>
            <span class="absolute inset-y-0 left-0 flex items-center pl-2"
              >&#x20B9;</span
            >
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="security-level">GST</Label>
          <Select.Root>
            <Select.Trigger
              class="input capitalize {validation.gst ? 'border-red-500' : ''}"
            >
              {selectedGst ? selectedGst : "Select a Gst"}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                {#each $gst as tax}
                  <Select.Item
                    value={tax.id}
                    label={tax.name}
                    class="capitalize card"
                    on:click={() => handleTaxChange(tax.id)}
                  >
                    {tax.name}
                  </Select.Item>
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
          <p class="text-red-500">
            {validation.categories ? validation.categories : ""}
          </p>
        </div>
        <div class="grid gap-2">
          <Label for="area">MRP</Label>
          <div class="relative">
            <Input
              id="area"
              class="pl-8 {validation.price ? 'border-red-500' : ''}"
              placeholder="MRP"
              type="number"
              bind:value={productDetails.price}
              on:input={priceValidation}
            />
            <p class="text-red-500">
              {validation.price ? validation.price : ""}
            </p>
            <span class="absolute inset-y-0 left-0 flex items-center pl-2"
              >&#x20B9;</span
            >
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label for="area">HSN</Label>
          <Input
            id="area"
            placeholder="HSN Code"
            bind:value={productDetails.hsn_code}
            on:input={handleInput}
            class={validation.hsn_code ? "border-red-500" : ""}
          />
          <p class="text-red-500">
            {validation.hsn_code ? validation.hsn_code : ""}
          </p>
        </div>
        <div class="grid gap-2">
          <Label for="security-level">SKU</Label>
          <Input
            id="area"
            placeholder="SKU"
            bind:value={productDetails.sku}
            class={validation.sku ? "border-red-500" : ""}
          />
          <p class="text-red-500">{validation.sku ? validation.sku : ""}</p>
        </div>
      </div>
    </div>
    {#if !editForm}
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label for="area">Display Image</Label>
          <Button
            id="area"
            variant="outline"
            placeholder="name"
            on:click={pickAvatar}
          >
            Upload Image
          </Button>

          <input
            type="file"
            id="file-input"
            bind:this={imageUpload}
            hidden
            multiple
            accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
            on:change={uploadAvatar}
          />
        </div>
        <div
          style="display:flex; justify-content: center; 
          align-items: center; margin-top: 10px;"
        >
          {#if productDetails.images.length > 0 || isUpLoadingImage}
            <div class="image-preview-container">
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
                {#each $reactiveImages as image, index}
                  <div class="image-container">
                    <img
                      id="selected-logo-{index}"
                      class="selected-logo w-32 h-32 object-cover rounded-md"
                      alt=""
                      src={window.URL.createObjectURL(image)}
                    />
                    <button
                      class="remove-btn"
                      on:click={() => removeImage(index)}
                    >
                      &times;
                    </button>
                  </div>
                {/each}
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {/if}
    <Dialog.Footer class="justify-between space-x-2">
      <Button
        variant="ghost"
        on:click={() => cancelModel()}
        disabled={isLoading}
      >
        Cancel
      </Button>
      {#if editForm === false}
        <Button
          on:click={() => createProduct()}
          disabled={isLoading || isUpLoadingImage}
          class="relative"
        >
          Save
          {#if isLoading || isUpLoadingImage}
            <LoaderCircle class="animate-spin mr-2 h-4 w-4" />
          {/if}
        </Button>
      {:else}
        <Button
          on:click={() => createProduct()}
          disabled={isLoading || isUpLoadingImage}
          class="relative"
        >
          Update
          {#if isLoading || isUpLoadingImage}
            <LoaderCircle class="animate-spin mr-2 h-4 w-4" />
          {/if}
        </Button>
      {/if}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<style>
  .image-preview-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
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
