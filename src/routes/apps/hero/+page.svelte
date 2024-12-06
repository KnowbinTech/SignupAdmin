<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import HeroTable from "./heroTable.svelte";
  import {exportExcel} from '$lib/Functions/commonFunctions' 

  let showForm: boolean = false;

  interface HeroExportData {
    title: string;
    image: string;
    short_description: string;
    cta_text: string;
    is_in_shop_page: boolean;
    link: string;
  }

  function toggleForm() {
    showForm = !showForm;
  }

  // async function exportHero() {
    // redirect(302,'/api/cms/hero-section/export/')
    // window.open('/api/cms/hero-section/export/');
      // const apiUrl = '/api/cms/hero-section/export/';
    //   const params = new URLSearchParams({
    //     fields: JSON.stringify(['field1', 'field2']),
    //     includeDeleted: 'false',
    // }).toString();

    // try {
        // const response = await API.get('/cms/hero-section/export/');
        // window.open(response.data)

    //     if (response.status !== 200) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //     }
        // console.log("data", response.data)
        // const blob = await response.data.blob();
        // const url = window.URL.createObjectURL(blob);
        // console.log({url})

    //     // Create a temporary link element and trigger the download
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = 'exported_data.xlsx'; // Suggested filename
    //     document.body.appendChild(link);
    //     link.click();

    //     // Cleanup
    //     link.remove();
    //     window.URL.revokeObjectURL(url);
    // } catch (error) {
    //     console.error('Error downloading the file:', error);
    // }
// }






</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center">
    <h4
      class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1"
    >
      Hero Section
    </h4>
    <div class="glow-border mr-4">
      <Button
        variant="outline"
        class="text-xs flex items-center gap-2  px-4 py-1.5"
        on:click={() => toggleForm()}
      >
        <span>
          <i class="fa-solid fa-plus text-sm"></i>
        </span>New Hero Section
      </Button>
    </div>
    <div class="glow-border mr-4 ">
      <Button variant="outline" class=""
      on:click={()=>exportExcel('/cms/hero-section/export/')}
      >Export Hero</Button>
  </div>
  </div>
  <HeroTable {showForm} on:cancel={() => (showForm = false)}/>

</div>
