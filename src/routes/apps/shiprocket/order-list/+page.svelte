<script lang="ts">
  import ShiprocketOrderListTable from "./shiprocketOrderListTable.svelte";
</script>

<div class="m-3 shadow-md glow-border">
  <div class="bg-background glow-border-content text-foreground p-4 px-6">
    <div class="flex items-center">
      <h2
        class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1"
      >
        Shiprocket Order List
      </h2>
    </div>
    <ShiprocketOrderListTable />
  </div>
</div>
