import type {LayoutServerLoad} from './$types';


export const load: LayoutServerLoad = async ({locals, fetch}) => {
    let token;
    let isLoggedIn = false;
    let loggedUser = { data: null };

    const RESOURCE = import.meta.env.VITE_LOGTO_RESOURCE

    if (locals && locals.user) {
        try {
            token = await locals.logtoClient.getAccessToken(RESOURCE);
            const response = await fetch(
                `/api/auth/me`,
                {headers: {authorization: `Bearer ${token}`}}
            )
            loggedUser = await response.json();
            isLoggedIn = true;
        } catch (err) {
            locals.user = null
            token = ""
        }

    }

    return {
        user: locals.user ?? {},
        token: token ?? "",
        loggedUser: loggedUser,
        isLoggedIn: isLoggedIn
    };
};