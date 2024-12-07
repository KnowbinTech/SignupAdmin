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
  let deletingReview: any;

  let editData: any;
  let editForm: boolean = false;

  let hidableCoulumns: any[] = [];

  async function getReviews() {
    try {
      let res = await API.get(
        `/customer/manage/reviews/?page=${page}&per_page=${per_page}&ordering=${sortField}&search=${searchData}`
      );
      totalItems = res.data.total;
      tableData = res.data.results;
      hidableCoulumns = res.data.columns
    } catch (error) {
      console.error("fetch:reviews:", error);
      return [];
    }
  }

  async function getNextPage() {
    page += 1;
    await getReviews();
  }

  async function getPage(event: any) {
    page = event.detail;
    await getReviews();
  }

  async function getPreviousPage() {
    page -= 1;
    await getReviews();
  }

  function onEdit(data: any) {
    editData = data;
    showForm = true;
    editForm = true;
  }

  function handleNewReview() {
    editData = null;
    editForm = false;
    showForm = false;
    getReviews();
  }

  function onDelete(id: any, name: any) {
    showDeleteModal = true;
    deletingReview = {
      id: id,
      name: name,
    };
  }

  function confirmDelete() {
    API.delete(`/masterdata/review/${deletingReview.id}/delete_record/`)
      .then((response) => {
        closeDeleteModal();
        getReviews();
        toast(response.data.message);
      })
      .catch((error) => {
        console.error("Error deleting Review:", error);
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
    getReviews();
  });

  function sortName() {
    if (sortData) {
      sortField = "name";
      getReviews();
      sortData = !sortData;
    } else {
      sortField = "-name";
      getReviews();
      sortData = !sortData;
    }
  }

  function searchName(event: any) {
    searchData = event.target.value;
    getReviews();
  }

  function pageLimit(event: any, value: any) {
    per_page = value;
    getReviews();
  }
</script>

<div>
  {#if showDeleteModal}
    <ConfirmDeleteModal
      attribute={deletingReview.name}
      on:confirm={confirmDelete}
      on:cancel={closeDeleteModal}
    />
  {/if}
</div>


<div class="w-full p-5">
  <div class="my-2 flex justify-between">
    <div>
      <Input
        class="max-w-sm"
        placeholder="Search Reviews..."
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
              <DropdownMenu.CheckboxItem bind:checked={column.is_default}
                >{column.text}</DropdownMenu.CheckboxItem
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
        {#each hidableCoulumns as column}
          {#if column.is_default}
            <Table.Head>{column.text}</Table.Head>
          {/if}
        {/each}
      </Table.Row>
    </Table.Header>
    {#each tableData as data}
      <Table.Row>
        <Table.Cell>{data.name}</Table.Cell>

        {#each hidableCoulumns as column}
          {#if column.is_default}
            <Table.Cell>{data[column.value]}</Table.Cell>
          {/if}
        {/each}
        <!-- <Table.Cell>
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
        </Table.Cell> -->
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
