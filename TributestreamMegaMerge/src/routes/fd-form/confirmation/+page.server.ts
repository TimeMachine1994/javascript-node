import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    let memorialData;
    try {
        const userCookie = cookies.get('user');
        if (userCookie) {
            const userData = JSON.parse(decodeURIComponent(userCookie));
            if (userData.metaResult?.meta_value) {
                // Parse the nested JSON string in meta_value
                memorialData = JSON.parse(userData.metaResult.meta_value);
                console.log('Parsed memorial data:', memorialData); // Debug log
            }
        }
    } catch (error) {
        console.error('Error parsing memorial data:', error);
        console.error('Error details:', error instanceof Error ? error.message : error);
    }

    return {
        memorialData
    };
};