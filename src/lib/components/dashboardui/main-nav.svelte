<script lang="ts">
    import {cn} from "$lib/utils.js";
    import * as Menubar from "$lib/components/ui/menubar";
    import {goto} from '$app/navigation';
    import {isLoggedIn} from "$lib/stores/data";


    let className: string | undefined | null = undefined;
    export {className as class};

    let menus = [
        {
            name: "Dashboard",
            icon: "fa-house",

            items: [
                {name: "Overview", page: "apps/dashboard"},
            ]
        },
        {
            name: "Sales",
            icon: "fa-cart-shopping",
            //route: "/orders",
            items: [
                {name: "Order Management", page: "apps/orders"},
                {name: "Transations", page: "apps/Transations"},
                {name: "Returns and Refunds", page: "apps/returns"},
                {name: "Invoices", page: "apps/invoices"},
            ]
        },
        {
            name: "Transactions",
            icon: "fa-cart-shopping",
            //route: "/orders",
            items: [
                {name: "Order Management", page: "apps/orders"}
            ]
        },
        {
            name: "Products",
            icon: "fa-tag",
            route: "apps/products",
            items: [
                {name: "Lookbook", page: "apps/lookbook"},
                {name: "Collection", page: "apps/collection"},
                {name: "Products", page: "apps/products"},
                {name: "Categories", page: "apps/categories"},
                {name: "Brands", page: "apps/brands"},
                {name: "Attribute Group", page: "apps/attribute-group"},
                {name: "Attributes", page: "apps/attributes"},
            ]
        },
        {
            name: "Customers",
            icon: "fa-user",

            items: [
                {name: "Customers", page: "apps/customers"},
                {name: "Customer Group", page: "apps/customer-group"},
                {name: "Review and Rating", page: "apps/reviews"}
            ]
        },
        {
            name: "CMS",
            icon: "fa-users-viewfinder",

            items: [
                {name: "Hero", page: "apps/hero"},
            ]
        },
        {
            name: "Settings",
            icon: "fa-gear",
            items: [
                {name: "General Settings", page: "apps/settings-general"},
                {name: "Tax Configuration", page: "apps/settings-tax"},
                {name: "Admin Users", page: "apps/settings-admin-users"},
            ]
        }
    ];

    async function navigate(page: string) {
        await goto(page);
    }

</script>

<nav class={cn("flex items-center space-x-4 lg:space-x-6", className)}>
    <Menubar.Root>
        {#each menus as menu}
            <Menubar.Menu>
                <Menubar.Trigger>{menu.name}</Menubar.Trigger>
                <Menubar.Content>
                    {#if menu.items}
                        {#each menu.items as item}
                            <Menubar.Item on:click={() => navigate(`/${item.page}`)}>
                                {item.name}
                            </Menubar.Item>
                        {/each}
                    {:else}
                        <Menubar.Item on:click={() => navigate(menu.route ?? '')}>
                            View
                        </Menubar.Item>
                    {/if}
                </Menubar.Content>
            </Menubar.Menu>
        {/each}
    </Menubar.Root>

</nav>