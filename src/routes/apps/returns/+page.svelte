<script lang="ts">
  import ReturnTable from "./returnTable.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { exportExcel } from "$lib/Functions/commonFunctions";
</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center justify-between">
    <h4
      class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1"
    >
      Return and Refund
    </h4>
    <div class="glow-border mr-4 ">
      <Button variant="outline" class=""
      on:click={()=>exportExcel('/masterdata/return-reasons/export/')}
      >Export Returns Reasons</Button>
  </div>
  <div class="glow-border mr-4 ">
    <Button variant="outline" class=""
    on:click={()=>exportExcel('/customer/manage/return-request/export/')}
    >Export Return Requests</Button>
</div>
  </div>
  <ReturnTable />
</div>
