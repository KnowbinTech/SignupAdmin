<script lang="ts">
  import ReviewTable from "./reviewTable.svelte";
  import { Button } from "$lib/components/ui/button";
  import { exportExcel } from "$lib/Functions/commonFunctions";

  let showForm: boolean = false;
  let renderTable: boolean = false;

  function toggleForm() {
    showForm = !showForm;
  }
</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center">
    <h4
      class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1"
    >
      Reviews
    </h4>
    <div class="glow-border mr-4 ">
      <Button variant="outline" class=""
      on:click={()=>exportExcel('/masterdata/review/export/')}
      >Export </Button>
  </div>
  </div>
  <ReviewTable {showForm} on:cancel={() => (showForm = false)} />
</div>
