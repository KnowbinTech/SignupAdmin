import type {PageLoad} from './$types';
import {redirect} from "@sveltejs/kit";


export const load: PageLoad = async ({parent, locals}) => {
    const {user, loggedUser} = await parent();

    if (user && loggedUser && loggedUser.user && loggedUser.user.is_superuser) {
        redirect(302, '/apps/dashboard');
    } else if (user && loggedUser && loggedUser.user) {
        redirect(302, '/unauthorized');
    } else {
        redirect(302, '/login');
    }
};
