<script lang="ts">
  import CaretSort from "svelte-radix/CaretSort.svelte";
  import ChevronDown from "svelte-radix/ChevronDown.svelte";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import API from "$lib/services/api";
  import { MoreHorizontal } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import CreateDimension from "./createDimension/+page.svelte";
  import Pagination from "$lib/components/ui/table-pagination/pagination.svelte";
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  export let showForm: boolean = false;
  // variables to handle pagination and table details
  let page: number = 1;
  let totalItems: number;
  let per_page: number = 10;
  let tableData: any[] = [];
  let sortData: boolean = true;
  let sortField: string = "";
  let searchData: string = "";

  let showDeleteModal = false;
  let deletingDimension: any;

  let editData: any;
  let editForm: boolean = false;

  let hidableCoulumns: any[] = [
    { name: "Weight", label: "weight", value: true },
    { name: "Height", label: "height", value: true },
    { name: "Length", label: "length", value: true },
    { name: "Breadth", label: "breadth", value: true },
    { name: "Weight Unit", label: "weight_unit", value: true },
    { name: "Dimension Unit", label: "dimension_unit", value: true },
    { name: "Created At", label: "created_at", value: false },
    { name: "Updated At", label: "updated_at", value: false },
    { name: "Created By", label: "created_by", value: false },
    { name: "Updated By", label: "updated_by", value: false },
  ];

  async function getDimensions() {
    try {
      let res = await API.get(
        `/masterdata/dimension/?page=${page}&per_page=${per_page}&ordering=${sortField}&search=${searchData}`
      );
      totalItems = res.data.total;
      tableData = res.data.results;
    } catch (error) {
      console.error("fetch:dimensions:", error);
      return [];
    }
  }

  async function getNextPage() {
    page += 1;
    await getDimensions();
  }

  async function getPage(event: any) {
    page = event.detail;
    await getDimensions();
  }

  async function getPreviousPage() {
    page -= 1;
    await getDimensions();
  }

  function onEdit(data: any) {
    editData = data;
    showForm = true;
    editForm = true;
  }

  function handleNewDimension() {
    editData = null;
    editForm = false;
    showForm = false;
    getDimensions();
  }

  function onDelete(id: any, name: any) {
    showDeleteModal = true;
    deletingDimension = {
      id: id,
      name: name,
    };
  }

  function confirmDelete() {
    API.delete(`/masterdata/dimension/${deletingDimension.id}/delete_record/`)
      .then((response) => {
        closeDeleteModal();
        getDimensions();
        toast(response.data.message);
      })
      .catch((error) => {
        console.error("Error deleting Dimension:", error);
        closeDeleteModal();
        toast(error.response.data.message);
      });
  }

  function closeDeleteModal() {
    showDeleteModal = false;
  }

  function cancelEditModel() {
    editData = null;
    editForm = false;
    showForm = false;
    dispatch("cancel");
  }

  onMount(() => {
    getDimensions();
  });

  function sortName() {
    if (sortData) {
      sortField = "name";
      getDimensions();
      sortData = !sortData;
    } else {
      sortField = "-name";
      getDimensions();
      sortData = !sortData;
    }
  }

  function searchName(event: any) {
    searchData = event.target.value;
    getDimensions();
  }

  function pageLimit(event: any, value: any) {
    per_page = value;
    getDimensions();
  }
</script>

<div>
  {#if showDeleteModal}
    <ConfirmDeleteModal
      attribute={deletingDimension.name}
      on:confirm={confirmDelete}
      on:cancel={closeDeleteModal}
    />
  {/if}
</div>

<div class="abc">
  {#if showForm}
    <CreateDimension
      {editData}
      {editForm}
      on:cancel={cancelEditModel}
      on:newDimension={() => handleNewDimension()}
    />
  {/if}
</div>

<div class="w-full p-5">
  <div class="my-2 flex justify-between">
    <div>
      <Input
        class="max-w-sm"
        placeholder="Search Dimensions..."
        type="text"
        on:input={(event) => searchName(event)}
      />
    </div>
    <div class="flex">
      <div class="mr-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="outline" size="sm">
              Column
              <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {#each hidableCoulumns as column}
              <DropdownMenu.CheckboxItem bind:checked={column.value}
                >{column.name}</DropdownMenu.CheckboxItem
              >
            {/each}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="outline" size="sm">
              {per_page}
              <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item on:click={(event) => pageLimit(event, 10)}
              >10</DropdownMenu.Item
            >
            <DropdownMenu.Item on:click={(event) => pageLimit(event, 20)}
              >20</DropdownMenu.Item
            >
            <DropdownMenu.Item on:click={(event) => pageLimit(event, 25)}
              >25</DropdownMenu.Item
            >
            <DropdownMenu.Item on:click={(event) => pageLimit(event, 50)}
              >50</DropdownMenu.Item
            >
            <DropdownMenu.Item on:click={(event) => pageLimit(event, 100)}
              >100</DropdownMenu.Item
            >
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  </div>
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head
          >Name
          <Button on:click={() => sortName()} variant="ghost"
            ><CaretSort class="w-4 h-4" /></Button
          >
        </Table.Head>
        {#each hidableCoulumns as column}
          {#if column.value}
            <Table.Head>{column.name}</Table.Head>
          {/if}
        {/each}
        <Table.Head>Action</Table.Head>
      </Table.Row>
    </Table.Header>
    {#each tableData as data}
      <Table.Row>
        <Table.Cell>{data.name}</Table.Cell>

        {#each hidableCoulumns as column (column.name)}
          {#if column.value}
            <Table.Cell>{data[column.label]}</Table.Cell>
          {/if}
        {/each}
        <Table.Cell>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button builders={[builder]} variant="ghost"
                ><MoreHorizontal class="h-4 w-4" /></Button
              >
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="absolute">
              <DropdownMenu.Item on:click={() => onEdit(data)}
                ><i class="fa fa-pencil sm mr-2"></i>Edit</DropdownMenu.Item
              >
              <DropdownMenu.Item on:click={() => onDelete(data.id, data.name)}
                ><i class="fa fa-trash sm mr-2" style="color:red"
                ></i>Delete</DropdownMenu.Item
              >
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Root>

  <div class="d-flex justify-end align-items-end mt-3">
    <Pagination
      {totalItems}
      {per_page}
      on:prev={getPreviousPage}
      on:next={getNextPage}
      on:page={(event) => getPage(event)}
    />
  </div>
</div>
