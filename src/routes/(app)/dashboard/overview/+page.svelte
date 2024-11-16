<script lang="ts">
  import { onMount } from 'svelte';
  import * as Card from "$lib/components/ui/card";
  import * as Tabs from "$lib/components/ui/tabs";
  import DollarSign from "lucide-svelte/icons/dollar-sign";
  import Activity from "lucide-svelte/icons/activity";
  import CreditCard from "lucide-svelte/icons/credit-card";
  import Users from "lucide-svelte/icons/users";
  import {
    DashboardMainNav,
    Overview,
    RecentSales,
    Search,
    UserNav,
  } from "$lib/components/dashboardui/index";
  import {
    dashboardStore,
    customerGrowthStore,
    customerOrderStore,
    customerRetentionStore,
    monthlyCustomerStore,
    dashboardService,
    isLoading,
    error
  } from '$lib/services/dashboard';
  import type { ApiResponse,
    DashboardData, 
    CustomerGrowth, 
    CustomerOrderAnalysis,
    CustomerRetention,
    MonthlyCustomerCount 
  } from '$lib/types/dashboard';

    // Subscribe to stores
  let dashboardData: DashboardData;
  let customerGrowth: CustomerGrowth;
  let loading: boolean;
  let errorMessage: string | null;
  
  dashboardStore.subscribe(value => {
    if (value) dashboardData = value;
  });
  
  customerGrowthStore.subscribe(value => {
    if (value) customerGrowth = value;
  });

  isLoading.subscribe(value => {
    loading = value;
  });

  error.subscribe(value => {
    errorMessage = value;
  });

  onMount(async () => {
    try {
      // Get current date and 30 days ago for default date range
      const toDate = new Date().toISOString().split('T')[0];
      const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      await Promise.all([
        dashboardService.fetchDashboardData(fromDate, toDate),
        dashboardService.fetchCustomerGrowth(),
        dashboardService.fetchCustomerRetention(),
        dashboardService.fetchMonthlyCustomerCount()
      ]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  });
</script>

<div>
<!-- {#if loading}
  <div class="flex items-center justify-center p-8">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
{:else if errorMessage}
  <div class="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
    {errorMessage}
  </div>
{:else} -->
  <Tabs.Content value="overview" class="space-y-4">
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card.Root>
        <Card.Header
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <Card.Title class="text-sm font-medium">Total Orders</Card.Title>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold">
			${dashboardData?.sales?.total_sales?.toLocaleString() ?? '0'}
		  </div>
          <p class="text-xs text-muted-foreground">
			{dashboardData?.sales?.percentage_change ?? '0%'}
		  </p>
        </Card.Content>
      </Card.Root>
      <Card.Root>
        <Card.Header
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <Card.Title class="text-sm font-medium">Customers</Card.Title>
          <Users class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold">+2350</div>
          <p class="text-xs text-muted-foreground">+180.1% from last month</p>
        </Card.Content>
      </Card.Root>
      <Card.Root>
        <Card.Header
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <Card.Title class="text-sm font-medium">Total Sales</Card.Title>
          <CreditCard class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold">+12,234</div>
          <p class="text-xs text-muted-foreground">+19% from last month</p>
        </Card.Content>
      </Card.Root>
      <Card.Root>
        <Card.Header
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <Card.Title class="text-sm font-medium">Website Traffic</Card.Title>
          <Activity class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold">+573</div>
          <p class="text-xs text-muted-foreground">+201 since last hour</p>
        </Card.Content>
      </Card.Root>
    </div>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card.Root class="col-span-4">
        <Card.Header>
          <Card.Title>Monthly Sales</Card.Title>
        </Card.Header>
        <Card.Content>
          <Overview data={dashboardData?.sales}/>
        </Card.Content>
      </Card.Root>
      <Card.Root class="col-span-3">
        <Card.Header>
          <Card.Title>Best Selling Products</Card.Title>
          <Card.Description
            >These are the top selling products.</Card.Description
          >
        </Card.Header>
        <Card.Content>
			{#if dashboardData?.products?.top_products}
				<RecentSales products={dashboardData.products.top_products} />
		  	{/if}
        </Card.Content>
      </Card.Root>
    </div>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card.Root class="col-span-3">
        <Card.Header>
          <Card.Title>Inventory</Card.Title>
        </Card.Header>
        <Card.Content>
          <RecentSales />
        </Card.Content>
      </Card.Root>
    </div>
  </Tabs.Content>
  <!-- {/if} -->
</div>