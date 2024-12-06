<script lang="ts">
    import TransactionTable from "./transactionTable.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { exportExcel } from "$lib/Functions/commonFunctions";
  </script>
  
  <div class="m-3 shadow-md glow-border">
    <div
      class="bg-background glow-border-content text-foreground p-4 px-6"
    >
      <div class="flex items-center justify-between p-4 ">
        <h2
          class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1"
        >
          Transactions
        </h2>
        <div class="glow-border mr-4 ">
          <Button variant="outline" class=""
          on:click={()=>exportExcel('/transaction/details/export/')}
          >Export</Button>
      </div>
      </div>
      <TransactionTable />
    </div>
  </div>
  