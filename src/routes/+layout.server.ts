import type {LayoutServerLoad} from './$types';


export const load: LayoutServerLoad = async ({locals, fetch}) => {
    let token;
    let isLoggedIn = false;
    let loggedUser = { data: null };

    const RESOURCE = import.meta.env.VITE_LOGTO_RESOURCE

    if (locals.user) {
        try {
            token = await locals.logtoClient.getAccessToken(RESOURCE);
            const response = await fetch(
                `/api/account/user/me/`,
                {headers: {Authorization: `Bearer ${token}`}}
            )
            loggedUser = await response.json();
            isLoggedIn = true;
        } catch (err) {
            console.log('err : ', err)
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