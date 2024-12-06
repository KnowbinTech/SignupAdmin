<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import { createEventDispatcher, onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { compressImage } from "$lib/Functions/commonFunctions";
  import { LoaderCircle } from "lucide-svelte";

  const dispatch = createEventDispatcher();

  export let editData;
  export let editForm: boolean;
  let updateImage: boolean = false;
  let validation: any = {};
  let isLoading = false;
  let isUpLoadingImage = false;

  let dimentionDetails:any = {
    name: "",
    length: 0,
    breadth: 0,
    height: 0,
    dimension_unit: "",
    weight: 0,
    weight_unit: "",
  };
  let id = "";

  const dimentionUnit = [
    { id: 1, name: "MM", value: "mm" },
    { id: 2, name: "CM", value: "cm" },
    { id: 3, name: "Inch", value: "inch" },
    { id: 4, name: "M", value: "M" },
  ];

  const weightUnit = [
    { id: 1, name: "Gm", value: "gm" },
    { id: 2, name: "Kg", value: "Kg" },
  ];

  if (editForm) {
    console.log(editData)
    dimentionDetails = {
      name: editData.name,
      length: editData.length,
      breadth: editData.breadth,
      height: editData.height,
      dimension_unit: editData.dimension_unit,
      weight: editData.weight,
      weight_unit: editData.weight_unit,
    };
    id = editData.id;
  }

  async function createDimention() {
    if (isLoading) return;

    try {
      isLoading = true;
      validation = {};

      if (dimentionDetails.name == "") {
        validation.name = ["This field may not be blank."];
      }

      if (dimentionDetails.length == 0) {
        validation.length = ["This field may not be blank."];
      }

      if (dimentionDetails.breadth == 0) {
        validation.breadth = ["This field may not be blank."];
      }

      if (dimentionDetails.height == 0) {
        validation.height = ["This field may not be blank."];
      }

      if (dimentionDetails.dimension_unit == "") {
        validation.dimension_unit = ["This field may not be blank."];
      }

      if (dimentionDetails.weight == 0) {
        validation.weight = ["This field may not be blank."];
      }

      if (dimentionDetails.weight_unit == "") {
        validation.weight_unit = ["This field may not be blank."];
      }

      const form = new FormData();

      form.append("name", dimentionDetails.name);
      form.append("length", dimentionDetails.length);
      form.append("breadth", dimentionDetails.breadth);
      form.append("height", dimentionDetails.height);
      form.append("dimension_unit", dimentionDetails.dimension_unit);
      form.append("weight", dimentionDetails.weight);
      form.append("weight_unit", dimentionDetails.weight_unit);

      if (validation.name || validation.description) {
        toast(`Please fill the required field`);
      } else {
        const url = editForm
          ? `/masterdata/dimension/${id}/update_record/`
          : "/masterdata/dimension/create_record/";

        if (editForm) {
          await API.put(url, form);
        } else {
          await API.post(url, form);
        }

        dispatch("newDimension");
        const action = editForm ? "Dimension Updated" : "Dimension Created";
        toast(`${action} successfully!`);
      }
    } catch (error: any) {
      const action = editForm ? "Update Dimension" : "Create Dimension";
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
  <Dialog.Content class="max-w-md">
    <Dialog.Header class="font-bold mb-5">
      <Dialog.Title
        >{editForm ? "Update Dimension" : "New Dimension"}</Dialog.Title
      >
    </Dialog.Header>
    <div class=" grid gap-3">
      <Label for="name">Name</Label>
      <Input
        id="name"
        bind:value={dimentionDetails.name}
        placeholder="Name"
        class="input {validation.name ? 'border-red-500' : ''}"
        type="text"
      />
      <p class="text-red-500">{validation.name ? validation.name : ""}</p>
    </div>
    <div class="grid grid-cols-2 gap-3 border-b">
      <div class=" grid gap-3">
        <Label for="name">Weight</Label>
        <Input
          id="name"
          bind:value={dimentionDetails.weight}
          placeholder="Name"
          class="input {validation.weight ? 'border-red-500' : ''}"
          type="number"
        />
        <p class="text-red-500">{validation.weight ? validation.weight : ""}</p>
      </div>
      <div class="grid">
        <Label for="name">Weight Unit</Label>

        <Select.Root portal={null}>
          <Select.Trigger class=" {validation.weight_unit ? 'border-red-500' : ''}">
              {dimentionDetails.weight_unit ? dimentionDetails.weight_unit: "Select a unit"}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each weightUnit as unit}
                <Select.Item
                  value={unit.value}
                  on:click={() => {
                    (dimentionDetails.weight_unit = unit.value)}}
                  label={unit.name}>{unit.name}</Select.Item
                >
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <p class="text-red-500">{validation.weight_unit ? validation.weight_unit : ""}</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="grid gap-3">
        <Label for="name">Length</Label>
        <Input
          id="name"
          bind:value={dimentionDetails.length}
          placeholder="Name"
          class="input {validation.length ? 'border-red-500' : ''}"
          type="number"
        />
        <p class="text-red-500">{validation.length ? validation.length : ""}</p>
      </div>
      <div class="grid gap-3">
        <Label for="name">Breadth</Label>
        <Input
          id="name"
          bind:value={dimentionDetails.breadth}
          placeholder="Name"
          class="input {validation.breadth ? 'border-red-500' : ''}"
          type="number"
        />
        <p class="text-red-500">
          {validation.breadth ? validation.breadth : ""}
        </p>
      </div>

      <div class="grid gap-3">
        <Label for="description">Height</Label>
        <Input
          id="description"
          bind:value={dimentionDetails.height}
          placeholder="Description"
          class=" {validation.height ? 'border-red-500' : ''}"
          type="number"
        />
        <p class="text-red-500">
          {validation.height ? validation.height : ""}
        </p>
      </div>
      <div class="grid">
        <Label for="name">Dimension Unit</Label>

        <Select.Root portal={null} >
          
          <Select.Trigger class=" {validation.dimension_unit ? 'border-red-500' : ''}">
            {dimentionDetails.dimension_unit ? dimentionDetails.dimension_unit: "Select a unit"}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each dimentionUnit as unit}
                <Select.Item value={unit.value} label={unit.name}
                on:click={() => {
                    (dimentionDetails.dimension_unit = unit.value)}}
                  >{unit.name}</Select.Item
                >
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <p class="text-red-500">
          {validation.dimension_unit ? validation.dimension_unit : ""}
        </p>
      </div>
    </div>
    <Dialog.Footer>
      <Button
        type="button"
        variant="ghost"
        on:click={cancelModel}
        disabled={isLoading}>Cancel</Button
      >
      {#if editForm === false}
        <Button
          type="submit"
          on:click={createDimention}
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
          type="submit"
          on:click={createDimention}
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
