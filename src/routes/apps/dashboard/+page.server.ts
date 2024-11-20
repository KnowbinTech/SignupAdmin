import type {Actions} from './$types';

export const actions: Actions = {
    signOut: async ({locals}) => {
        const SIGN_OUT_REDIRECT = import.meta.env.VITE_LOGTO_SIGN_OUT_REDIRECT
        await locals.logtoClient.signOut(SIGN_OUT_REDIRECT);
    }
}
