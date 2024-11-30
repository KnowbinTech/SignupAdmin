<script lang="ts">
  import CaretSort from "svelte-radix/CaretSort.svelte";
  import ChevronDown from "svelte-radix/ChevronDown.svelte";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import API from "$lib/services/api";
  import { onMount } from "svelte";
  import Pagination from "$lib/components/ui/table-pagination/pagination.svelte";

  let page: number = 1;
  let totalItems: number;
  let per_page: number = 10;
  let tableData: any[] = [];
  let sortData: boolean = true;
  let sortField: string = "";
  let searchData: string = "";

  // let hidableCoulumns: any[] = [
  //   { name: "Error", value: false },
  // ];


  async function getOrders() {
    try {
      let res = await API.get(
        `/transaction/details/?page=${page}&per_page=${per_page}&ordering=${sortField}&search=${searchData}`
      );
      totalItems = res.data.total;
      tableData = res.data.results;
    } catch (error) {
      console.error("fetch:order:", error);
      return [];
    }
  }

  async function getNextPage() {
    page += 1;
    await getOrders();
  }

  async function getPage(event: any) {
    page = event.detail;
    await getOrders();
  }

  async function getPreviousPage() {
    page -= 1;
    await getOrders();
  }

  onMount(() => {
    getOrders();
  });

  function sortName() {
    if (sortData) {
      sortField = "user";
      getOrders();
      sortData = !sortData;
    } else {
      sortField = "-user";
      getOrders();
      sortData = !sortData;
    }
  }

  function searchName(event: any) {
    searchData = event.target.value;
    getOrders();
  }

  function pageLimit(event: any, value: any) {
    per_page = value;
    getOrders();
  }
</script>

<div class="w-full p-5">
  <div class="my-2 flex justify-between">
    <div>
      <Input
        class="max-w-sm"
        placeholder="Search Orders..."
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
          >Transaction_id
          <Button on:click={() => sortName()} variant="ghost"
            ><CaretSort class="w-4 h-4" /></Button
          >
        </Table.Head>
          <Table.Head>Amount</Table.Head>
          <Table.Head>Order ID</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Response</Table.Head>
          <Table.Head>Error</Table.Head>
          <Table.Head>Response received date</Table.Head>
      </Table.Row>
    </Table.Header>
    {#each tableData as data}
      <Table.Row>
        <Table.Cell>{data.transaction_id}</Table.Cell>
          <Table.Cell>{data.amount}</Table.Cell>
          <Table.Cell>{data.order.order_id}</Table.Cell>
          <Table.Cell>{data.status}</Table.Cell>
          <Table.Cell>{data.response}</Table.Cell>
          <Table.Cell>{data.error}</Table.Cell>
          <Table.Cell>{data.response_received_date}</Table.Cell>
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
