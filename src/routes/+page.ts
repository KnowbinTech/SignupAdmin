import type {PageLoad} from './$types';
import {redirect} from "@sveltejs/kit";


export const load: PageLoad = async ({parent, locals}) => {
    const {user, loggedUser} = await parent();

    if (user && loggedUser && loggedUser.data && loggedUser.data.superUser) {
        redirect(302, '/apps');
    } else if (user && loggedUser && loggedUser.data) {
        redirect(302, '/unauthorized');
    } else {
        redirect(302, '/login');
    }
};
