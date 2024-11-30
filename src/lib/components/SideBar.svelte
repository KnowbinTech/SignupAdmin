<script lang="ts">
  import { slide } from 'svelte/transition';
  import { goto } from '$app/navigation';
  

  let menus = [
    {
      name: "Dashboard",
      icon: "fa-house",
      route: "/apps/dashboard",
      // items: [
      //   { name: "Overview", page: "dashboard-overview" },
      // ]
    },
    {
      name: "Sales",
      icon: "fa-cart-shopping",
      //route: "/orders",
      items: [
        { name: "Order Management", page: "/apps/orders" },
        { name: "Returns and Refunds", page: "/apps/returns" },
        { name: "Invoices", page: "/apps/invoices" },
      ]
    },
    {
      name: "Transactions",
      icon: "fa-cart-shopping",
      //route: "/orders",
      items: [
        { name: "Order Management", page: "/apps/orders" },
      ]
    },
    {
      name: "Products",
      icon: "fa-tag",
      route: "/products",
      items: [
        { name: "Categories", page: "/apps/categories" },
        { name: "Brands", page: "/apps/brands" },
        { name: "Collection", page: "/apps/collection" },
        { name: "Lookbook", page: "/apps/lookbook" },
        { name: "Attributes", page: "/apps/attributes" },
        { name: "Attribute Group", page: "/apps/attribute-group" },
      ]
    },
    {
      name: "Customers",
      icon: "fa-user",
      route: "/apps/customers",
      items: [
        { name: "Customer Group", page: "customer-group" },
        { name: "Review and Rating", page: "reviews" }
      ]
    },
    {
      name: "Inventory",
      icon: "fa-warehouse",
      route: "/apps/inventory",
      items: [
        { name: "purchase orders", page: "purchase-orders" },
        { name: "stock levels", page: "stock" },
        { name: "stock adjustments", page: "stock-adjustment" },
        { name: "stock transfers", page: "stock-transfer" },
      ]
    },
    {
      name: "Reports",
      icon: "fa-file-invoice",
      //route: "/inventory",
      items: [
        { name: "Sales Report", page: "/apps/sales-report" },
        { name: "Product Report", page: "/apps/product-report" },

      ]
    },
    // Add other menu groups following the same structure
    {
      name: "Settings",
      icon: "fa-gear",
      items: [
        { name: "General Settings", page: "/apps/settings-general" },
        { name: "Payment Methods", page: "/apps/settings-payment" },
        { name: "Shipping Methods", page: "/apps/settings-shipping" },
        { name: "Tax Configuration", page: "/apps/settings-tax" },
        { name: "Admin Users", page: "/apps/settings-admin-users" },
      ]
    },
    {
      name: "Help and Support",
      icon: "fa-circle-question",
      items: [
        { name: "Knowledge Base", page: "/apps/support-knowledge-base" },
        { name: "Contact Support", page: "/apps/support-contact" },
        { name: "System Status", page: "/apps/support-system-status" },
      ]
    },
  ];

  let activeMenu: number | null = null;// intended to be `number | null`

  function toggleMenu(index: number) {
  const menu = menus[index];
  if (menu.route) {
    navigateTo(menu.route); // Navigate if there's a route
    activeMenu = index; // Ensure the submenu is opened
  } else {
    activeMenu = activeMenu === index ? null : index; // Toggle visibility of items
  }
}

  function navigateTo(page: string) {
    goto(page);
  }
</script>

<div class="md:flex hidden flex-col bg-background text-foreground h-full">
  <div class="flex flex-col p-4 gap-3">
    <div class="flex items-center align-middle gap-2">
      <img src="/SIGNUP_LOGO.png" alt="Signup Casuals Logo" class="py-4 w-40 ml-12 h-auto dark:invert">
      
    </div>
    <div class="flex flex-col gap-4 pl-2 mt-10">
      {#each menus as menu, index}
        <div>
          <button 
            on:click={() => toggleMenu(index)} 
            class="flex items-center gap-2 py-2 cursor-pointer text-neutral-800 dark:text-neutral-200 font-semibold focus:outline-none hover:text-violet-800 dark:hover:text-violet-400 rounded-md px-2 w-full text-left"
          >
            <i class={`fa-solid ${menu.icon}`}></i>
            {menu.name}
          </button>
          {#if activeMenu === index}
            <div class="pl-4">
              {#each menu.items ?? [] as item}
              <button 
                on:click={() => navigateTo(item.page)} 
                class="block py-1 cursor-pointer focus:outline-none font-medium dark:text-neutral-200 hover:text-violet-800 dark:hover:text-violet-400 rounded-md px-2 text-sm w-full text-left"
              >
                {item.name}
              </button>
            {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>