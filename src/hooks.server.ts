import {handleLogto} from '@logto/sveltekit';

export const handle = handleLogto(
    {
        endpoint: 'https://auth.signupcasuals.com/',
        appId: '0k8939bw5azjujy1v7hze',
        appSecret: 'E8BDoSAuWzX7kj7HPAZIc9AttowM1R4p',
    },
    {encryptionKey: 'cM6mv5NyLWdOH6Tw3lf3JOZNob0VaOZg'} // Random-generated key
);