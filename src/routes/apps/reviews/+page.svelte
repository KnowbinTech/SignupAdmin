<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import ReviewTable from "./reviewTable.svelte";
  import { exportExcel } from "$lib/Functions/commonFunctions";

</script>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center justify-between">
      <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Review & Rating</h4>
      <div class="glow-border mr-4">
        <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5"
        on:click={()=>exportExcel('/customer/manage/reviews/export/')}
        >Export Review</Button>
      </div>
     
  </div>
  <ReviewTable />
</div>