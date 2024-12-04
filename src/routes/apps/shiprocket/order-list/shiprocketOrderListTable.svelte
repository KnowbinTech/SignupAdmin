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

  let hidableColumns: any[] = [
    { name: "Channel Order ID", value: false },
    { name: "Customer Email", value: false },
    { name: "Customer Phone", value: true },
    { name: "Pickup Location", value: false },
    { name: "Payment Method", value: true },
    { name: "Total Amount", value: true },
    { name: "Status", value: true },
    { name: "Shipping Method", value: false },
    { name: "Created At", value: false },
    { name: "Products", value: true }
  ];

  async function getShipments() {
    try {
      let res = await API.get(
        `/transaction/shiprocket/orders/?page=${page}&per_page=${per_page}&ordering=${sortField}&search=${searchData}`
      );
      totalItems = res.meta.pagination.total;
      tableData = res.data;
    } catch (error) {
      console.error("fetch:shipments:", error);
      return [];
    }
  }

  async function getNextPage() {
    page += 1;
    await getShipments();
  }

  async function getPage(event: any) {
    page = event.detail;
    await getShipments();
  }

  async function getPreviousPage() {
    page -= 1;
    await getShipments();
  }

  onMount(() => {
    getShipments();
  });

  function sortName() {
    if (sortData) {
      sortField = "customer_name";
      getShipments();
      sortData = !sortData;
    } else {
      sortField = "-customer_name";
      getShipments();
      sortData = !sortData;
    }
  }

  function searchName(event: any) {
    searchData = event.target.value;
    getShipments();
  }

  function pageLimit(event: any, value: any) {
    per_page = value;
    getShipments();
  }
</script>

<div class="w-full p-5">
  <div class="my-2 flex justify-between">
    <div>
      <Input
        class="max-w-sm"
        placeholder="Search Shipments..."
        type="text"
        on:input={(event) => searchName(event)}
      />
    </div>
    <div class="flex">
      <div class="mr-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="outline" size="sm">
              Columns
              <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {#each hidableColumns as column}
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
        <Table.Head>
          Customer Name
          <Button on:click={() => sortName()} variant="ghost"
            ><CaretSort class="w-4 h-4" /></Button
          >
        </Table.Head>
        {#if hidableColumns[0].value}
          <Table.Head>Channel Order ID</Table.Head>
        {/if}
        {#if hidableColumns[1].value}
          <Table.Head>Customer Email</Table.Head>
        {/if}
        {#if hidableColumns[2].value}
          <Table.Head>Customer Phone</Table.Head>
        {/if}
        {#if hidableColumns[3].value}
          <Table.Head>Pickup Location</Table.Head>
        {/if}
        {#if hidableColumns[4].value}
          <Table.Head>Payment Method</Table.Head>
        {/if}
        {#if hidableColumns[5].value}
          <Table.Head>Total Amount</Table.Head>
        {/if}
        {#if hidableColumns[6].value}
          <Table.Head>Status</Table.Head>
        {/if}
        {#if hidableColumns[7].value}
          <Table.Head>Shipping Method</Table.Head>
        {/if}
        {#if hidableColumns[8].value}
          <Table.Head>Created At</Table.Head>
        {/if}
        {#if hidableColumns[9].value}
          <Table.Head>Products</Table.Head>
        {/if}
      </Table.Row>
    </Table.Header>
    {#each tableData as data}
      <Table.Row>
        <Table.Cell>{data.customer_name}</Table.Cell>
        {#if hidableColumns[0].value}
          <Table.Cell>{data.channel_order_id}</Table.Cell>
        {/if}
        {#if hidableColumns[1].value}
          <Table.Cell>{data.customer_email}</Table.Cell>
        {/if}
        {#if hidableColumns[2].value}
          <Table.Cell>{data.customer_phone}</Table.Cell>
        {/if}
        {#if hidableColumns[3].value}
          <Table.Cell>{data.pickup_location}</Table.Cell>
        {/if}
        {#if hidableColumns[4].value}
          <Table.Cell>{data.payment_method}</Table.Cell>
        {/if}
        {#if hidableColumns[5].value}
          <Table.Cell>{data.total}</Table.Cell>
        {/if}
        {#if hidableColumns[6].value}
          <Table.Cell>{data.status}</Table.Cell>
        {/if}
        {#if hidableColumns[7].value}
          <Table.Cell>{data.shipping_method}</Table.Cell>
        {/if}
        {#if hidableColumns[8].value}
          <Table.Cell>{data.channel_created_at}</Table.Cell>
        {/if}
        {#if hidableColumns[9].value}
          <Table.Cell>
            {#each data.products as product}
              {product.name} (Qty: {product.quantity})
            {/each}
          </Table.Cell>
        {/if}
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