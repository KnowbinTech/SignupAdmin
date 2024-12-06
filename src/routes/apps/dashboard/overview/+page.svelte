<script lang="ts">
  import { onMount } from "svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Tabs from "$lib/components/ui/tabs";
  import DollarSign from "lucide-svelte/icons/dollar-sign";
  import Activity from "lucide-svelte/icons/activity";
  import CreditCard from "lucide-svelte/icons/credit-card";
  import Users from "lucide-svelte/icons/users";
  import Package from "lucide-svelte/icons/package";
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
    error,
  } from "$lib/services/dashboard";
  import type {
    ApiResponse,
    DashboardData,
    CustomerGrowth,
    CustomerOrderAnalysis,
    CustomerRetention,
    MonthlyCustomerCount,
  } from "$lib/types/dashboard";
  import { Bar } from "$lib/components/charts/index.js";

  // Subscribe to stores
  let dashboardData: DashboardData;
  let customerGrowth: CustomerGrowth;
  let customerRetention: CustomerRetention;
  let monthlyCustomerCount: MonthlyCustomerCount;
  let loading: boolean;
  let errorMessage: string | null;

  // Format date to display month and year
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Calculate growth indicator
  const getGrowthIndicator = (growth: number) => {
    if (growth > 0) return 'text-green-500';
    if (growth < 0) return 'text-red-500';
    return 'text-yellow-500';
  };
  
  dashboardStore.subscribe((value) => {
    if (value) dashboardData = value;
  });

  customerGrowthStore.subscribe((value) => {
    if (value) customerGrowth = value;
  });

  customerRetentionStore.subscribe((value) => {
    if (value) customerRetention = value;
  });

  monthlyCustomerStore.subscribe((value) => {
    if (value) monthlyCustomerCount = value;
  });

  isLoading.subscribe((value) => {
    loading = value;
  });

  error.subscribe((value) => {
    errorMessage = value;
  });

  onMount(async () => {
    try {
      // Get current date and 30 days ago for default date range
      const toDate = new Date().toISOString().split("T")[0];
      const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      await Promise.all([
        dashboardService.fetchDashboardData(fromDate, toDate),
        dashboardService.fetchCustomerGrowth(),
        dashboardService.fetchCustomerRetention(),
        dashboardService.fetchMonthlyCustomerCount(),
      ]);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  });
</script>

<div>
{#if loading}
  <div class="flex items-center justify-center p-8">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
{:else if errorMessage}
  <div class="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
    {errorMessage}
  </div>
{:else}
  <Tabs.Content value="overview" class="space-y-4">
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card.Root>
        <Card.Header
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <Card.Title class="text-sm font-medium">Total Orders</Card.Title>
          <div>₹</div>
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold">
            ₹{dashboardData?.sales?.total_sales?.toLocaleString() ?? "0"}
          </div>
          <p class="text-xs text-muted-foreground">
            {dashboardData?.sales?.percentage_change ?? "0%"}
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
          <div class="text-2xl font-bold">
            {dashboardData?.customers?.customers ?? 0}
          </div>
          <p class="text-xs text-muted-foreground">
            {dashboardData?.customers?.new_customers ?? 0} new customers
          </p>
          <p class="text-xs text-muted-foreground">
            Retention: {dashboardData?.customers?.retention_rate ?? 0}%
          </p>
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <Card.Title class="text-sm font-medium">Orders Status</Card.Title>
          <CreditCard class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold">
            {dashboardData?.orders?.details?.ORDER_PLACED ?? 0}
          </div>
          <p class="text-xs text-muted-foreground">
            Processing: {dashboardData?.orders?.details?.ORDER_PROCESSING ?? 0}
          </p>
          <p class="text-xs text-muted-foreground">
            Delivered: {dashboardData?.orders?.details?.DELIVERED ?? 0}
          </p>
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <Card.Title class="text-sm font-medium">Processing Metrics</Card.Title
          >
          <Activity class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold">
            {dashboardData?.orders?.order_processing_time ?? "0"} days
          </div>
          <p class="text-xs text-muted-foreground">
            Return Rate: {dashboardData?.orders?.order_return_rate ?? "0"}%
          </p>
        </Card.Content>
      </Card.Root>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
      <Card.Root class="col-span-4">
        <Card.Header>
          <Card.Title>Monthly Sales</Card.Title>
        </Card.Header>
        <Card.Content>
          <Overview data={dashboardData?.sales} />
        </Card.Content>
      </Card.Root>

      <Card.Root class="col-span-4">
        <Card.Header>
          <Card.Title>Top Products</Card.Title>
        </Card.Header>
        <Card.Content>
          {#if dashboardData?.products?.top_products?.length}
            <div class="grid grid-cols-4 gap-4 py-2 font-medium text-sm">
              <div class="text-gray-500">Product Name</div>
              <div class="text-right text-gray-500">Total Quantity Sold</div>
              <div class="text-right text-gray-500">Total Revenue</div>
              <div class="text-right text-gray-500">Avg Revenue per Unit</div>
            </div>
            <div class="space-y-2">
              {#each dashboardData.products.top_products.sort((a, b) => b.total_quantity_sold - a.total_quantity_sold) as product}
                <div class="grid grid-cols-4 gap-4 items-center py-2">
                  <div class="font-semibold">
                    {product.product_variant__product__name}
                  </div>
                  <div class="text-right">
                    {product.total_quantity_sold.toLocaleString()}
                  </div>
                  <div class="text-right font-bold">
                    ₹{product.total_revenue.toLocaleString()}
                  </div>
                  <div class="text-right">
                    ₹{Math.round(product.total_revenue / product.total_quantity_sold).toLocaleString()}
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-center text-gray-500">No top products data available</p>
          {/if}
        </Card.Content>
      </Card.Root>
      
    </div>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card.Root class="col-span-3">
        <Card.Header>
          <Card.Title>Category Performance</Card.Title>
        </Card.Header>
        <Card.Content>
          {#if dashboardData?.products?.category_performance?.length}
            <div class="grid grid-cols-3 gap-4 py-2 font-medium text-sm">
              <div class="text-gray-500">Category</div>
              <div class="text-center text-gray-500">Total Quantity Sold</div>
              <div class="text-right text-gray-500">Total Revenue</div>
            </div>
            <div class="space-y-2">
              {#each dashboardData.products.category_performance.sort((a, b) => b.total_quantity_sold - a.total_quantity_sold) as category}
                <div class="grid grid-cols-3 gap-4 items-center py-2">
                  <div class="font-semibold">
                    {category.product_variant__product__categories__name}
                  </div>
                  <div class="text-center">
                    {category.total_quantity_sold.toLocaleString()}
                  </div>
                  <div class="text-right font-bold">
                    ₹{category.total_revenue.toLocaleString()}
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-center text-gray-500">No category performance data available</p>
          {/if}
        </Card.Content>
      </Card.Root>

      <Card.Root class="col-span-4">
        <Card.Header>
          <Card.Title>Low Performing Products</Card.Title>
        </Card.Header>
        <Card.Content>
          {#if dashboardData?.products?.low_performing_products?.length}
            <div class="grid grid-cols-4 gap-4 py-2 font-medium text-sm">
              <div class="text-gray-500">Product Name</div>
              <div class="text-right text-gray-500">Total Quantity Sold</div>
              <div class="text-right text-gray-500">Total Revenue</div>
              <div class="text-right text-gray-500">Avg Revenue per Unit</div>
            </div>
            <div class="space-y-2">
              {#each dashboardData.products.low_performing_products.sort((a, b) => a.total_quantity_sold - b.total_quantity_sold) as product}
                <div class="grid grid-cols-4 gap-4 items-center py-2">
                  <div class="font-semibold">
                    {product.product_name}
                  </div>
                  <div class="text-right text-red-500">
                    {product.total_quantity_sold.toLocaleString()} units
                  </div>
                  <div class="text-right font-bold text-red-500">
                    ₹{product.total_revenue.toLocaleString()}
                  </div>
                  <div class="text-right text-red-500">
                    ₹{Math.round(product.total_revenue / product.total_quantity_sold).toLocaleString()}
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-center text-gray-500">No low-performing products data available</p>
          {/if}
        </Card.Content>
      </Card.Root>
    </div>
  </Tabs.Content>
  {/if}
</div>