<script lang="ts">
    import TransactionTable from "./transactionTable.svelte";
  </script>
  
  <div class="m-3 glow-border">
    <div
      class=" bg-background glow-border-content text-foreground p-4 px-6"
      style="height: calc(100vh - 80px);"
    >
      <div class="flex items-center justify-between">
        <h4
          class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1"
        >
          Transactions
        </h4>
      </div>
      <TransactionTable />
    </div>
  </div>
  