import { writable } from "svelte/store";

type Attribute = {
    id: string;
    name: string;
    value: string [];
};



export const UserStore = writable(null)
export const isLoggedIn = writable(false)
export const attributeDataStore = writable<Attribute[]>([]);
export const productIdStore = writable(null);
export const productDetailsStore = writable({});
export const lookbookDetailsStore = writable({});