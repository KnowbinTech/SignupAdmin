<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { createEventDispatcher } from "svelte";
  import * as Table from "$lib/components/ui/table/index.js";
  import logo from "$lib/images/SIGNUP_LOGO.png";

  const dispatch = createEventDispatcher();

  export let invoiceData: any;
  console.log({invoiceData})
  let orderItems: any[] = invoiceData ? invoiceData.orderitems : [];

  function print() {
    window.print();
  }

  function close() {
    dispatch("close");
  }

  function calculateInclusiveGST(totalPrice: any, gstRate: any) {
    totalPrice = parseFloat(totalPrice);
    gstRate = parseFloat(gstRate);
    const gstAmount = (totalPrice * gstRate) / (100 + gstRate);
    const priceWithoutGST = totalPrice - gstAmount;

    return {
      totalPrice,
      gstRate,
      gstAmount: parseFloat(gstAmount.toFixed(2)),
      priceWithoutGST: parseFloat(priceWithoutGST.toFixed(2)),
    };
  }

  // Calculate totals
  let totalGST = 0;
  let totalPriceWithoutGST = 0;
  let grandTotal = 0;

  $: {
    totalGST = 0;
    totalPriceWithoutGST = 0;
    grandTotal = 0;

    orderItems.forEach((item) => {
      const { gstAmount, priceWithoutGST, totalPrice } = calculateInclusiveGST(
        item.total_amount,
        item.product_variant.product.gst.slab
      );
      totalGST += gstAmount;
      totalPriceWithoutGST += priceWithoutGST;
      grandTotal += totalPrice;
    });

    totalGST = parseFloat(totalGST.toFixed(2));
    totalPriceWithoutGST = parseFloat(totalPriceWithoutGST.toFixed(2));
    grandTotal = parseFloat(grandTotal.toFixed(2));
  }
</script>

<Dialog.Root open={true} preventScroll={true} onOpenChange={close} >
  <Dialog.Content class="overflow-auto max-h-[90vh] hidden-scrollbar">
    <Dialog.Header>
      <div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
        <div class="flex items-center">
          <h4
            class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1"
          >
            Invoice
          </h4>
          <div class="glow-border mr-4">
            <Button
              variant="outline"
              class="text-xs flex items-center gap-2  px-4 py-1.5"
              on:click={print}
            >
              <span>
                <i class="fa-solid fa-print text-sm"></i>
              </span>Print
            </Button>
          </div>
        </div>
        <div class="p-5">
          <div class="border p-5">
             <div class=" p-10">
  <div class="grid py-5 grid-cols-2">
    <div>
      <p>Bill From:</p>
      <p class="text-xl">Signup Casuals</p>
      <p>(address)</p>
    </div>
    <div class="flex justify-end">
      <img src={logo} alt="logo" class="h-20">
    </div>
  </div>
  <hr />
  <div class="grid py-5 grid-cols-2">
    <div>
      <p>Bill To:</p>
      <p class="text-xl">Customer Name</p>
      <p>(address)</p>
    </div>
    <div class="flex justify-end">
      <div>
        <p>INVOICE:</p>
        <p>Date:</p>
      </div>
      <div class="ml-5">
        <p>INV-0000000000</p>
        <p>{invoiceData.created_at.split(" ")[0]}</p>
      </div>
    </div>
  </div>
<div class="py-5">
  <Table.Root>
    <Table.Caption></Table.Caption>
    <Table.Header class="bg-gray-100">
      <Table.Row>
        <Table.Head>Item</Table.Head>
        <Table.Head>Quantity</Table.Head>
        <Table.Head>Rate</Table.Head>
        <Table.Head>Tax</Table.Head>
        <Table.Head>Amount</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each orderItems as item}
      <Table.Row>
        <Table.Cell>{item.product_variant.product.name}</Table.Cell>
        <Table.Cell>{item.quantity}</Table.Cell>
        <Table.Cell>
          {calculateInclusiveGST(
            item.total_amount,
            item.product_variant.product.gst.slab
          ).priceWithoutGST}
        </Table.Cell>
        <Table.Cell>
          {calculateInclusiveGST(
            item.total_amount,
            item.product_variant.product.gst.slab
          ).gstAmount}({item.product_variant.product.gst.slab}%)
        </Table.Cell>
        <Table.Cell>{item.total_amount}</Table.Cell>
      </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>

<hr />

<div class="grid py-5 grid-cols-2">
  <div></div>
  <div class="flex justify-end">
    <div>
      <p>Total Without GST:</p>
      <p>GST:</p>
      <p class="font-semibold">Grand Total:</p>
    </div>
    <div class="ml-5 text-right">
      <p>${totalPriceWithoutGST}</p>
      <p>${totalGST}</p>
      <p class="font-semibold">${grandTotal}</p>
    </div>
  </div>
</div>
</div>
          </div>
        </div>
      </div>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>

<style>

</style>