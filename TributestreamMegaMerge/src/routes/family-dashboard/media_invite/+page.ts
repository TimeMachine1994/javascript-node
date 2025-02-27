import type { PageLoad } from './$types';
import type { PageData } from './types';

export const load = (({ data }: { data: PageData }): PageData => {
    return {
        user_id: data.user_id,
        token: data.token,
        userData: data.userData
    };
}) satisfies PageLoad;