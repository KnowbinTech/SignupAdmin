import type {Actions} from './$types';

export const actions: Actions = {
    signIn: async ({locals}) => {
        const SIGN_IN_REDIRECT = import.meta.env.VITE_LOGTO_SIGN_IN_REDIRECT;
        await locals.logtoClient.signIn(SIGN_IN_REDIRECT);
    }
}
