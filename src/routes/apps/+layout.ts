import type {LayoutServerLoad} from './$types';
import {redirect} from "@sveltejs/kit";


export const load: LayoutServerLoad = async ({parent, locals}) => {
    const {loggedUser} = await parent();

    if (loggedUser && loggedUser.user && !loggedUser.user.is_superuser) {
        redirect(302, '/unauthorized')
    }

};