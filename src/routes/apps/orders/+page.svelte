<script lang="ts">
  import OrderTable from "./orderTable.svelte";
  import { Button } from "$lib/components/ui/button";
  import { exportExcel } from "$lib/Functions/commonFunctions";
</script>

<div class="m-3 glow-border">
  <div
    class=" bg-background glow-border-content text-foreground p-4 px-6"
  >
    <div class="flex items-center justify-between">
      <h4
        class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1"
      >
        Orders
      </h4>
      <div class="glow-border mr-4">
        <Button
          variant="outline"
          class=""
          on:click={()=>exportExcel('/orders/order/export/')}
          >Export</Button
        >
      </div>
    </div>
    <OrderTable />
  </div>
</div>
