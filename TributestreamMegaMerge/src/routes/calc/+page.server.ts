import type { PageServerLoad } from './$types';

// We don't need to fetch memorial data here since it's provided by the layout
export const load: PageServerLoad = async ({ parent }) => {
  // Get the parent layout data which includes userData
  const { userData } = await parent();
  
  return {
    userData
  };
};