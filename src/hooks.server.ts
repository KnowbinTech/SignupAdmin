import {handleLogto} from '@logto/sveltekit';

export const handle = handleLogto(
    {
        endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
        appId: import.meta.env.VITE_LOGTO_APP_ID,
        appSecret: import.meta.env.VITE_LOGTO_APP_SECRET,
        resources: [import.meta.env.VITE_LOGTO_RESOURCE],
        scopes: ['all']
    },
    {
        encryptionKey: import.meta.env.VITE_LOGTO_COOKIE_ENCRYPTION_KEY
    } // Random-generated key
);